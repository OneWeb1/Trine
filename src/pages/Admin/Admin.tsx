import { FC, useState, useEffect } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useSelector } from 'react-redux';

import styles from './../../stylesheet/styles/Admin.module.scss';
import AdminHeader from '../../components/AdminHeader';
import Accounts from './Accounts';
import Rooms from './Rooms';
import ModalCreateRoom from '../../components/modals/ModalCreateRoom';
import ModalChangeBalance from '../../components/modals/ModalChangeBalance';
import LeftMenu from './LeftMenu';

const Admin: FC = () => {
	const { visibleModal, visibleBurgerMenu } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [tab, setTab] = useState<string>(
		localStorage.getItem('tab') || 'accounts',
	);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

	const display = visibleBurgerMenu ? 'flex' : 'none';

	const tabAccountsHandler = () => {
		setTab('accounts');
		localStorage.setItem('tab', 'accounts');
	};

	const tabRoomsHandler = () => {
		setTab('rooms');
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
				<div className={styles.menuWrapper} style={{ display }}>
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
