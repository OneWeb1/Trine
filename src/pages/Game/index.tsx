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

import ModalAfterGame from '../../components/modals/ModalAfterGame';
import Spinner from '../../components/spinner';

import AdminService from '../../services/AdminService';

import { PublicRoomResponce } from '../../models/responce/AdminResponce';
import { IPlayerRoom } from '../Admin/interfaces';

import { assets, resizeHandler } from './utils';
import styles from './../../stylesheet/styles/Game.module.scss';

const Game: FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { gameAction } = useSelector((state: CustomRootState) => state.app);
	const [roomState, setRoomState] = useState<PublicRoomResponce>(
		{} as PublicRoomResponce,
	);

	const [mePlayer, setMePlayer] = useState<IPlayerRoom>({} as IPlayerRoom);
	const [ready, setReady] = useState<boolean>(
		JSON.parse(localStorage.getItem('ready') || 'false'),
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [update, setUpdate] = useState<number>(1);
	const [opacity, setOpacity] = useState<number>(0);

	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

	const tableRef = useRef<HTMLDivElement>(null);

	const readyHandler = async () => {
		try {
			await AdminService.roomIsReady(true);
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

	useEffect(() => {
		window.addEventListener('resize', () => {
			resizeHandler(tableRef);
		});
		resizeHandler(tableRef);
	}, []);

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
					onDoubleClick={handleFullScreen}
					style={{ transition: '3s', opacity: opacity }}>
					<GameHeader />
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
					sum={mePlayer.full_bid}
					onClick={() => {
						dispatch(setGameAction({ state: '' }));
					}}
				/>
			)}
			{gameAction.state === 'won' && roomState.bank && (
				<ModalAfterGame
					title='Ви виграли'
					message='Сума виграшу:'
					isWin={true}
					sum={roomState.bank * 0.95}
					onClick={() => {
						setRoomResultState({} as PublicRoomResponce);
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
						dispatch(setGameAction({ state: '' }));
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
