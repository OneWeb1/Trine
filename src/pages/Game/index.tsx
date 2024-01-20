import { FC, useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setGameAction,
	setRoomResultState,
	// setVisibleStateMessage,
	// setIsAction,
} from '../../store/slices/app.slice';

import GameHeader from '../../components/GameHeader';
import GameFooter from '../../components/GameFooter';
import Table from './components/Table';
import PortraitTable from './components/PortraitTable';

import ModalAfterGame from '../../components/modals/ModalAfterGame';
import Spinner from '../../components/spinner';

import AdminService from '../../services/AdminService';

import { RoomsResponse } from '../../models/response/AdminResponse';
import { IPlayerRoom } from '../Admin/interfaces';

import { assets, resizeHandler } from './utils';
import styles from './../../stylesheet/styles/Game.module.scss';
// import Button from '../../UI/Button';
import ModalTimer from '../../components/modals/ModalTimer';

const Game: FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { gameAction } = useSelector((state: CustomRootState) => state.app);
	const [roomState, setRoomState] = useState<RoomsResponse>(
		{} as RoomsResponse,
	);

	const [mePlayer, setMePlayer] = useState<IPlayerRoom>({} as IPlayerRoom);
	const [ready, setReady] = useState<boolean>(
		JSON.parse(localStorage.getItem('ready') || 'false'),
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [update, setUpdate] = useState<number>(1);
	const [opacity, setOpacity] = useState<number>(0);

	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
	// const [setIsLandscape] = useState<boolean>(true);

	const tableRef = useRef<HTMLDivElement>(null);

	const isMobile = window.innerWidth <= 600 && window.innerHeight > 500;

	const readyHandler = async () => {
		try {
			const { data } = await AdminService.roomIsReady(true);
			if (data) return true;
		} catch (e) {
			console.log(e);
		}
	};

	const handleFullScreen = () => {
		const element = document.documentElement;

		if (!isFullScreen && element.requestFullscreen) {
			element.requestFullscreen();
			setIsFullScreen(true);
		} else if (isFullScreen) {
			document.exitFullscreen();
			setIsFullScreen(false);
		}
		resizeHandler(tableRef);
	};

	// const orientationChange = () => {
	// 	if (window.orientation === 90 || window.orientation === -90) {
	// 		setIsLandscape(true);
	// 	} else {
	// 		setIsLandscape(false);
	// 	}
	// };

	// function isMobileDevice() {
	// 	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
	// 		navigator.userAgent,
	// 	);
	// }

	useEffect(() => {
		// if (isMobileDevice()) {
		// 	// (window.screen.orientation as any).lock('landscape');
		// 	orientationChange();
		// 	window.addEventListener('orientationchange', orientationChange);
		// }
		window.addEventListener('resize', resizeHandler.bind(null, tableRef));
		// return () => {
		// 	if (isMobileDevice()) {
		// 		// document.exitFullscreen();
		// 		window.addEventListener('orientationchange', orientationChange);
		// 	}
		// };
	}, []);

	resizeHandler(tableRef);

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
			{update && (
				<div
					className={styles.page}
					style={{ transition: '3s', opacity: opacity }}>
					<GameHeader
						isFullScreen={isFullScreen}
						handleFullScreen={handleFullScreen}
					/>
					{isMobile && (
						<PortraitTable
							roomState={roomState}
							setRoomState={setRoomState}
							ready={ready}
							setReady={setReady}
							setLoading={setLoading}
							mePlayer={mePlayer}
							setMePlayer={setMePlayer}
							setUpdate={setUpdate}
							setOpacity={setOpacity}
							tableRef={tableRef}
						/>
					)}
					<Table
						roomState={roomState}
						setRoomState={setRoomState}
						ready={ready}
						setReady={setReady}
						setLoading={setLoading}
						mePlayer={mePlayer}
						setMePlayer={setMePlayer}
						setUpdate={setUpdate}
						setOpacity={setOpacity}
						tableRef={tableRef}
					/>
					{!loading && (
						<GameFooter
							isEnable={
								mePlayer.state === 'move' && roomState.state === 'bidding'
							}
							isReady={ready}
							joinTax={Number(roomState.join_tax)}
							maxBid={Number(roomState.max_bid)}
							bid={Number(roomState.bid)}
							fullBid={mePlayer.full_bid}
							readyHandler={readyHandler}
							loading={loading}
						/>
					)}
				</div>
			)}

			{roomState.state === 'starting' && (
				<ModalTimer timer={roomState.time_to_start} />
			)}

			{gameAction.state === 'won' && (
				<ModalAfterGame
					title='Ви виграли'
					message='Сума виграшу:'
					isWin={true}
					sum={Math.floor(roomState.bank * 0.97)}
					isHide={false}
					onClick={() => {
						console.log(555);
						setRoomResultState({} as RoomsResponse);
						dispatch(setGameAction({ state: '' }));
					}}
				/>
			)}
			{/* {gameAction.state === 'defeat' && (
				<ModalAfterGame
					title='Ви програли'
					message='Сума програшу:'
					isWin={false}
					sum={mePlayer.full_bid}
					onClick={() => {
						dispatch(setGameAction({ state: '' }));
					}}
				/>
			)} */}

			{gameAction.state === 'room-not-found' && (
				<ModalAfterGame
					title='Повідомлення'
					message="З'єднання з кімнатою було втрачене. Зайдіть в другу кімнату або звяжіться з нашими менеджерами."
					value='На головну'
					isHide={false}
					onClick={() => {
						dispatch(setGameAction({ state: '' }));
						navigate('/');
						location.reload();
					}}
				/>
			)}

			{/* {!isLandscape && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						zIndex: 10000,
						background: '#090f1e',
					}}
					className={styles.flex}>
					<div>
						Гра не підтримує портретний режим. Для того щоб продовжити гру
						поверніться в альбомний режим або покиньте кімнату.
						<Link to='/'>
							<Button
								style={{
									maxWidth: '180px',
									margin: '20px auto',
									padding: '5px 20px',
								}}
								value='Покинути кімнату'
								onClick={() => {}}
							/>
						</Link>
					</div>
				</div>
			)} */}
		</>
	);
};

// game/////

export default Game;
