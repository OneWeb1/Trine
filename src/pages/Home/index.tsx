import { FC, useRef, useState, useEffect } from 'react';

import Spinner from '../../components/spinner';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleModal, setAccount } from '../../store/slices/app.slice';

import ModalCreateRoom from '../../components/modals/ModalCreateRoom';
import ModalJoinToCode from '../../components/modals/ModalJoinToCode';

import ModalSettings from '../../components/modals/ModalSettings';

import ModalMyRooms from '../../components/modals/ModalMyRooms';
import ModalPay from '../../components/modals/ModalPay';

import Header from '../../components/Header';
// import LeftMenu from './components/LeftMenu';
import Button from '../../UI/Button';

import Room from './components/Room';
import Pagination from '../../components/Pagination';

import AdminService from '../../services/AdminService';

import styles from './../../stylesheet/styles/Home.module.scss';

import { PublicRoomResponse } from '../../models/response/AdminResponse';
const Home: FC = () => {
	const dispatch = useDispatch();
	const { visibleModal } = useSelector((state: CustomRootState) => state.app);
	const [publicRooms, setPublicRooms] = useState<PublicRoomResponse[]>([]);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const [update, setUpdate] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(true);
	const [pagesNumber, setPagesNumber] = useState<number>(
		JSON.parse(localStorage.getItem('home-rooms-length') || '0'),
	);
	const [limit] = useState<number>(8);
	const [offset, setOffset] = useState<number>(0);
	const sliceRooms = publicRooms.slice(offset, offset + limit);
	console.log({ pagesNumber });
	const intervalRef = useRef<number | null>(null);

	const joinToCodeHandler = () => {
		dispatch(setVisibleModal('jc'));
	};

	const getPublickRooms = async () => {
		const { data } = await AdminService.getPublicRooms();
		setPublicRooms(data);
		setPagesNumber(Math.ceil(data.length / limit));
		localStorage.setItem(
			'home-rooms-length',
			JSON.stringify(Math.ceil(data.length / limit)),
		);
	};

	const addStandartAvatar = async () => {
		const { data } = await AdminService.getAvatars();
		const id = Math.floor(Math.random() * (data.length - 0));
		await AdminService.changeAvatar(id);
	};

	const initData = async () => {
		const { data } = await AdminService.getMeProfile();
		if (!data.avatar_id) addStandartAvatar();
		dispatch(setAccount(data));
		await getPublickRooms();

		setLoading(false);
	};

	const changePage = (currentPage: number) => {
		const offset = (currentPage - 1) * limit;
		setOffset(offset);
		setLoading(false);
		localStorage.setItem('admin-room-page', JSON.stringify(currentPage));
	};

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		if (!intervalRef.current) {
			intervalRef.current = setInterval(() => {
				setUpdate(prev => prev + 1);
			}, 3000);
		}

		window.addEventListener('resize', handleResize);

		localStorage.removeItem('joinRoom');
		localStorage.removeItem('ready');

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
						<div>
							<div className={styles.publicRooms}>
								{loading && !publicRooms.length && (
									<div className={styles.empty}>
										Список кімнат порожній. <br /> Для створення публічних
										кімнат звяжіться з нашими менеджерами
									</div>
								)}
								{sliceRooms.map((room, idx) => (
									<Room key={idx} room={room} hideName={windowWidth > 450} />
								))}
							</div>
							<div style={{ padding: '0px 10px', paddingTop: '10px' }}>
								<Pagination
									numbers={pagesNumber > 10 ? pagesNumber : 10}
									workPages={!pagesNumber ? 1 : pagesNumber}
									current={JSON.parse(
										localStorage.getItem('admin-room-page') || '0',
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
