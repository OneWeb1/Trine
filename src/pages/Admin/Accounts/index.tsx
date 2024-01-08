import { FC, useState, useEffect } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setVisibleModal,
	setVisibleMenuAccountSettings,
	setUpdateAccounts,
} from '../../../store/slices/app.slice';

import { MdOutlineSettingsEthernet } from 'react-icons/md';

import MenuAccountSettings from '../../../components/menu/MenuAccountSettings';

import AdminService from '../../../services/AdminService';

import styles from './../styles/Accounts.module.scss';
import { AdminProfileResponce } from '../../../models/responce/AdminResponce';
import Account from './components/Account';

const Accounts: FC = () => {
	const dispatch = useDispatch();
	const {
		visibleMenuAccountSettings,
		menuAccountSettingsPosition: menuPosition,
		updateAccounts,
	} = useSelector((state: CustomRootState) => state.app);
	const [profiles, setProfiles] = useState<AdminProfileResponce[]>([]);
	const [offset] = useState<number>(0);
	const [limit] = useState<number>(10);
	const getProfiles = async () => {
		const { data } = await AdminService.getProfiles(offset, limit);
		setProfiles(data);
	};

	const changeBalance = () => {
		dispatch(setVisibleModal('cb'));
	};

	const removeAccount = () => {
		const storageAccount = localStorage.getItem('account_settings');
		if (!storageAccount) return;
		const account = JSON.parse(storageAccount);
		AdminService.removeProfileById(account.id);
		dispatch(setUpdateAccounts());
	};

	const hideMenu = () => {
		dispatch(setVisibleMenuAccountSettings(false));
	};

	useEffect(() => {
		setTimeout(() => {
			getProfiles();
		}, 500);
	}, [updateAccounts]);

	return (
		<>
			<div className={styles.tableWrapper}>
				<div className={styles.header}>
					<div
						className={styles.title}
						style={{ fontSize: window.innerWidth < 600 ? '12px' : '18px' }}>
						Аккаунти
					</div>
				</div>
				<div
					className={styles.tableHeader}
					style={{
						background: 'rgba(255, 255, 255, 0.04)',
						marginBottom: '10px',
						borderRadius: '10px',
					}}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div className={styles.idColumn}>ID</div>
						<div>Обліковий запис</div>
					</div>
					<div className={styles.rightWrapper}>
						<div className={styles.balanceColumn}>Баланс</div>
						<div
							className={styles.dateCreated}
							style={{ maxWidth: '150px', width: '150px' }}>
							Дата створення
						</div>
						<div className={styles.iconWrapper}>
							<MdOutlineSettingsEthernet />
						</div>
					</div>
				</div>
				<div className={styles.tableItems}>
					{profiles.map((profile, idx) => (
						<Account key={idx} profile={profile} />
					))}
				</div>
			</div>
			{visibleMenuAccountSettings && (
				<MenuAccountSettings
					x={menuPosition.x}
					y={menuPosition.y}
					changeBalance={changeBalance}
					removeAccount={removeAccount}
					hideMenu={hideMenu}
				/>
			)}
		</>
	);
};

export default Accounts;
