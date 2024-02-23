import { FC, useState, useEffect, useRef } from 'react';

import { RootState as CustomRootState } from '../../../../store/rootReducer';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	setUpdatePublickRooms,
	setJoinRoom,
	// setGameAction,
	setVisibleMenuAccountSettings,
	setMenuAccountSettingsPosition,
	setVisibleModal,
	setStats,
} from '../../../../store/slices/app.slice';

// import { MdDeleteOutline } from 'react-icons/md';
import { MdPersonAddAlt1 } from 'react-icons/md';
// import { IoStatsChart } from 'react-icons/io5';
import { HiOutlineDotsVertical } from 'react-icons/hi';

import Button from '../../../../UI/Button';
import MenuAccountSettings from '../../../../components/menu/MenuAccountSettings';

import GameService from '../../../../services/GameService';
import AdminService from '../../../../services/AdminService';

import { RoomsResponse } from '../../../../models/response/AdminResponse';

import styles from './Room.module.scss';
import { IPlayerRoom } from '../../../Admin/interfaces';

interface IRoom {
	room: RoomsResponse;
	offset?: number;
	isDelete?: boolean;
	hideName?: boolean;
}

const Room: FC<IRoom> = ({ room, offset, isDelete, hideName }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		visibleMenuAccountSettings,
		menuAccountSettingsPosition: menuPosition,
		baseIconPath,
	} = useSelector((state: CustomRootState) => state.app);

	const [windowWidth, setWindowWidth] = useState<number>(window.screen.width);
	const [players, setPlayers] = useState<IPlayerRoom[]>([]);
	const [playersNumber, setPlayersNumber] = useState<number>(0);
	const [left, setLeft] = useState<number>(5);
	const [show, setShow] = useState<boolean>(false);

	const dateRef = useRef<number>(new Date().getTime());
	const settingsRef = useRef<HTMLDivElement | null>(null);

	const joinRoomHandler = () => {
		// let joinCount = 0;

		const join = async () => {
			try {
				const { data } = await GameService.joinRoom(room.id);
				if (localStorage.getItem('joinRoom')) return;
				dispatch(setJoinRoom(data));
				navigate(`/game/${data.id}`);
				localStorage.setItem('joinRoom', JSON.stringify(data));
			} catch (e) {
				console.log('You not playing!!!');
				await AdminService.roomIsReady(true);
				// await AdminService.roomLeave();
				localStorage.removeItem('joinRoom');
				// if (joinCount < 5) join();
			}
			// joinCount++;
		};

		join();
	};

	const visibleMenu = () => {
		if (!settingsRef.current) return;
		dispatch(setVisibleMenuAccountSettings('room-settings'));
		localStorage.setItem('room_settings', JSON.stringify(room));

		const box = settingsRef.current.getBoundingClientRect();
		dispatch(setMenuAccountSettingsPosition({ x: box.x, y: box.y }));
	};

	const hideMenu = () => {
		dispatch(setVisibleMenuAccountSettings('hide'));
	};

	const getState = async () => {
		const room: RoomsResponse = JSON.parse(
			localStorage.getItem('room_settings') || '{id: -1}',
		);
		try {
			const { data } = await AdminService.getRoomStatistics(room.id);
			dispatch(
				setStats({
					title: `Статистика кімнати`,
					values: [
						'Кількість зіграних раундів',
						'Максимальний банк',
						'Сума банку всіх раундів',
						room.id,
					],
					numbers: [data.round_count, data.max_bank, data.total_bank],
				}),
			);
			dispatch(setVisibleModal('ss'));
		} catch (e) {
			console.log(e);
		}
	};

	const removeRoom = async () => {
		const room = JSON.parse(
			localStorage.getItem('room_settings') || '{id: -1}',
		);
		await AdminService.removeRoomById(room.id);
		dispatch(setUpdatePublickRooms());
	};

	const handleResize = () => {
		let left = 5;

		if (windowWidth < 1100) {
			left = 0;
		}
		if (windowWidth < 1000) {
			const padd =
				(windowWidth < 850 && 100) || (windowWidth < 700 && 200) || 0;
			const emptyWidth = 1000 - windowWidth - padd;
			let num =
				(windowWidth < 700 && 10 - Math.ceil((700 - windowWidth) / 35)) || 11;

			num = windowWidth < 700 && num === 11 ? 1 : num;

			num = (num <= 1 && 1) || num;
			left = -(emptyWidth / num < 17.5 ? emptyWidth / num : 17.5);
			setPlayersNumber(() => (Math.ceil(num) <= 0 ? 0 : Math.ceil(num)));
		} else {
			setPlayersNumber(() => 11);
		}

		setShow(playersNumber - 11 < 0);
		setLeft(() => left);
		setWindowWidth(() => window.innerWidth - (offset || 0));
	};

	const initPlayers = () => {
		const players = [] as IPlayerRoom[];
		for (let i = 0; i < room.players.length; i++) {
			if (playersNumber < i) continue;
			const player: IPlayerRoom = room.players[i];
			players.push({ ...player });
		}

		setPlayers(players);
	};

	const updateViewJoinPlayers = () => {
		const diffTime = -Math.round(
			(dateRef.current - new Date().getTime()) / 1000,
		);

		if (diffTime >= 1) {
			initPlayers();
			handleResize();

			dateRef.current = new Date().getTime();
		}
	};

	useEffect(() => {
		initPlayers();
		handleResize();

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [windowWidth]);

	updateViewJoinPlayers();
	// useEffect(() => {
	// 	console.log(1);
	// 	removeRoom();
	// }, []);

	return (
		<>
			<div
				className={styles.room}
				style={{
					padding: (windowWidth < 700 && ' 0px 10px 0px 10px') || ' 0px 10px',
				}}>
				<div className={styles.leftWrapper}>
					{hideName && windowWidth > 700 && (
						<div
							style={{ maxWidth: (windowWidth < 850 && '100px') || '200px' }}
							className={styles.name}>
							{room.name}
						</div>
					)}
					<div className={styles.playersWrapper}>
						<div className={styles.playersNumber}>
							{room.players.length}/{room.max_players}
						</div>
						<div className={styles.players}>
							{players.map((player, idx) => (
								<div
									key={idx}
									style={{
										zIndex: idx,
										marginLeft: (idx !== 0 && left) || '0px',
										marginRight:
											(!(show && room.players.length - 1 - playersNumber > 0) &&
												idx === players.length - 1 &&
												'10px') ||
											'0px',
									}}
									className={styles.playerProfile}>
									<img
										src={`${baseIconPath}/avatar/${player.avatar_id}`}
										alt='player'
									/>
								</div>
							))}
							{show && room.players.length - 1 - playersNumber > 0 && (
								<div
									style={{
										zIndex: 15,
										marginLeft: left,
										marginRight: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
									className={styles.playerProfile}>
									{players[players.length - 1]?.avatar_id && (
										<img
											style={{ opacity: 0.1 }}
											src={`${baseIconPath}/avatar/${
												players[players.length - 1].avatar_id
											}`}
											alt='player'
										/>
									)}
									<span
										style={{
											position: 'absolute',
										}}>
										+
										{room.players.length > playersNumber &&
											room.players.length - playersNumber - 1}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className={styles.rightWrapper}>
					<div className={styles.betWrapper}>
						<div className={styles.bet}>min: {room.join_tax}₴</div>
						<div className={styles.bet}>max: {room.max_bid}₴</div>
					</div>
					{hideName && (
						<Button
							style={{
								padding: '9px 32px',
								fontWeight: 500,
								fontSize: '12px',
								background: '',
							}}
							background='linear-gradient(180deg, #2C3756 0%, #1F2841 100%)'
							resize={true}
							value='Увійти'
							loading={true}
							onClick={joinRoomHandler}
						/>
					)}
					{!hideName && (
						<div
							style={{ marginRight: '0px' }}
							className={styles.buttonJoinFlex}
							onClick={joinRoomHandler}>
							<MdPersonAddAlt1 />
						</div>
					)}

					{isDelete && (
						<div
							ref={settingsRef}
							className={styles.settings}
							onClick={visibleMenu}>
							<HiOutlineDotsVertical />
						</div>
					)}
				</div>
			</div>
			{visibleMenuAccountSettings === 'room-settings' && (
				<MenuAccountSettings
					x={menuPosition.x}
					y={menuPosition.y}
					values={['Статистика', 'Видалити']}
					handlers={[getState, removeRoom]}
					hideMenu={hideMenu}
				/>
			)}
		</>
	);
};
export default Room;
