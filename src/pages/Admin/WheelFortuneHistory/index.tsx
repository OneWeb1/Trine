import { FC, useState, useEffect, useRef } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleModal } from '../../../store/slices/app.slice';

// import { MdOutlineSettingsEthernet } from 'react-icons/md';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';

import Pagination from '../../../components/Pagination';

// import AdminService from '../../../services/AdminService';

import styles from './../styles/WheelFortune.module.scss';
import {
	AdminProfileResponse,
	ProfileMeResponse,
} from '../../../models/response/AdminResponse';
// import HistoryItem from './components/HistoryItem';
import Spinner from '../../../components/spinner';
import InputSearch from '../../../UI/InputSearch';
import WheelFortuneService from '../../../services/WheelFortuneService';
import HistoryItem from './components/HistoryItem';
import { WheelFortuneHistoryResponse } from '../../../models/response/WheelFortuneResponse';
import ModalWheelOfFortuneStats from '../../../components/modals/ModalWheelOfFortuneStats';

const WheelFortuneHistory: FC = () => {
	const dispatch = useDispatch();
	const { visibleModal, updateAccounts } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [profiles, setProfiles] = useState<ProfileMeResponse[]>([]);
	const [history, setHistory] = useState<WheelFortuneHistoryResponse>(
		{} as WheelFortuneHistoryResponse,
	);
	const [w, setW] = useState<number>(window.innerWidth);

	const [pagesNumber, setPagesNumber] = useState<number>(
		JSON.parse(localStorage.getItem('fortune-length') || '0'),
	);
	const [pageNumber, setPageNumber] = useState<number>(
		JSON.parse(localStorage.getItem('fortune-page') || '0'),
	);

	const [limit] = useState<number>(28);
	const [balance, setBalance] = useState<number>(0);
	const [earnedFromTax, setEarnedFromTax] = useState<number>(28);
	const [changePagination, setChangePagination] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	useState<AdminProfileResponse | null>(null);

	const [searchId, setSearchId] = useState<string>('');

	const offsetRef = useRef<number>(
		JSON.parse(localStorage.getItem('fortune-offset') || '0'),
	);

	const changePage = (pageNumber: number) => {
		const lastOffset = JSON.parse(
			localStorage.getItem('fortune-offset') || '0' || `${profiles}`,
		);

		const offset = (pageNumber - 1) * limit;
		if (offset === lastOffset) return;
		offsetRef.current = offset;
		setPageNumber(pageNumber);
		localStorage.setItem('fortune-offset', JSON.stringify(offset));
		localStorage.setItem('fortune-page', JSON.stringify(pageNumber));
		setProfiles([]);
		setLoading(false);
		getHistory();
	};

	const getHistory = async () => {
		if (typeof offsetRef.current !== 'number') return;

		try {
			const accountId =
				typeof Number(searchId) === 'number' ? Number(searchId) : 0;
			const { data: historyData } = await WheelFortuneService.getHistory({
				page: JSON.parse(localStorage.getItem('fortune-page') || '0'),
				profileId: accountId,
			});

			if (searchId) {
				setChangePagination(1);
			}

			setHistory(historyData);
			setPagesNumber(historyData.pagination.pages);
			setLoading(true);
			localStorage.setItem(
				'fortune-length',
				JSON.stringify(historyData.pagination.pages),
			);
		} catch (e) {
			console.log(e);
		}
	};

	const getTotalBalance = async () => {
		await WheelFortuneService.getStatus()
			.then(response => {
				const { balance, earned_from_tax } = response.data;
				setBalance(balance);
				setEarnedFromTax(earned_from_tax);

				dispatch(setVisibleModal('wfs'));
				// alert(
				// 	JSON.stringify({
				// 		'Баланс для виграшів': response.data.balance,
				// 		'Зароблені з податку': response.data.earned_from_tax,
				// 	}),
				// );
			})
			.catch(e => console.log(e));
	};

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

		if (!isNaN(profileId)) {
			setLoading(false);
		} else {
			setLoading(true);
		}
		const Debounce = setTimeout(async () => {
			changePage(1);
			setPageNumber(1);
			getHistory();
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

							{history.rotations?.map(rotateItem => {
								return <HistoryItem rotate={rotateItem} />;
							})}

							{searchId && !history?.pagination?.pages && (
								<div
									style={{ display: !loading ? 'none' : 'flex' }}
									className={styles.flexCenter}>
									Аккаунт з таким ID не крутив колесо
								</div>
							)}
						</>
					</div>
					<div style={{ padding: '0px 10px', paddingTop: '10px' }}>
						<Pagination
							numbers={pagesNumber > 10 ? pagesNumber : 10}
							workPages={!pagesNumber ? 1 : pagesNumber}
							current={pageNumber}
							change={changePagination}
							changePage={changePage}
						/>
					</div>
				</div>
			</div>
			{visibleModal === 'wfs' && (
				<ModalWheelOfFortuneStats
					title='Статистика фортуни'
					balance={balance}
					earnedFromTax={earnedFromTax}
				/>
			)}
		</>
	);
};

export default WheelFortuneHistory;
