import { FC, useState, useEffect, MouseEvent, useRef } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';

import styles from './../../stylesheet/styles/Admin.module.scss';
import AdminHeader from '../../components/AdminHeader';
import Accounts from './Accounts';
import Rooms from './Rooms';
import ModalCreateRoom from '../../components/modals/ModalCreateRoom';
import ModalChangeBalance from '../../components/modals/ModalChangeBalance';
import LeftMenu from './LeftMenu';
import { setVisibleBurgerMenu } from '../../store/slices/app.slice';
import ModalStatistics from '../../components/modals/ModalStatistics';
import Transfers from './Transfers';

const Admin: FC = () => {
	const dispatch = useDispatch();
	const { visibleModal, visibleBurgerMenu, stats } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [tab, setTab] = useState<string>(
		localStorage.getItem('tab') || 'accounts',
	);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const menuWrapperRef = useRef<HTMLDivElement>(null);

	const display = windowWidth < 1300 && visibleBurgerMenu ? 'flex' : 'none';

	const hideBurgerMenu = (e: MouseEvent) => {
		if (windowWidth > 1300) return;
		if (!menuWrapperRef.current) return;
		if (e.target instanceof Node) {
			if (menuWrapperRef.current === e.target) {
				dispatch(setVisibleBurgerMenu(false));
			}
		}
	};

	const tabAccountsHandler = () => {
		setTab('accounts');
		if (windowWidth < 1300) dispatch(setVisibleBurgerMenu(false));
		localStorage.setItem('tab', 'accounts');
	};

	const tabRoomsHandler = () => {
		setTab('rooms');
		if (windowWidth < 1300) dispatch(setVisibleBurgerMenu(false));
		localStorage.setItem('tab', 'rooms');
	};

	const tabTransfersHandler = () => {
		setTab('transfers');
		if (windowWidth < 1300) dispatch(setVisibleBurgerMenu(false));
		localStorage.setItem('tab', 'transfers');
	};

	useEffect(() => {
		document.title = `Trine | Адмін`;
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<>
			<div className={styles.page}>
				<AdminHeader />
				<div
					className={styles.menuWrapper}
					ref={menuWrapperRef}
					style={{ display }}
					onClick={e => hideBurgerMenu(e)}>
					<LeftMenu
						name='m'
						className={styles.mobileMenu}
						tab={tab}
						tabAccountsHandler={tabAccountsHandler}
						tabRoomsHandler={tabRoomsHandler}
						tabTransfersHandler={tabTransfersHandler}
					/>
				</div>

				<div className={styles.wrapper}>
					<LeftMenu
						name='d'
						className={styles.decMenu}
						tab={tab}
						tabAccountsHandler={tabAccountsHandler}
						tabRoomsHandler={tabRoomsHandler}
						tabTransfersHandler={tabTransfersHandler}
					/>
					<div className={styles.rightMenu}>
						{tab === 'accounts' && <Accounts />}
						{tab === 'rooms' && <Rooms hideName={windowWidth < 900} />}
						{tab === 'transfers' && <Transfers />}
					</div>
				</div>
			</div>
			{visibleModal === 'cpr' && (
				<ModalCreateRoom title='Створити публічну кімнату' type='public' />
			)}
			{visibleModal === 'cb' && <ModalChangeBalance title='Зміна балансу' />}
			{visibleModal === 'ss' && <ModalStatistics stats={stats} />}
		</>
	);
};

export default Admin;
