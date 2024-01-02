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
					<div className={styles.title}>Аккаунти</div>
				</div>
				<div
					className={styles.tableHeader}
					style={{
						background: 'rgba(255, 255, 255, 0.04)',
						marginBottom: '10px',
						borderRadius: '10px',
					}}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div style={{ width: '80px' }}>ID</div>
						<div>Обліковий запис</div>
					</div>
					<div
						style={{
							width: '450px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<div style={{ maxWidth: '150px', width: '150px' }}>Баланс</div>
						<div style={{ maxWidth: '150px', width: '150px' }}>
							Дата створення
						</div>
						<div
							style={{
								maxWidth: '40px',
								width: '40px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
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
