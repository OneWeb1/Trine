import { FC, useState, useEffect, useRef } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setVisibleModal,
	setVisibleMenuAccountSettings,
	setUpdateAccounts,
	setStats,
} from '../../../store/slices/app.slice';

// import { MdOutlineSettingsEthernet } from 'react-icons/md';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';

import MenuAccountSettings from '../../../components/menu/MenuAccountSettings';
import Pagination from '../../../components/Pagination';

import AdminService from '../../../services/AdminService';

import styles from './../styles/WheelFortune.module.scss';
import {
	AdminProfileResponse,
	IPlayerRoom,
	ProfileMeResponse,
} from '../../../models/response/AdminResponse';
// import HistoryItem from './components/HistoryItem';
import Spinner from '../../../components/spinner';
import InputSearch from '../../../UI/InputSearch';
import WheelFortuneService from '../../../services/WheelFortuneService';
import HistoryItem from './components/HistoryItem';
import { WheelFortuneHistoryResponse } from '../../../models/response/WheelFortuneResponse';

const WheelFortuneHistory: FC = () => {
	const dispatch = useDispatch();
	const {
		visibleMenuAccountSettings,
		menuAccountSettingsPosition: menuPosition,
		updateAccounts,
	} = useSelector((state: CustomRootState) => state.app);
	const [profiles, setProfiles] = useState<ProfileMeResponse[]>([]);
	const [history, setHistory] = useState<WheelFortuneHistoryResponse>(
		{} as WheelFortuneHistoryResponse,
	);
	const [w, setW] = useState<number>(window.innerWidth);

	const [pagesNumber, setPagesNumber] = useState<number>(
		JSON.parse(localStorage.getItem('accounts-length') || '0'),
	);
	const [limit] = useState<number>(8);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchProfile, setSearchProfile] =
		useState<AdminProfileResponse | null>(null);

	const [searchId, setSearchId] = useState<string>('');
	const [isNotFound, setIsNotFound] = useState(false);

	const offsetRef = useRef<number>(
		JSON.parse(localStorage.getItem('accounts-offset') || '0'),
	);

	const getHistory = async () => {
		if (typeof offsetRef.current !== 'number') return;
		try {
			const { data: historyData } = await WheelFortuneService.getHistory(
				JSON.parse(localStorage.getItem('accounts-page') || '0'),
			);
			console.log({
				page: JSON.parse(localStorage.getItem('accounts-page') || '0'),
			});
			setHistory(historyData);
			setPagesNumber(historyData.pagination.pages);
			setLoading(true);
			localStorage.setItem(
				'accounts-length',
				JSON.stringify(historyData.pagination.pages),
			);
		} catch (e) {
			console.log(e);
		}
	};

	const changeBalance = () => {
		dispatch(setVisibleModal('cb'));
	};

	const getStats = async () => {
		const storageAccount = localStorage.getItem('account_settings');
		if (!storageAccount) return;
		const account: IPlayerRoom = JSON.parse(storageAccount);
		const { data } = await AdminService.getPlayerStatistics(account.id);
		dispatch(
			setStats({
				title: `Статистика гравця`,
				values: [
					'Кількість зіграних раундів',
					'Кількість виграних раундів',
					'Кількість програних раундів',
					account.nickname,
				],
				numbers: [
					data.defeat_times + data.won_times,
					data.won_times,
					data.defeat_times,
				],
			}),
		);
		dispatch(setVisibleModal('ss'));
	};

	const getTotalBalance = async () => {
		await WheelFortuneService.getStatus()
			.then(response => {
				alert(
					JSON.stringify({
						'Баланс для виграшів': response.data.balance,
						'Зароблені з податку': response.data.earned_from_tax,
					}),
				);
			})
			.catch(e => console.log(e));
	};

	const removeAccount = () => {
		const storageAccount = localStorage.getItem('account_settings');
		if (!storageAccount) return;
		const account = JSON.parse(storageAccount);
		AdminService.removeProfileById(account.id);
		dispatch(setUpdateAccounts());
		location.reload();
	};

	const changePage = (pageNumber: number) => {
		const lastOffset = JSON.parse(
			localStorage.getItem('accounts-offset') || '0' || `${profiles}`,
		);

		const offset = (pageNumber - 1) * limit;
		if (offset === lastOffset) return;
		offsetRef.current = offset;
		setProfiles([]);
		setLoading(false);
		getHistory();
		localStorage.setItem('accounts-offset', JSON.stringify(offset));
		localStorage.setItem('accounts-page', JSON.stringify(pageNumber));
	};

	const hideMenu = () => {
		dispatch(setVisibleMenuAccountSettings('hide'));
	};

	useEffect(() => {
		getHistory();
	}, [updateAccounts]);

	useEffect(() => {
		const resizeHandler = () => {
			setW(window.innerWidth);
		};
		window.addEventListener('resize', resizeHandler);

		return () => {
			window.removeEventListener('resize', resizeHandler);
		};
	}, []);

	useEffect(() => {
		const profileId = parseInt(searchId);
		if (searchId.length) {
			setIsNotFound(true);
		} else {
			setIsNotFound(false);
		}

		if (!isNaN(profileId)) {
			setLoading(false);
		} else {
			setLoading(true);
		}
		const Debounce = setTimeout(async () => {
			try {
				if (profileId === 0 || profileId) {
					const { data } = await AdminService.getProfileById(profileId);
					setSearchProfile(data);
					setLoading(true);
				} else {
					setSearchProfile(null);
				}
			} catch (e) {
				setSearchProfile(null);
				setLoading(true);
				console.log(e);
			}
		}, 1000);
		return () => clearTimeout(Debounce);
	}, [searchId, updateAccounts]);

	return (
		<>
			<div className={styles.tableWrapper}>
				<div className={styles.header}>
					<div
						className={styles.title}
						style={{ fontSize: window.innerWidth < 600 ? '12px' : '18px' }}>
						Колесо фортуни
					</div>

					<div style={{ display: 'flex', alignItems: 'center' }}>
						<InputSearch
							value={searchId}
							style={{ width: window.innerWidth < 400 ? '150px' : 'inherit' }}
							placeholder='Пошук по ID аккаунту'
							onChange={setSearchId}
						/>
						<div
							style={{ marginLeft: '10px' }}
							className={styles.btnBalance}
							onClick={getTotalBalance}>
							<MdOutlineAccountBalanceWallet />
						</div>
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
						<div>Гравець</div>
					</div>
					<div className={styles.rightWrapper}>
						<div className={styles.cellItem}>Ставка</div>
						<div className={styles.cellItem}>
							{w >= 850 ? 'Множник' : 'Множ...'}
						</div>
						<div className={styles.cellItem}>Приз</div>
						<div className={styles.cellItem}>ПБ</div>
						<div className={styles.cellItem}>Баланс</div>
					</div>
				</div>
				<div>
					<div className={styles.tableItems}>
						<>
							{!loading && (
								<div className={styles.flexCenter}>
									<Spinner />
								</div>
							)}

							{/* {loading && searchProfile && ( */}
							<div style={{ display: !searchId ? 'none' : 'flex' }}>
								{/* <Account key={0} profile={searchProfile} /> */}
							</div>

							{history.rotations?.map((rotateItem, id) => {
								return (
									<HistoryItem
										rotate={rotateItem}
										pageNumber={
											Number(
												JSON.parse(
													localStorage.getItem('accounts-page') || '0',
												) - 1,
											) * 25
										}
										id={id}
									/>
								);
							})}

							{!searchProfile && isNotFound && searchId && (
								<div
									style={{ display: !loading ? 'none' : 'flex' }}
									className={styles.flexCenter}>
									Аккаунта з таким ID не існує
								</div>
							)}
						</>
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
			{visibleMenuAccountSettings === 'account-settings' && (
				<MenuAccountSettings
					x={menuPosition.x}
					y={menuPosition.y}
					values={['Змінити баланс', 'Статистика', 'Видалити']}
					handlers={[changeBalance, getStats, removeAccount]}
					isAccounts={true}
					hideMenu={hideMenu}
				/>
			)}
		</>
	);
};

export default WheelFortuneHistory;