import { FC } from 'react';

import { TbUserPentagon } from 'react-icons/tb';
import { GrMenu } from 'react-icons/gr';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleBurgerMenu } from '../store/slices/app.slice';

import adminLogo from './../../public/assets/admin-logo.png';

import styles from './../stylesheet/styles-components/AdminHeader.module.scss';

const AdminHeader: FC = () => {
	const dispatch = useDispatch();
	const { account, visibleBurgerMenu, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);

	const visibleBurger = () => {
		dispatch(setVisibleBurgerMenu(!visibleBurgerMenu));
	};

	return (
		<div className={styles.header}>
			<div className={styles.leftWrapper}>
				<div className={styles.burgerMenu} onClick={visibleBurger}>
					<GrMenu />
				</div>
				<div className={styles.logoWrapper}>
					<div className={styles.logo}>
						<img src={adminLogo} alt='Logo' />
					</div>
					<div className={styles.logoText}>Адмін панель</div>
				</div>
			</div>

			<div className={styles.avatar}>
				<div className={styles.border}>
					{!account.avatar_id && (
						<TbUserPentagon style={{ fontSize: '24px' }} />
					)}
					{account.avatar_id && (
						<img
							src={`${baseIconPath}/avatar/${account.avatar_id}`}
							alt='Avatar'
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminHeader;
