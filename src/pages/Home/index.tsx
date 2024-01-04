import { FC, useRef, useState, useEffect } from 'react';

import Spinner from '../../components/spinner';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setVisibleModal,
	setAccount,
	setIsAuth,
	setGameAction,
} from '../../store/slices/app.slice';

import ModalCreateRoom from '../../components/modals/ModalCreateRoom';
import ModalJoinToCode from '../../components/modals/ModalJoinToCode';

import ModalSettings from '../../components/modals/ModalSettings';

import ModalMyRooms from '../../components/modals/ModalMyRooms';
import ModalPay from '../../components/modals/ModalPay';

import Header from '../../components/Header';
// import LeftMenu from './components/LeftMenu';
import Button from '../../UI/Button';

import Room from './components/Room';

import AdminService from '../../services/AdminService';

import { AxiosError } from 'axios';

import styles from './../../stylesheet/styles/Home.module.scss';

import {
	ProfileMeResponce,
	PublicRoomResponce,
} from '../../models/responce/AdminResponce';

const Home: FC = () => {
	const dispatch = useDispatch();
	const { visibleModal } = useSelector((state: CustomRootState) => state.app);
	const [publicRooms, setPublicRooms] = useState<PublicRoomResponce[]>([]);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const [update, setUpdate] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(true);

	const intervalRef = useRef<number | null>(null);

	const joinToCodeHandler = () => {
		dispatch(setVisibleModal('jc'));
	};

	const getPublickRooms = async () => {
		const { data } = await AdminService.getPublicRooms();
		setPublicRooms(data);
	};

	const addStandartAvatar = async () => {
		const { data } = await AdminService.getAvatars();
		const id = Math.floor(Math.random() * (data.length - 0));
		await AdminService.changeAvatar(id);
	};

	const isAxiosError = (error: any): error is AxiosError => {
		return error.isAxiosError === true;
	};

	const initData = async () => {
		let data = {} as ProfileMeResponce;
		try {
			const responce = await AdminService.getMeProfile();
			data = responce.data;
		} catch (e: any) {
			if (isAxiosError(e) && e.response && e.response.status === 401) {
				localStorage.removeItem('token');
				localStorage.removeItem('prolong_token');
				dispatch(setIsAuth(false));
			}
		}

		if (!data.avatar_id) addStandartAvatar();
		dispatch(setAccount(data));
		await getPublickRooms();

		setLoading(false);
	};

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		if (!intervalRef.current) {
			intervalRef.current = setInterval(() => {
				setUpdate(prev => prev + 1);
			}, 1000);
		}

		window.addEventListener('resize', handleResize);

		localStorage.removeItem('joinRoom');
		localStorage.removeItem('ready');

		initData();

		return () => {
			// if (intervalRef.current) clearInterval(intervalRef.current);
			window.removeEventListener('resize', handleResize);
		};
	}, [update]);

	useEffect(() => {
		const leave = async () => {
			await AdminService.roomLeave();
		};

		leave();
		dispatch(setGameAction({ state: '', prevState: '' }));
	}, []);

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
							<div className={styles.title}>Публічні кімнати</div>
							{windowWidth >= 500 && (
								<Button
									style={{
										padding: '9px 32px',
										fontWeight: 500,
										fontSize: '12px',
										marginTop: '-6px',
										minHeight: '35px',
									}}
									resize={true}
									value='Приєднатися за кодом'
									onClick={joinToCodeHandler}
								/>
							)}
						</div>
						<div className={styles.publicRooms}>
							{!publicRooms.length && (
								<div className={styles.empty}>
									Список кімнат порожній. <br /> Для створення публічних кімнат
									звяжіться з нашими менеджерами
								</div>
							)}
							{publicRooms.map((room, idx) => (
								<Room key={idx} room={room} hideName={windowWidth > 450} />
							))}
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
					title='Поповнення рахунку'
					message="Для поповнення рахунку звяжіться з нашим менеджером та вкажіть Ім'я та ID свого аккаунта."
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

			{loading && (
				<div className='flex-center'>
					<Spinner />
				</div>
			)}
		</>
	);
};

export default Home;
