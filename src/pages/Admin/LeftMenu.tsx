import { FC } from 'react';

import classNames from 'classnames';

import { MdManageAccounts } from 'react-icons/md';
import { MdRoomPreferences } from 'react-icons/md';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
// import { ImStatsBars } from 'react-icons/im';
import { ImHome } from 'react-icons/im';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useSelector } from 'react-redux';

import styles from './../../stylesheet/styles/Admin.module.scss';
import { Link } from 'react-router-dom';

interface ILeftMenu {
	name: string;
	className?: string;
	tab: string;
	tabRoomsHandler: () => void;
	tabAccountsHandler: () => void;
	tabTransfersHandler: () => void;
}

const LeftMenu: FC<ILeftMenu> = ({
	name,
	className,
	tab,
	tabRoomsHandler,
	tabAccountsHandler,
	tabTransfersHandler,
}) => {
	const { visibleBurgerMenu } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const w = window.innerWidth > 1300;
	const left = w ? '0' : visibleBurgerMenu ? '0' : '-400px';

	return (
		<div
			className={classNames(styles.leftMenu, className)}
			style={{
				marginLeft: name === 'm' ? left : '0',
				display: !w && name === 'd' ? 'none' : 'block',
			}}>
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
				<div
					className={classNames(
						styles.item,
						tab === 'transfers' && styles.tabActive,
					)}
					onClick={tabTransfersHandler}>
					<FaMoneyBillTransfer style={{ marginRight: '10px' }} />
					<span>Перекази</span>
				</div>
				<Link to='/'>
					<div
						className={classNames(
							styles.item,
							tab === 'home' && styles.tabActive,
						)}
						onClick={tabAccountsHandler}>
						<ImHome style={{ marginRight: '10px', fontSize: '20px' }} />
						<span>На головну</span>
					</div>
				</Link>
			</div>
		</div>
	);
};

export default LeftMenu;
