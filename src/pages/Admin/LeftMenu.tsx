import { FC } from 'react';

import classNames from 'classnames';

import { MdManageAccounts } from 'react-icons/md';
import { MdRoomPreferences } from 'react-icons/md';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useSelector } from 'react-redux';

import styles from './../../stylesheet/styles/Admin.module.scss';

interface ILeftMenu {
	className?: string;
	tab: string;
	tabRoomsHandler: () => void;
	tabAccountsHandler: () => void;
}

const LeftMenu: FC<ILeftMenu> = ({
	className,
	tab,
	tabRoomsHandler,
	tabAccountsHandler,
}) => {
	const { visibleBurgerMenu } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const left = visibleBurgerMenu ? '0' : '-340px';

	return (
		<div
			className={classNames(styles.leftMenu, className)}
			style={{ marginLeft: left }}>
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
	);
};

export default LeftMenu;
