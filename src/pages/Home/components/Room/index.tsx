import { FC, useState, useEffect, useRef } from 'react';

import { RootState as CustomRootState } from '../../../../store/rootReducer';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	setUpdatePublickRooms,
	setJoinRoom,
} from '../../../../store/slices/app.slice';

import { MdDeleteOutline } from 'react-icons/md';
import { MdPersonAddAlt1 } from 'react-icons/md';

import Button from '../../../../UI/Button';

import GameService from '../../../../services/GameService';
import AdminService from '../../../../services/AdminService';

import { PublicRoomResponce } from '../../../../models/responce/AdminResponce';

import styles from './Room.module.scss';
import { IPlayerRoom } from '../../../Admin/interfaces';

interface IRoom {
	room: PublicRoomResponce;
	offset?: number;
	isDelete?: boolean;
	hideName?: boolean;
}

const Room: FC<IRoom> = ({ room, offset, isDelete, hideName }) => {
	const dispatch = useDispatch();
	const { baseIconPath } = useSelector((state: CustomRootState) => state.app);
	const [windowWidth, setWindowWidth] = useState<number>(window.screen.width);
	const [players, setPlayers] = useState<IPlayerRoom[]>([]);
	const [playersNumber, setPlayersNumber] = useState<number>(0);
	const [left, setLeft] = useState<number>(5);
	const [show, setShow] = useState<boolean>(false);
	const [update, setUpdate] = useState<number>(1);

	const intervalRef = useRef<number | null>(null);

	const joinRoomHandler = async () => {
		if (localStorage.getItem('joinRoom')) return;
		const responce = await GameService.joinRoom(room.id);
		if (!responce?.data) return;
		const { data } = responce;
		if (!data) return;
		if (localStorage.getItem('joinRoom')) return;
		dispatch(setJoinRoom(data));
		localStorage.setItem('joinRoom', JSON.stringify(data));
	};

	const removeRoom = async () => {
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
		console.log({ players });
		console.log(room.players, playersNumber);

		setPlayers(players);
	};

	useEffect(() => {
		initPlayers();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [windowWidth, update]);

	useEffect(() => {
		if (!intervalRef.current) {
			intervalRef.current = setInterval(() => {
				setUpdate(prev => prev + 1);
			}, 2000);
		}

		return () => {
			if (!intervalRef.current) return;
			clearInterval(intervalRef.current);
		};
	}, []);

	return (
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
					<div className={styles.players}>
						{players.map((player, idx) => (
							<div
								key={idx}
								style={{
									zIndex: idx,
									marginLeft: (idx !== 0 && left) || '0px',
									marginRight: (idx === players.length - 1 && '10px') || '0px',
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
										room.players.length - playersNumber}
								</span>
							</div>
						)}
					</div>
					<div className={styles.playersNumber}>
						{room.players.length}/{room.max_players}
					</div>
				</div>
			</div>
			<div className={styles.rightWrapper}>
				<div className={styles.startBet}>{room.join_tax}₴</div>
				<Link to={`/game`}>
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
							onClick={joinRoomHandler}
						/>
					)}
					{!hideName && (
						<div
							style={{ marginRight: '5px' }}
							className={styles.buttonJoinFlex}
							onClick={joinRoomHandler}>
							<MdPersonAddAlt1 />
						</div>
					)}
				</Link>
				{isDelete && (
					<div className={styles.delete} onClick={removeRoom}>
						<MdDeleteOutline />
					</div>
				)}
			</div>
		</div>
	);
};

export default Room;
