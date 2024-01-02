import { FC } from 'react';

import { TbUserPentagon } from 'react-icons/tb';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useSelector } from 'react-redux';

import adminLogo from './../../public/assets/admin-logo.png';

import styles from './../stylesheet/styles-components/AdminHeader.module.scss';

const AdminHeader: FC = () => {
	const { account, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);
	return (
		<div className={styles.header}>
			<div className={styles.logoWrapper}>
				<div className={styles.logo}>
					<img src={adminLogo} alt='Logo' />
				</div>
				<div className={styles.logoText}>Admin Panel</div>
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
