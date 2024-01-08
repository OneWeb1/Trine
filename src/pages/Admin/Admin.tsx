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

const Admin: FC = () => {
	const dispatch = useDispatch();
	const { visibleModal, visibleBurgerMenu } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [tab, setTab] = useState<string>(
		localStorage.getItem('tab') || 'accounts',
	);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const menuWrapperRef = useRef<HTMLDivElement>(null);

	const display = visibleBurgerMenu ? 'flex' : 'none';

	const hideBurgerMenu = (e: MouseEvent) => {
		if (!menuWrapperRef.current) return;
		if (e.target instanceof Node) {
			if (menuWrapperRef.current === e.target) {
				dispatch(setVisibleBurgerMenu(false));
			}
		}
	};

	const tabAccountsHandler = () => {
		setTab('accounts');
		dispatch(setVisibleBurgerMenu(false));
		localStorage.setItem('tab', 'accounts');
	};

	const tabRoomsHandler = () => {
		setTab('rooms');
		dispatch(setVisibleBurgerMenu(false));
		localStorage.setItem('tab', 'rooms');
	};

	useEffect(() => {
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
						className={styles.mobileMenu}
						tab={tab}
						tabAccountsHandler={tabAccountsHandler}
						tabRoomsHandler={tabRoomsHandler}
					/>
				</div>

				<div className={styles.wrapper}>
					<LeftMenu
						className={styles.decMenu}
						tab={tab}
						tabAccountsHandler={tabAccountsHandler}
						tabRoomsHandler={tabRoomsHandler}
					/>
					<div className={styles.rightMenu}>
						{tab === 'accounts' && <Accounts />}
						{tab === 'rooms' && <Rooms hideName={windowWidth < 900} />}
					</div>
				</div>
			</div>
			{visibleModal === 'cpr' && (
				<ModalCreateRoom title='Створити публічну кімнату' type='public' />
			)}
			{visibleModal === 'cb' && <ModalChangeBalance title='Зміна балансу' />}
		</>
	);
};

export default Admin;
