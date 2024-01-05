import {
	FC,
	useState,
	useRef,
	useEffect,
	Dispatch,
	SetStateAction,
	RefObject,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { RootState as CustomRootState } from '../../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';

import {
	setGameAction,
	setVisibleStateMessage,
	setDefeat,
	setCheck,
	setIsAction,
	setRoomResultState,
} from '../../../../store/slices/app.slice';

import Player from '../../../../components/Player';
import FishkaItem from '../../../../components/FishkaItem';

import { resizeHandler, getRoomIndexPosition } from './../../utils';

import AdminService from '../../../../services/AdminService';

import { IPlayerRoom } from '../../../Admin/interfaces';

import styles from './Table.module.scss';
import { PublicRoomResponce } from '../../../../models/responce/AdminResponce';
// import GameService from '../../../../services/GameService';

interface ITable {
	roomState: PublicRoomResponce;
	setRoomState: Dispatch<SetStateAction<PublicRoomResponce>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
	ready: boolean;
	setReady: Dispatch<SetStateAction<boolean>>;
	mePlayer: IPlayerRoom;
	setMePlayer: Dispatch<SetStateAction<IPlayerRoom>>;
	setUpdate: Dispatch<SetStateAction<number>>;
	setOpacity: Dispatch<SetStateAction<number>>;
	tableRef: RefObject<HTMLDivElement>;
}

const Table: FC<ITable> = ({
	roomState,
	setRoomState,
	setLoading,
	ready,
	setReady,
	mePlayer,
	setMePlayer,
	setUpdate,
	setOpacity,
	tableRef,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { joinRoom, isAction, check } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [players, setPlayers] = useState<IPlayerRoom[]>([]);
	const [pos, setPos] = useState<number[]>([]);
	const lastMovePlayerRef = useRef<IPlayerRoom>({} as IPlayerRoom);
	const currentMovePlayerRef = useRef<IPlayerRoom>({} as IPlayerRoom);
	const timeoutRef = useRef<number | null>(null);
	const requestStateTime = useRef<number>(new Date().getTime());

	const reverseIds = [0, 1, 2, 9, 10];

	const startPolling = () => {
		if (timeoutRef.current) return;

		timeoutRef.current = setInterval(async () => {
			await getRoomState();
		}, 1000);
	};

	const stopPolling = () => {
		if (!timeoutRef.current) return;

		clearInterval(timeoutRef.current);
		timeoutRef.current = null;
	};

	const isMeReady = (room: PublicRoomResponce) => {
		for (let i = 0; i < room.players.length; i++) {
			const player = room.players[i];
			if (player.me && player.state === 'ready') return true;
		}

		return false;
	};

	const roomJoin = async () => {
		try {
			setReady(false);
			localStorage.setItem('ready', 'false');
		} catch (e) {
			console.log(e);
		}
	};

	const stateActionHandler = () => {
		if (!roomState.players) return;

		if (roomState.state === 'result') {
			if (!isMeReady(roomState)) {
				roomJoin();
			}
			setRoomResultState({ ...roomState });
		}

		roomState.players.forEach(player => {
			if (player.me) {
				console.log('PLAYERSTATE: ', player.state);
				console.log({ isAction });
				if (!isAction) {
					if (player.state === 'won') {
						localStorage.setItem('isAction', JSON.stringify(true));
						dispatch(setGameAction({ state: player.state }));
						dispatch(setIsAction(true));
					}
					if (player.state === 'defeat') {
						dispatch(setGameAction({ state: player.state }));
						dispatch(setIsAction(true));
						localStorage.setItem('isAction', JSON.stringify(true));
						dispatch(setCheck({ visible: true, id: player.id }));
						setTimeout(() => {
							dispatch(setCheck({ visible: false, id: player.id }));
						}, 4000);
						dispatch(setDefeat(true));
					}
				}
			}
		});
	};

	const getRoomState = async () => {
		const diffRequestTime =
			(new Date().getTime() - requestStateTime.current) / 1000;
		if (diffRequestTime > 1) {
			requestStateTime.current = new Date().getTime();
		} else return;

		const responce = await AdminService.getPublicRoomByState(joinRoom.id);
		if (!responce) return;
		const room = (responce.data && responce.data) || joinRoom;

		if (
			(room.state === 'player_recruitment' || room.state === 'result') &&
			room.players.length === 1 &&
			!room.players.some(player => player.me) &&
			room.players[0].state !== 'ready'
		) {
			navigate('/');
			location.reload();
		}

		if (room.state === 'player_recruitment') {
			const storageIsAction = JSON.parse(
				localStorage.getItem('isAction') || 'false',
			);
			if (storageIsAction)
				localStorage.setItem('isAction', JSON.stringify(false));
		}

		if (room.state === 'bidding') {
			if (!room.players.some(player => player.me)) {
				navigate('/');
				location.reload();
			}
		}

		if (room.template) {
			localStorage.removeItem('joinRoom');
			localStorage.removeItem('ready');
		}

		if (!room.players) return;
		room.players.forEach(async player => {
			if (player.me) {
				setMePlayer(player);
			}
		});

		lastMovePlayerRef.current = { ...currentMovePlayerRef.current };
		room.players.forEach(player => {
			if (player.state === 'move') currentMovePlayerRef.current = { ...player };
		});
		if (lastMovePlayerRef.current.id !== currentMovePlayerRef.current.id) {
			dispatch(
				setVisibleStateMessage({
					visible: true,
					id: lastMovePlayerRef.current.id,
				}),
			);
			setTimeout(() => {
				dispatch(setVisibleStateMessage({ visible: false, id: -1 }));
			}, 3000);
		}
		setPlayers(room.players);
		setPos(getRoomIndexPosition(room.players.length));
		setRoomState(room);
		setUpdate(prev => (prev += 1));
	};

	const getLastId = () => {
		let id = roomState.players.length - 1;
		let lastPlayer = roomState.players[id];
		if (!lastPlayer) return -1;
		let state = lastPlayer.state === 'defeat';
		while (state) {
			id = id - 1;
			lastPlayer = roomState.players[id];
			if (!lastPlayer) {
				state = false;
				lastPlayer = { id: -1 } as IPlayerRoom;
				continue;
			}
			state = lastPlayer.state === 'defeat';
		}
		return lastPlayer.id;
	};

	useEffect(() => {
		(async () => {
			await getRoomState();
			setUpdate(1);
			stopPolling();
			startPolling();

			setTimeout(() => {
				setLoading(false);
				setOpacity(1);
			}, 5000);
		})();

		return () => stopPolling();
	}, [joinRoom]);

	useEffect(() => {
		stateActionHandler();
		resizeHandler(tableRef);
	});

	return (
		<div className={styles.tableWrapper}>
			<div className={styles.table} ref={tableRef}>
				{players.map((player, idx) => (
					<Player
						key={idx}
						cards={mePlayer.cards}
						player={player}
						reverse={reverseIds.includes(pos[idx])}
						isMeMove={mePlayer.state === 'move'}
						isVisibleCards={roomState.state === 'bidding'}
						isReady={ready}
						check={check}
						bet={player.last_bid}
						lastId={getLastId()}
						index={pos[idx]}
					/>
				))}

				<div className={styles.tableBorder}>
					<div className={styles.tableField}>
						<div className={styles.screenCenter}>
							<div className={styles.displayWrapper}>
								<div className={styles.tax}>
									Налог (5%){' '}
									<span
										className={styles.taxNumber}
										style={{ marginLeft: '3px', fontWeight: '600' }}>
										{(roomState.bank * 0.05).toFixed(1)}
									</span>
								</div>
								<FishkaItem value={roomState.bank} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Table;
