// import { FC, useState, useRef, useEffect } from 'react';

// import { useParams } from 'react-router-dom';

// import { RootState as CustomRootState } from '../../store/rootReducer';
// import { useDispatch, useSelector } from 'react-redux';

// import GameHeader from '../../components/GameHeader';
// import GameFooter from '../../components/GameFooter';

// import styles from './../../stylesheet/styles/Game.module.scss';
// import Player from '../../components/Player';
// import FishkaItem from '../../components/FishkaItem';
// import AdminService from '../../services/AdminService';

// import { PublicRoomResponce } from '../../models/responce/AdminResponce';
// import { IPlayerRoom } from '../Admin/interfaces';

// import { resizeHandler, getIdx } from './utils';

// const Game: FC = () => {
// 	const dispatch = useDispatch();
// 	const { joinRoom } = useSelector((state: CustomRootState) => state.app);
// 	const [roomState, setRoomState] = useState<PublicRoomResponce>(
// 		{} as PublicRoomResponce,
// 	);
// 	const [players, setPlayers] = useState<IPlayerRoom[]>([]);
// 	const [ready, setReady] = useState<boolean>(false);
// 	const [enable, setEnamble] = useState<boolean>(false);

// 	const [pos, setPos] = useState<number[]>([]);
// 	const tableRef = useRef<HTMLDivElement>(null);
// 	const timeoutRef = useRef<number>();

// 	const reverseIds = [0, 1, 2, 11, 10];

// 	const getRoomState = async () => {
// 		// const { data } = await AdminService.getPublicRoomByState(joinRoom.id);
// 		const players = [] as IPlayerRoom[];
// 		let isAdd = false;
// 		joinRoom.players.forEach(player => {
// 			if (player.me) isAdd = true;
// 			if (isAdd) players.push({ ...player });
// 		});
// 		joinRoom.players.forEach(player => {
// 			if (player.me) isAdd = false;
// 			if (isAdd) players.push({ ...player });
// 		});
// 		console.log(players);
// 		setPlayers(players);
// 		setPos(getIdx(players.length));
// 	};

// 	const readyHandler = async () => {
// 		const responce = await AdminService.roomIsReady(true);
// 		setReady(true);
// 	};

// 	useEffect(() => {
// 		console.log(joinRoom);
// 		getRoomState();
// 		window.addEventListener('resize', () => {
// 			const screenWidth = window.innerWidth;

// 			clearTimeout(timeoutRef.current);
// 			resizeHandler(tableRef, screenWidth);
// 		});
// 	}, [joinRoom]);

// 	return (
// 		<div className={styles.page}>
// 			<GameHeader />
// 			<div className={styles.tableWrapper}>
// 				<div className={styles.table} ref={tableRef}>
// 					{players.map((player, idx) => (
// 						<Player
// 							player={player}
// 							reverse={reverseIds.includes(pos[idx])}
// 							bet={player.last_bid}
// 							index={pos[idx]}
// 						/>
// 					))}

// 					<div className={styles.tableBorder}>
// 						<div className={styles.tableField}>
// 							<div className={styles.screenCenter}>
// 								<div className={styles.displayWrapper}>
// 									<div className={styles.tax}>
// 										Налог (5%){' '}
// 										<span
// 											className={styles.taxNumber}
// 											style={{ marginLeft: '3px', fontWeight: '600' }}>
// 											{roomState.max_bid}
// 										</span>
// 									</div>
// 									<FishkaItem value={roomState.bank} />
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			<GameFooter
// 				isEnable={enable}
// 				isReady={ready}
// 				readyHandler={readyHandler}
// 			/>
// 		</div>
// 	);
// };

// export default Game;
