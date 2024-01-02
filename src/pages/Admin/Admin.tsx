import { FC, useState, useEffect } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useSelector } from 'react-redux';

import classNames from 'classnames';

import { MdManageAccounts } from 'react-icons/md';
import { MdRoomPreferences } from 'react-icons/md';

import styles from './../../stylesheet/styles/Admin.module.scss';
import AdminHeader from '../../components/AdminHeader';
import Accounts from './Accounts';
import Rooms from './Rooms';
import ModalCreateRoom from '../../components/modals/ModalCreateRoom';
import ModalChangeBalance from '../../components/modals/ModalChangeBalance';

const Admin: FC = () => {
	const { visibleModal } = useSelector((state: CustomRootState) => state.app);
	const [tab, setTab] = useState<string>(
		localStorage.getItem('tab') || 'accounts',
	);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

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
				<div className={styles.wrapper}>
					<div className={styles.leftMenu}>
						<div className={styles.menu}>
							<div
								className={classNames(
									styles.item,
									tab === 'accounts' && styles.tabActive,
								)}
								onClick={tabAccountsHandler}>
								<MdManageAccounts style={{ marginRight: '10px' }} />
								<span>Аккаунти</span>
							</div>
							<div
								className={classNames(
									styles.item,
									tab === 'rooms' && styles.tabActive,
								)}
								onClick={tabRoomsHandler}>
								<MdRoomPreferences style={{ marginRight: '10px' }} />
								<span>Кімнати</span>
							</div>
						</div>
					</div>
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
