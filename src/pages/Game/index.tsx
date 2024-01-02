import { FC, useState, useRef, useEffect } from 'react';

// import { useParams } from 'react-router-dom';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setGameOverAction,
	setVisibleStateMessage,
	setDefeat,
	setCheck,
} from '../../store/slices/app.slice';

import GameHeader from '../../components/GameHeader';
import GameFooter from '../../components/GameFooter';

import Player from '../../components/Player';
import FishkaItem from '../../components/FishkaItem';
import ModalAfterGame from '../../components/modals/ModalAfterGame';
import Spinner from '../../components/spinner';

import AdminService from '../../services/AdminService';

import { PublicRoomResponce } from '../../models/responce/AdminResponce';
import { IPlayerRoom } from '../Admin/interfaces';

import { resizeHandler, getIdx } from './utils';
import styles from './../../stylesheet/styles/Game.module.scss';

const Game: FC = () => {
	const dispatch = useDispatch();
	const { joinRoom, gameOverAction, defeat, check } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [roomState, setRoomState] = useState<PublicRoomResponce>(
		{} as PublicRoomResponce,
	);

	const [players, setPlayers] = useState<IPlayerRoom[]>([]);
	const [mePlayer, setMePlayer] = useState<IPlayerRoom>({} as IPlayerRoom);
	const [lastPlayer, setLastPlayer] = useState<IPlayerRoom>({} as IPlayerRoom);
	const [ready, setReady] = useState<boolean>(
		JSON.parse(localStorage.getItem('ready') || 'false'),
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [update, setUpdate] = useState<number>(1);
	const [opacity, setOpacity] = useState<number>(0);

	const [pos, setPos] = useState<number[]>([]);

	const lastMovePlayerRef = useRef<IPlayerRoom>({} as IPlayerRoom);
	const currentMovePlayerRef = useRef<IPlayerRoom>({} as IPlayerRoom);
	const roomResultStateRef = useRef<PublicRoomResponce>(
		{} as PublicRoomResponce,
	);
	const tableRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<number | null>(null);

	const reverseIds = [0, 1, 2, 11, 10];

	const startPolling = () => {
		if (timeoutRef.current) return;

		timeoutRef.current = setInterval(async () => {
			const responce = await AdminService.getPublicRoomByState(joinRoom.id);
			if (!responce) return;
			if (!responce.data) return;

			await getRoomState();
		}, 1000);
	};

	const stopPolling = () => {
		if (!timeoutRef.current) return;

		clearInterval(timeoutRef.current);
		timeoutRef.current = null;
	};

	const getRoomState = async () => {
		const responce = await AdminService.getPublicRoomByState(joinRoom.id);
		// if (!responce) {
		// 	dispatch(setGameOverAction({ state: 'room-not-found' }));
		// 	stopPolling();
		// 	return;
		// }log()
		if (!responce) return;
		const room = (responce.data && responce.data) || joinRoom;
		const players = [] as IPlayerRoom[];
		let isAdd = false;
		if (room.state !== 'player_recruitment' && room.state !== 'bidding') {
			console.log({ room });
		}
		if (room.state === 'result') {
			console.log({ resultRoom: room });
			// if (!room.players.length) {
			// 	console.log({ resultPlayers: room.players });
			// 	console.log('win');
			// 	roomResultStateRef.current = { ...room };
			// 	dispatch(setGameOverAction({ state: 'win' }));
			// 	return;
			// }
			if (room.players.length === 1) {
				const player = room.players[0];
				console.log({ playerOne: player });
				if (player.state === 'won' && !player.me) {
					dispatch(setDefeat(true));
					dispatch(setCheck({ visible: true, id: player.id }));
					console.log('won');
				}
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
				isAdd = true;
			}
			if (
				player.state !== 'idle' &&
				player.state !== 'defeat' &&
				player.state !== 'ready' &&
				player.state !== 'move'
			) {
				if (player.state === 'won' && !player.me) {
					alert('LOse');
					roomResultStateRef.current = { ...room };
					dispatch(setGameOverAction({ state: 'lose' }));
				} else if (player.state === 'won' && player.me) {
					alert('win');
				}
				console.log({ palyerState: player, state: player.state });
				// if (player.state === 'won' && !player.me) {
				// 	dispatch(setDefeat(true));
				// 	dispatch(setCheck({ visible: true, id: player.id }));
				// }
			}

			if (player.state === 'defeat' && !defeat) {
				dispatch(setDefeat(true));
				dispatch(setCheck({ visible: true, id: player.id }));
				console.log({ playerDefeat: player });
			}
			if (isAdd) players.push({ ...player });
		});
		room.players.forEach((player, idx) => {
			if (player.me) {
				setLastPlayer(
					room.players[idx - 1] || room.players[room.players.length - 1],
				);

				isAdd = false;
			}
			if (isAdd) players.push({ ...player });
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
		setPlayers(players);
		setPos(getIdx(players.length));
		setRoomState(room);
		setUpdate(prev => (prev += 1));
	};

	const readyHandler = async () => {
		await AdminService.roomIsReady(true);
		localStorage.setItem('ready', 'true');
		setReady(true);
	};
	useEffect(() => {
		window.addEventListener('resize', () => {
			const screenWidth = window.innerWidth;

			resizeHandler(tableRef, screenWidth);
		});
	}, []);
	useEffect(() => {
		(async () => {
			await getRoomState();
			setUpdate(1);
			stopPolling();
			startPolling();

			setTimeout(() => {
				setLoading(false);
				setOpacity(1);
			}, 1000);
		})();

		return () => stopPolling();
	}, [joinRoom]);

	return (
		<>
			{loading && (
				<div className='flex-center'>
					<Spinner />
				</div>
			)}
			{update && roomState.join_tax && (
				<div
					className={styles.page}
					style={{ transition: '3s', opacity: opacity }}>
					<GameHeader />
					<div className={styles.tableWrapper}>
						<div className={styles.table} ref={tableRef}>
							{players.map((player, idx) => (
								<Player
									key={idx}
									cards={mePlayer.cards}
									player={player}
									reverse={reverseIds.includes(pos[idx])}
									isMeMove={mePlayer.state === 'move'}
									isReady={ready}
									check={check}
									bet={player.last_bid}
									lastId={lastPlayer?.id}
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
					<GameFooter
						isEnable={
							mePlayer.state === 'move' && roomState.state === 'bidding'
						}
						isReady={ready}
						joinTax={Number(roomState.join_tax)}
						maxBid={Number(roomState.max_bid)}
						bid={Number(roomState.bid)}
						readyHandler={readyHandler}
					/>
				</div>
			)}

			{gameOverAction.state === 'lose' && (
				<ModalAfterGame
					title='Ви програли'
					message='Сума програшу:'
					isWin={false}
					isHide={false}
					sum={mePlayer.full_bid}
					onClick={() => {
						dispatch(setGameOverAction({ state: '' }));
					}}
				/>
			)}
			{gameOverAction.state === 'win' && (
				<ModalAfterGame
					title='Ви виграли'
					message='Сума виграшу:'
					isWin={true}
					isHide={false}
					sum={roomResultStateRef.current.bank * 0.95}
					onClick={() => {
						dispatch(setGameOverAction({ state: '' }));
					}}
				/>
			)}
			{gameOverAction.state === 'room-not-found' && (
				<ModalAfterGame
					title='Повідомлення'
					message="З'єднання з кімнатою було втрачене. Зайдіть в другу кімнату або звяжіться з нашими менеджерами."
					value='На головну'
					isHide={false}
					onClick={() => {
						dispatch(setGameOverAction({ state: '' }));
					}}
				/>
			)}
		</>
	);
};

export default Game;
