import { FC, useState, useEffect, useRef } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setVisibleModal,
	setVisibleMenuAccountSettings,
	setUpdateAccounts,
} from '../../../store/slices/app.slice';

import { MdOutlineSettingsEthernet } from 'react-icons/md';

import MenuAccountSettings from '../../../components/menu/MenuAccountSettings';
import Pagination from '../../../components/Pagination';

import AdminService from '../../../services/AdminService';

import styles from './../styles/Accounts.module.scss';
import { AdminProfileResponse } from '../../../models/response/AdminResponse';
import Account from './components/Account';
import Spinner from '../../../components/spinner';

const Accounts: FC = () => {
	const dispatch = useDispatch();
	const {
		visibleMenuAccountSettings,
		menuAccountSettingsPosition: menuPosition,
		updateAccounts,
	} = useSelector((state: CustomRootState) => state.app);
	const [profiles, setProfiles] = useState<AdminProfileResponse[]>([]);

	const [pagesNumber, setPagesNumber] = useState<number>(
		JSON.parse(localStorage.getItem('accounts-length') || '0'),
	);
	const [limit] = useState<number>(8);
	const [loading, setLoading] = useState<boolean>(false);

	const offsetRef = useRef<number>(
		JSON.parse(localStorage.getItem('accounts-offset') || '0'),
	);

	const getProfiles = async () => {
		if (typeof offsetRef.current !== 'number') return;
		try {
			const { data } = await AdminService.getProfiles(offsetRef.current, limit);
			setProfiles(data.items);
			setPagesNumber(data.pages);
			setLoading(true);
		} catch (e) {
			console.log(e);
		}
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

	const changePage = (pageNumber: number) => {
		const lastOffset = JSON.parse(
			localStorage.getItem('accounts-offset') || '0',
		);

		const offset = (pageNumber - 1) * limit;
		if (offset === lastOffset) return;
		offsetRef.current = offset;
		setProfiles([]);
		setLoading(false);
		getProfiles();
		localStorage.setItem('accounts-offset', JSON.stringify(offset));
		localStorage.setItem('accounts-page', JSON.stringify(pageNumber));
	};

	const hideMenu = () => {
		dispatch(setVisibleMenuAccountSettings(false));
	};

	useEffect(() => {
		getProfiles();
	}, [updateAccounts]);

	// useEffect(() => {
	// 	getAllProfiles();
	// }, []);

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
				<div>
					<div className={styles.tableItems}>
						{!loading && (
							<div className={styles.flexCenter}>
								<Spinner />
							</div>
						)}
						{loading &&
							profiles.map((profile, idx) => (
								<Account key={idx} profile={profile} />
							))}
					</div>

					<div style={{ padding: '0px 10px', paddingTop: '10px' }}>
						<Pagination
							numbers={pagesNumber > 10 ? pagesNumber : 10}
							workPages={!pagesNumber ? 1 : pagesNumber}
							current={JSON.parse(localStorage.getItem('accounts-page') || '0')}
							changePage={changePage}
						/>
					</div>
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
