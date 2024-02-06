import {
	FC,
	memo,
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
	// setDefeat,
	// setCheck,
	// setIsAction,
	setRoomResultState,
	setIsEnable,
} from '../../../../store/slices/app.slice';

import LandscapeTable from './LandscapeTable';
import MobilePortraitTable from './MobilePortraitTable';
import Player from '../../../../components/Player';
// import FishkaItem from '../../../../components/FishkaItem';

import { resizeHandler, getRoomsIndexPosition } from './../../utils';

import AdminService from '../../../../services/AdminService';

import { IPlayerRoom } from '../../../Admin/interfaces';

// import styles from './Table.module.scss';
import { RoomsResponse } from '../../../../models/response/AdminResponse';
import GameService from '../../../../services/GameService';

interface ITable {
	roomState: RoomsResponse;
	setRoomState: Dispatch<SetStateAction<RoomsResponse>>;
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
	const { joinRoom, check } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [players, setPlayers] = useState<IPlayerRoom[]>([]);
	const [pos, setPos] = useState<number[]>([]);

	const recruitmentStateRef = useRef<{ [key: number]: string }>(
		{} as { [key: number]: string },
	);
	const playersReadyRef = useRef<number[]>([] as number[]);
	const lastMovePlayerRef = useRef<IPlayerRoom>({} as IPlayerRoom);
	const currentMovePlayerRef = useRef<IPlayerRoom>({} as IPlayerRoom);
	const timeoutRef = useRef<number | null>(null);
	const requestStateTime = useRef<number>(new Date().getTime());
	const isActionRef = useRef<boolean>(
		JSON.parse(localStorage.getItem('isAction') || 'false'),
	);
	const isWriteReadyState = useRef<boolean>(false);

	const isMobile = window.innerWidth <= 600 && window.innerHeight > 500;

	// const h = window.innerHeight;

	const reverseIds = [0, 1, 2, 9, 10];

	const startPolling = () => {
		if (timeoutRef.current) return;

		timeoutRef.current = setInterval(async () => {
			await getRoomsState();
		}, 500);
	};

	const stopPolling = () => {
		if (!timeoutRef.current) return;

		clearInterval(timeoutRef.current);
		timeoutRef.current = null;
	};

	const stateActionHandler = () => {
		if (!roomState.players) return;
		if (roomState.state === 'result') {
			setRoomResultState({ ...roomState });
		}
		if (roomState.state === 'bidding') {
			isWriteReadyState.current = false;
		}

		roomState.players.forEach(player => {
			if (player.me && !isActionRef.current && player.state === 'won') {
				isActionRef.current = true;
				isWriteReadyState.current = true;
				playersReadyRef.current = [] as number[];
				recruitmentStateRef.current = {} as { [key: number]: string };
				localStorage.setItem('isAction', 'true');
				dispatch(setGameAction({ state: player.state }));
			}
		});

		if (
			(roomState.state === 'player_recruitment' ||
				roomState.state === 'result') &&
			mePlayer.state !== 'ready'
		) {
			if (ready) {
				setReady(false);
				localStorage.setItem('ready', 'false');
			}
		} else {
			if (!ready) {
				if (isActionRef.current) {
					isActionRef.current = false;
					localStorage.setItem('isAction', 'false');
				}

				if (!roomState.players.some(player => player.me)) {
					reJoinRoom();
				}
				setReady(true);
				localStorage.setItem('ready', 'true');
			}
		}
	};

	const reJoinRoom = async () => {
		try {
			await AdminService.roomLeave();
		} catch (e) {
			console.log(e);
		}
		try {
			await GameService.joinRoom(joinRoom.id);
		} catch {
			navigate('/');
		}
	};

	const writeStates = (room: RoomsResponse) => {
		if (Object.keys(recruitmentStateRef.current).length < room.players.length) {
			room.players.forEach(player => {
				const { state, id } = player;
				if (
					!playersReadyRef.current.includes(id) &&
					!recruitmentStateRef.current[id]
				) {
					recruitmentStateRef.current[id] = state;
				}
			});
		}
	};

	const showReadyMessage = (room: RoomsResponse) => {
		room.players.forEach(player => {
			const prevState = recruitmentStateRef.current[player.id];
			if (
				!playersReadyRef.current.includes(player.id) &&
				player.state !== prevState
			) {
				playersReadyRef.current.push(player.id);
				delete recruitmentStateRef.current[player.id];
				dispatch(
					setVisibleStateMessage({
						visible: true,
						message: 'Готовий',
						id: player.id,
					}),
				);
				setTimeout(() => {
					dispatch(setVisibleStateMessage({ visible: false, id: -1 }));
				}, 4000);
			}
		});
	};

	const translateStateToMessage = (state: string): string => {
		const states: { [key: string]: string } = {
			support: 'Підтримати',
			raise: 'Підвищити',
			check: 'Дивитися',
			drop: 'Впасти',
		};

		return states[state];
	};

	const getRoomsState = async () => {
		const diffRequestTime =
			(new Date().getTime() - requestStateTime.current) / 1000;
		if (diffRequestTime > 1) {
			requestStateTime.current = new Date().getTime();
		} else return;

		const response = await AdminService.getPublicRoomByState(joinRoom.id);
		if (!response) return;
		const room = (response.data && response.data) || joinRoom;

		if (
			(room.state === 'player_recruitment' || room.state === 'result') &&
			!room.players.some(player => player.me) &&
			room.players[0].state !== 'ready'
		) {
			reJoinRoom();
		}
		if (room.state === 'player_recruitment' || isWriteReadyState.current) {
			writeStates(room);
			showReadyMessage(room);
		}

		// if (room.template) {
		// 	localStorage.removeItem('joinRoom');
		// 	localStorage.removeItem('ready');
		// }

		if (mePlayer.state !== 'move') {
			dispatch(setIsEnable(true));
		}

		if (!room.players) return;
		room.players.forEach(async player => {
			if (player.me) {
				if (player.time_for_move < 0) {
					await AdminService.do({ action: 'drop' });
				}
				setMePlayer(player);
			}
		});

		lastMovePlayerRef.current = { ...currentMovePlayerRef.current };
		room.players.forEach(player => {
			if (player.state === 'move') {
				currentMovePlayerRef.current = { ...player };
			}
		});
		if (lastMovePlayerRef.current.id !== currentMovePlayerRef.current.id) {
			const lastMove = room.players.find(
				player => player.id === lastMovePlayerRef.current.id,
			)?.last_move;
			const moveMessageText = translateStateToMessage(String(lastMove));
			if (!moveMessageText) return;
			dispatch(
				setVisibleStateMessage({
					visible: true,
					message: moveMessageText,
					id: lastMovePlayerRef.current.id,
				}),
			);
			setTimeout(() => {
				dispatch(setVisibleStateMessage({ visible: false, id: -1 }));
			}, 3000);
		}
		setPlayers(room.players);
		setPos(getRoomsIndexPosition(room.players.length));
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
			if (!lastPlayer || lastPlayer.me) {
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
			await getRoomsState();
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
		<>
			{isMobile && (
				<MobilePortraitTable tableRef={tableRef} roomState={roomState}>
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
							roomState={roomState}
							bet={player.last_bid}
							lastId={getLastId()}
							index={pos[idx]}
						/>
					))}
				</MobilePortraitTable>
			)}
			{!isMobile && (
				<LandscapeTable tableRef={tableRef} roomState={roomState}>
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
							roomState={roomState}
							bet={player.last_bid}
							lastId={getLastId()}
							index={pos[idx]}
						/>
					))}
				</LandscapeTable>
			)}
		</>
	);
};

const memoTable = memo(Table);

export default memoTable;
