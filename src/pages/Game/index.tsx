import { FC, useState, useRef, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setGameAction,
	// setRoomResultState,
	setRefreshBottomMenu,
	setJoinRoom,
	// setVisibleStateMessage,
	// setIsAction,
} from '../../store/slices/app.slice';

import GameHeader from '../../components/GameHeader';
import GameFooter from '../../components/GameFooter';
import Table from './components/Table';
// import PortraitTable from './components/PortraitTable';

import ModalAfterGame from '../../components/modals/ModalAfterGame';
// import Spinner from '../../components/spinner';

import AdminService from '../../services/AdminService';

import { RoomsResponse } from '../../models/response/AdminResponse';
import { IPlayerRoom } from '../Admin/interfaces';

import { assets, resizeHandler } from './utils';
import styles from './../../stylesheet/styles/Game.module.scss';
// import Button from '../../UI/Button';
import ModalTimer from '../../components/modals/ModalTimer';
import GameService from '../../services/GameService';
import Loader from '../../components/loader';

const Game: FC = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { gameAction, refreshBottomMenu } = useSelector(
		(state: CustomRootState) => state.app,
	);
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

	const readyHandler = async () => {
		try {
			const { data } = await AdminService.roomIsReady(true);
			setRefreshBottomMenu();
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

	const getRooms = async () => {
		const joinRoom = JSON.parse(localStorage.getItem('joinRoom') || '{}');

		const { data } = await AdminService.getPublicRoomByState(joinRoom.id, true);
		const openRoomIdFromUrl = window.location.href.split('/');
		const urlRoomId = openRoomIdFromUrl[openRoomIdFromUrl.length - 1];

		const openRoom = data.room || urlRoomId;

		if (!Object.keys(joinRoom).length && openRoom) {
			const { data } = await GameService.joinRoom(openRoom.id);
			dispatch(setJoinRoom(data));
			localStorage.setItem('joinRoom', JSON.stringify(data));
			return;
		}

		if (!openRoom || (openRoom && openRoom.id !== id)) {
			navigate(`/game/${id}/not-found`);
		}
	};

	useEffect(() => {
		document.title = `Trine | Гра`;
		getRooms();

		window.addEventListener('resize', resizeHandler.bind(null, tableRef));
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
						href={`/assets/cards/${imageName}.svg`}
					/>
				))}
			</Helmet>

			{loading && (
				<div className='flex-center loading-fg'>
					<Loader />
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
					{!loading && refreshBottomMenu && (
						<GameFooter
							isEnable={
								mePlayer.state === 'move' && roomState.state === 'bidding'
							}
							roomState={roomState}
							isReady={ready}
							joinTax={Number(roomState.join_tax)}
							mePlayer={mePlayer}
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
		</>
	);
};

export default Game;
