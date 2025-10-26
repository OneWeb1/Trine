import { FC, useRef, useState, useEffect } from 'react';

import Spinner from '../../components/spinner';
import { FaTelegram } from 'react-icons/fa';

// import { useNavigate } from 'react-router-dom';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setVisibleModal,
	// setJoinRoom,
	setAccount,
} from '../../store/slices/app.slice';

import ModalCreateRoom from '../../components/modals/ModalCreateRoom';
import ModalJoinToCode from '../../components/modals/ModalJoinToCode';

import ModalSettings from '../../components/modals/ModalSettings';

import ModalMyRooms from '../../components/modals/ModalMyRooms';
import ModalReplenishment from '../../components/modals/ModalReplenishment';
import ModalPay from '../../components/modals/ModalPay';
import ModalPayGroup from '../../components/modals/ModalPayGroup';

import Header from '../../components/Header';
// import LeftMenu from './components/LeftMenu';
// import Button from '../../UI/Button';

import Room from './components/Room';
import Pagination from '../../components/Pagination';

import AdminService from '../../services/AdminService';

import styles from './../../stylesheet/styles/Home.module.scss';

import {
	// RoomsPageDataResponse,
	RoomsResponse,
} from '../../models/response/AdminResponse';
import ModalWheelOfFortune from '../../components/modals/ModalWheelOfFortune';
import GameService from '../../services/GameService';
import ModalLiveStats from '../../components/modals/ModalLiveStats';
import ModalToBuyPremium from '../../components/modals/ModalToBuyPremium';
// import VaweButton from '../../UI/VaweButton';
// import ToastNotification from '../../components/toast';
// import GameService from '../../services/GameService';
const Home: FC = () => {
	const dispatch = useDispatch();
	const { visibleModal } = useSelector((state: CustomRootState) => state.app);
	const [rooms, setRooms] = useState<RoomsResponse[]>([]);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const [update, setUpdate] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(true);
	const isRequestRef = useRef<boolean>(true);
	const [updateRooms, setUpdateRooms] = useState<number>(1);
	const [pagesNumber, setPagesNumber] = useState<number>(
		JSON.parse(localStorage.getItem('home-room-page') || '1'),
	);
	const [limit] = useState<number>(8);
	const offsetRef = useRef<number>((pagesNumber - 1) * limit);
	const loadingRooms = useRef<boolean>(false);
	const intervalRef = useRef<number | null>(null);
	// const joinToCodeHandler = async () => {
	// 	dispatch(setVisibleModal('jc'));
	// };

	const getPublickRooms = async (isRequest: boolean, isUpdate?: boolean) => {
		if (!isRequest) return;
		const { data } = await AdminService.getRooms({
			offset: offsetRef.current,
			limit,
		});

		setRooms(data.items);
		setPagesNumber(data.pages);
		setUpdateRooms(prev => prev + 1);
		if (isUpdate) {
			isRequestRef.current = true;
		}
		if (!loadingRooms.current) {
			loadingRooms.current = true;
		}
		localStorage.setItem('home-rooms-length', JSON.stringify(data.pages));
	};

	const addStandartAvatar = async () => {
		const { data } = await AdminService.getAvatars();
		const id = Math.floor(Math.random() * (data.length - 0));
		await AdminService.changeAvatar(String(id));
	};

	const initData = async () => {
		if (visibleModal === 'wof') return;
		const { data } = await AdminService.getMeProfile();
		if (!data.avatar_id) addStandartAvatar();
		dispatch(setAccount(data));
		setLoading(true);
		await getPublickRooms(isRequestRef.current);
	};

	const changePage = (page: number) => {
		const currentPage = JSON.parse(
			localStorage.getItem('home-room-page') || '1',
		);
		const offset = (page - 1) * limit;
		if (currentPage === page) return;
		loadingRooms.current = false;
		isRequestRef.current = false;
		setUpdateRooms(prev => prev + 1);
		offsetRef.current = offset;
		getPublickRooms(true, true);
		localStorage.setItem('home-room-page', JSON.stringify(page));
	};

	const leave = async () => {
		await AdminService.roomLeave();
	};

	const openModalWheelFortune = () => {
		dispatch(setVisibleModal('wof'));
	};

	useEffect(() => {
		const getLiveWins = async () => {
			const { data } = await GameService.liveWins();

			console.log(data);
		};

		getLiveWins();
	}, []);

	useEffect(() => {
		document.title = 'Trine | Головна';
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		if (!intervalRef.current) {
			intervalRef.current = setInterval(() => {
				setUpdate(prev => prev + 1);
			}, 2000);
		}

		window.addEventListener('resize', handleResize);
		const joinRoom = JSON.parse(localStorage.getItem('joinRoom') || '{}');
		if (Object.keys(joinRoom).length) {
			leave();
			localStorage.removeItem('joinRoom');
			localStorage.removeItem('ready');
		}

		initData();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [update]);

	return (
		<>
			<div
				className={styles.page}
				style={{ padding: (windowWidth < 500 && '5px') || '20px' }}>
				<Header />
				<div className={styles.contentWrapper}>
					{/* <LeftMenu /> */}
					<div className={styles.rightMenu}>
						<div className={styles.flex}>
							<div className={styles.title}>
								Публічні кімнати
								{/* <VaweButton /> */}
							</div>
							{/* // <Button
								// 	style={{
								// 		padding: '9px 32px',
								// 		fontWeight: 500,
								// 		fontSize: '12px',
								// 		marginTop: '-6px',
								// 		minHeight: '35px',
								// 	}}
								// 	resize={true}
								// 	noLoading={true}
								// 	value='Приєднатися за кодом'
								// 	onClick={joinToCodeHandler}
								// /> */}
							<div
								className={styles.wheelButton}
								onClick={openModalWheelFortune}>
								<div className={styles.image}>
									<img src='/assets/wheel.png' alt='wheel' />
								</div>

								<div className={styles.content}>крутити</div>
							</div>
						</div>
						<div>
							{updateRooms && (
								<div className={styles.room}>
									{(!loadingRooms.current ||
										(loadingRooms.current && !rooms.length)) && (
										<div className={styles.empty}>
											{!loadingRooms.current && (
												<div
													style={{
														width: '100%',
														height: '470px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}>
													<Spinner />
												</div>
											)}
											{loadingRooms.current && !rooms.length && (
												<div
													style={{
														width: '100%',
														height: '470px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}>
													Список кімнат порожній. <br /> Для створення публічних
													кімнат звяжіться з нашими менеджерами{' '}
												</div>
											)}
										</div>
									)}

									{loadingRooms.current &&
										rooms.map((room, idx) => (
											<Room
												key={idx}
												room={room}
												hideName={windowWidth > 450}
											/>
										))}
								</div>
							)}

							<div style={{ padding: '0px 10px', paddingTop: '10px' }}>
								<Pagination
									numbers={pagesNumber > 10 ? pagesNumber : 10}
									workPages={!pagesNumber ? 1 : pagesNumber}
									current={JSON.parse(
										localStorage.getItem('home-room-page') || '0',
									)}
									changePage={changePage}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{visibleModal === 'vp' && (
				<ModalPay
					title='Виведення коштів'
					message="Для виведення коштів звяжіться з нашим менеджером, вкажіть Ім'я та ID свого аккаунта та суму яку ви хочете вивести."
				/>
			)}
			{visibleModal === 'dp' && (
				<ModalPay
					title='Поповнення через адміна'
					message="Для поповнення рахунку звяжіться адміністратором, вкажіть Ім'я та ID свого аккаунта та суму яку ви хочете поповнити."
				/>
			)}
			{visibleModal === 'mra' && (
				<ModalPay
					title='Поповнення через адміна'
					message="Для поповнення рахунку звяжіться адміністратором, вкажіть Ім'я та ID свого аккаунта та суму яку ви хочете поповнити."
				/>
			)}
			{visibleModal === 'mrt' && (
				<ModalReplenishment
					title='Поповнення через телеграм'
					message='Моментальне поповнення через телеграм'
					warn='⚠️ Зверніть увагу: присутня комісія телеграму.'
				/>
			)}
			{visibleModal === 's' && <ModalSettings />}
			{visibleModal === 'jc' && (
				<ModalJoinToCode
					title='Приєднатися за кодом'
					buttonText='Приєднатися'
				/>
			)}
			{visibleModal === 'cpr' && (
				<ModalCreateRoom title='Створити приватну кімнату' type='private' />
			)}
			{visibleModal === 'mr' && <ModalMyRooms />}
			{visibleModal === 'wof' && <ModalWheelOfFortune />}
			{visibleModal === 'lw' && <ModalLiveStats title='Лайв виграші' />}
			{visibleModal === 'pm' && <ModalToBuyPremium />}

			{!loading && (
				<div style={{ width: '100%', height: '500px' }} className='flex-center'>
					<Spinner />
				</div>
			)}
			<div className={styles.viewLink}>
				<div className={styles.link}>
					<a target='_blank' href='https://t.me/+AbYtgcKeF7wyOGRi'>
						<div className={styles.telegramIcon}>
							<FaTelegram />
						</div>{' '}
						Ми в телеграм
					</a>
				</div>
			</div>
		</>
	);
};

export default Home;
