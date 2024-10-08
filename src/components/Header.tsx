import { FC, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import { TbUserPentagon } from 'react-icons/tb';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
// import { GiPayMoney } from 'react-icons/gi';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';
// import { TbLivePhoto } from 'react-icons/tb';
import { LuAlignVerticalSpaceBetween } from 'react-icons/lu';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setVisibleModal,
	setIsAuth,
	setIsSubmit,
} from '../store/slices/app.slice';

import { HiOutlineDotsVertical } from 'react-icons/hi';

import Button from '../UI/Button';

import logo from './../../public/assets/logo1.svg';

import styles from './../stylesheet/styles-components/Header.module.scss';
import GameService from '../services/GameService';
import { LiveWinsResponse } from '../models/response/AdminResponse';

const Header: FC = () => {
	const dispatch = useDispatch();
	const { account, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [isVisibleDropDownMenu, setIsVisibleDropDownMenu] =
		useState<boolean>(false);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const [playersWin, setPlayersWin] = useState<LiveWinsResponse[]>(
		[] as LiveWinsResponse[],
	);
	const [playerWin, setPlayerWin] = useState<LiveWinsResponse>(
		{} as LiveWinsResponse,
	);

	const [openList, setOpenList] = useState<boolean>(false);

	const intervalRef = useRef<number>(0);

	const cssStyle = {
		opacity: 1,
		height: `${3 * 31}px`,
		padding: '5px',
	};

	const visibleMenuHandler = () => {
		setTimeout(() => {
			setIsVisibleDropDownMenu(!isVisibleDropDownMenu);
		}, 0);
	};

	const payHandler = () => {
		dispatch(setVisibleModal('dp'));
	};

	const logoutHandler = () => {
		localStorage.removeItem('token');
		dispatch(setIsAuth(false));
	};

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		const getLiveWins = async () => {
			try {
				const { data } = await GameService.liveWins();
				setPlayerWin(data[0]);
				setPlayersWin(data);
			} catch (e) {
				console.log(e);
			}
		};

		getLiveWins();

		const hideDropDownMenu = () => setIsVisibleDropDownMenu(false);

		intervalRef.current = setInterval(() => {
			getLiveWins();
		}, 1000);

		window.addEventListener('resize', handleResize);
		window.addEventListener('click', hideDropDownMenu);

		return () => {
			clearInterval(intervalRef.current);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('click', hideDropDownMenu);
		};
	}, []);

	return (
		<>
			<header>
				<div className={styles.header}>
					<Link to='/'>
						<div className={styles.logo}>
							<img
								style={
									{
										// transform:
										// 	(windowWidth < 400 && `scale(.7) translateX(-20px)`) ||
										// 	`scale(1)`,
									}
								}
								src={logo}
								alt='Logo'
							/>
						</div>
					</Link>

					<div className={styles.rightWrapper}>
						<div className={styles.balanceWrapper}>
							<div className={styles.balanceTitle}>Баланс</div>
							<div
								style={{ fontSize: (windowWidth <= 400 && '13px') || '15px' }}
								className={styles.balance}>
								{account.balance} ₴
							</div>
						</div>
						<div className={styles.dropdown}>
							<div
								className={styles.menuWrapper}
								onClick={() => visibleMenuHandler()}>
								<div className={styles.icon}>
									{!account.avatar_id && <TbUserPentagon />}
									{account.avatar_id && (
										<img
											src={`${baseIconPath}/avatar/${account.avatar_id}`}
											alt='Avatar'
										/>
									)}
								</div>
								<div className={styles.dots}>
									<HiOutlineDotsVertical />
								</div>
							</div>
							{isVisibleDropDownMenu && (
								<div
									className={classNames(
										styles.menuList,
										(windowWidth >= 600 && styles.menuArrowDesc) ||
											styles.menuArrowMob,
									)}
									style={{
										left: (windowWidth >= 600 && '-145px') || '-234px',
									}}>
									{(account.is_admin || account.is_super_admin) && (
										<Link to='/admin'>
											<div className={styles.item} id='item'>
												<MdOutlineAdminPanelSettings
													className={styles.menuIcon}
												/>{' '}
												Адмін панель
											</div>
										</Link>
									)}
									{windowWidth < 600 && (
										<div
											className={styles.item}
											id='item'
											onClick={() => {
												dispatch(setVisibleModal('dp'));
												setIsVisibleDropDownMenu(false);
											}}>
											<LuAlignVerticalSpaceBetween
												className={styles.menuIcon}
											/>
											Поповнення рахунку
										</div>
									)}

									<div
										className={styles.item}
										id='item'
										onClick={() => {
											dispatch(setVisibleModal('vp'));
											setIsVisibleDropDownMenu(false);
										}}>
										<BiMoneyWithdraw className={styles.menuIcon} /> Виведення
										коштів
									</div>
									{/* <div
									className={styles.item}
									id='item'
									onClick={() => {
										dispatch(setVisibleModal('lw'));
										setIsVisibleDropDownMenu(false);
									}}>
									<TbLivePhoto className={styles.menuIcon} /> Лайв виграші
								</div> */}
									<div
										className={styles.item}
										id='item'
										onClick={() => {
											dispatch(setVisibleModal('s'));
											setIsVisibleDropDownMenu(false);
										}}>
										<IoSettingsOutline className={styles.menuIcon} />{' '}
										Налаштування
									</div>
									<Link
										to='/login'
										onClick={() =>
											setTimeout(() => {
												logoutHandler();
												dispatch(setIsSubmit(false));
											}, 0)
										}>
										<div className={styles.item} id='item'>
											<CiLogout className={styles.menuIcon} /> Вийти
										</div>
									</Link>
								</div>
							)}
						</div>
						{windowWidth > 600 && (
							<Button
								style={{
									padding: '9px 32px',
									marginLeft: '10px',
									fontWeight: 500,
									fontSize: '12px',
									maxHeight: '35px',
									maxWidth: '130px',
								}}
								value='Поповнити'
								noLoading={true}
								onClick={payHandler}
							/>
						)}
					</div>
				</div>
				{playersWin?.length && (
					<div className={styles.notification}>
						<div
							style={{ opacity: openList ? 1 : 0 }}
							className={styles.arrow}></div>

						<div
							className={styles.title}
							onClick={() => setOpenList(!openList)}>
							<div className={styles.name}>{playerWin.account.nickname}</div>
							{'   '}
							щойно виграв +{playerWin?.prize}₴
						</div>
						<div style={openList ? cssStyle : {}} className={styles.menu}>
							{playersWin.map(playerWin => (
								<div>
									<span className={styles.name}>
										{playerWin?.account?.nickname}
									</span>
									{'   '}
									щойно виграв +{playerWin.prize}₴
								</div>
							))}
						</div>
					</div>
				)}
			</header>
		</>
	);
};

export default Header;
