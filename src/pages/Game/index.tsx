import { FC, useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setGameAction,
	setVisibleStateMessage,
	setDefeat,
	setCheck,
	setIsAction,
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

import { assets, resizeHandler, getRoomIndexPosition } from './utils';
import styles from './../../stylesheet/styles/Game.module.scss';

const Game: FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { joinRoom, isAction, gameAction, check } = useSelector(
		(state: CustomRootState) => state.app,
	);
	console.log({ startAction: isAction });
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

	const stateActionHandler = () => {
		roomState?.players?.forEach(player => {
			if (player.me) {
				console.log('PLAYERSTATE: ', player.state);
				console.log({ isAction });

				if (!isAction) {
					console.log({ isAction });

					if (player.state === 'won') {
						roomResultStateRef.current = { ...roomState };
						dispatch(setGameAction({ state: player.state }));
						dispatch(setIsAction(true));
					}
					if (player.state === 'defeat') {
						dispatch(setGameAction({ state: player.state }));
						dispatch(setIsAction(true));
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
		if (diffRequestTime > 5) {
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

		if (room.state === 'bidding') {
			if (!room.players.some(player => player.me)) {
				navigate('/');
				location.reload();
			}
		}
		// console.log({ resultRoom: room }

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
			<Helmet>
				<title>Game</title>
				{assets.map((imageName, index) => (
					<link
						key={index}
						rel='preload'
						as='image'
						href={`./assets/cards/${imageName}.svg`}
					/>
				))}
			</Helmet>

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
			{gameAction.state === 'defeat' && (
				<ModalAfterGame
					title='Ви програли'
					message='Сума програшу:'
					isWin={false}
					isHide={false}
					sum={mePlayer.full_bid}
					onClick={() => {
						dispatch(setGameAction({ state: '' }));
					}}
				/>
			)}
			{gameAction.state === 'won' && roomResultStateRef.current.bank && (
				<ModalAfterGame
					title='Ви виграли'
					message='Сума виграшу:'
					isWin={true}
					isHide={false}
					sum={roomResultStateRef.current.bank * 0.95}
					onClick={() => {
						roomResultStateRef.current = {} as PublicRoomResponce;
						dispatch(setGameAction({ state: '' }));
					}}
				/>
			)}
			{gameAction.state === 'room-not-found' && (
				<ModalAfterGame
					title='Повідомлення'
					message="З'єднання з кімнатою було втрачене. Зайдіть в другу кімнату або звяжіться з нашими менеджерами."
					value='На головну'
					isHide={false}
					onClick={() => {
						dispatch(setGameAction({ state: '', prevState: 'room-not-found' }));
						navigate('/');
						location.reload();
					}}
				/>
			)}
		</>
	);
};

// game/////

export default Game;
