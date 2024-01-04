import { FC, useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setGameAction,
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

import { resizeHandler, getRoomIndexPosition } from './utils';
import styles from './../../stylesheet/styles/Game.module.scss';

const Game: FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { joinRoom, gameAction, check } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [roomState, setRoomState] = useState<PublicRoomResponce>(
		{} as PublicRoomResponce,
	);

	const [players, setPlayers] = useState<IPlayerRoom[]>([]);
	const [mePlayer, setMePlayer] = useState<IPlayerRoom>({} as IPlayerRoom);
	const [ready, setReady] = useState<boolean>(
		JSON.parse(localStorage.getItem('ready') || 'false'),
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [update, setUpdate] = useState<number>(1);
	const [opacity, setOpacity] = useState<number>(0);

	const [pos, setPos] = useState<number[]>([]);
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
	// const [lastId, setLastId] = useState<number>(-1);
	const lastMovePlayerRef = useRef<IPlayerRoom>({} as IPlayerRoom);
	const currentMovePlayerRef = useRef<IPlayerRoom>({} as IPlayerRoom);
	const roomResultStateRef = useRef<PublicRoomResponce>(
		{} as PublicRoomResponce,
	);
	const tableRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<number | null>(null);

	const reverseIds = [0, 1, 2, 9, 10];

	const startPolling = () => {
		if (timeoutRef.current) return;
		if (gameAction.prevState)
			dispatch(setGameAction({ state: '', prevState: '' }));

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

		if (!responce) return;
		const room = (responce.data && responce.data) || joinRoom;

		// if (room.state === 'result' && !room.players.some(player => player.me)) {
		// 	navigate('/');
		// }

		if (room.state === 'result') {
			if (!room.players.some(player => player.me)) {
				navigate('/');
			}
		}
		// console.log({ resultRoom: room }
		room.players.forEach(player => {
			if (player.me) {
				if (player.state === 'won') {
					roomResultStateRef.current = { ...room };
					dispatch(setGameAction({ state: player.state, prevState: '' }));
				} else if (player.state === 'defeat') {
					dispatch(setGameAction({ state: player.state, prevState: '' }));
					dispatch(setCheck({ visible: true, id: player.id }));
					setTimeout(() => {
						dispatch(setCheck({ visible: false, id: player.id }));
					}, 4000);
					dispatch(setDefeat(true));
				} else {
					console.log('PLAYERSTATE: ', player.state);
				}
			}
		});
		// }
		if (room.template) {
			localStorage.removeItem('joinRoom');
			localStorage.removeItem('ready');
		}

		if (!room.players) return;
		room.players.forEach(async player => {
			if (player.me) {
				setMePlayer(player);
			}

			// if (player.state === 'defeat' && player.me && !defeat) {
			// 	dispatch(setDefeat(true));
			// 	dispatch(setCheck({ visible: true, id: player.id }));
			// 	console.log({ playerDefeat: player });
			// } else if (player.state === 'defeat' && !player.me) {
			// 	console.log('win');
			// }
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

	const readyHandler = async () => {
		await AdminService.roomIsReady(true);
		localStorage.setItem('ready', 'true');
		setReady(true);
	};

	const getLastId = () => {
		let id = roomState.players.length - 1;
		let lastPlayer = roomState.players[id];
		let state = lastPlayer.state === 'defeat';
		while (state) {
			id = id - 1;
			lastPlayer = roomState.players[id];
			state = lastPlayer.state === 'defeat';
		}
		return lastPlayer.id;
	};

	const handleFullScreen = () => {
		const element = document.documentElement; // Fullscreen the entire document

		if (!isFullScreen && element.requestFullscreen) {
			element.requestFullscreen();
			setIsFullScreen(true);
		} else if (isFullScreen) {
			document.exitFullscreen();
			setIsFullScreen(false);
		}
		resizeHandler(tableRef);
	};

	useEffect(() => {
		window.addEventListener('resize', () => {
			resizeHandler(tableRef);
		});
		resizeHandler(tableRef);
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
			}, 3000);
		})();

		return () => stopPolling();
	}, [joinRoom]);

	useEffect(() => {
		resizeHandler(tableRef);
	});

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
					onDoubleClick={handleFullScreen}
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
			{gameAction.state === 'defeat' && !gameAction.prevState && (
				<ModalAfterGame
					title='Ви програли'
					message='Сума програшу:'
					isWin={false}
					isHide={false}
					sum={mePlayer.full_bid}
					onClick={() => {
						dispatch(setGameAction({ state: '', prevState: 'defeat' }));
						navigate('/game');
					}}
				/>
			)}
			{gameAction.state === 'won' &&
				!gameAction.prevState &&
				roomResultStateRef.current.bank && (
					<ModalAfterGame
						title='Ви виграли'
						message='Сума виграшу:'
						isWin={true}
						isHide={false}
						sum={roomResultStateRef.current.bank * 0.95}
						onClick={() => {
							roomResultStateRef.current = {} as PublicRoomResponce;
							dispatch(setGameAction({ state: '', prevState: 'won' }));
							navigate('/game');
						}}
					/>
				)}
			{gameAction.state === 'room-not-found' && !gameAction.prevState && (
				<ModalAfterGame
					title='Повідомлення'
					message="З'єднання з кімнатою було втрачене. Зайдіть в другу кімнату або звяжіться з нашими менеджерами."
					value='На головну'
					isHide={false}
					onClick={() => {
						dispatch(setGameAction({ state: '', prevState: 'room-not-found' }));
						navigate('/');
					}}
				/>
			)}
		</>
	);
};

export default Game;
