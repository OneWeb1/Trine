import { FC, useRef } from 'react';

import { TbUserPentagon } from 'react-icons/tb';

import { RootState as CustomRootState } from '../../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setVisibleMenuAccountSettings,
	setMenuAccountSettingsPosition,
} from '../../../../store/slices/app.slice';

import { HiOutlineDotsVertical } from 'react-icons/hi';

import { AdminProfileResponce } from '../../../../models/responce/AdminResponce';

import styles from './../../styles/styles-components/Account.module.scss';

interface IAccount {
	profile: AdminProfileResponce;
}

const Account: FC<IAccount> = ({ profile }) => {
	const dispatch = useDispatch();
	const { visibleMenuAccountSettings, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const settingsRef = useRef<HTMLDivElement | null>(null);

	const visibleMenu = () => {
		if (!settingsRef.current) return;
		dispatch(setVisibleMenuAccountSettings(!visibleMenuAccountSettings));
		localStorage.setItem('account_settings', JSON.stringify(profile));

		const box = settingsRef.current.getBoundingClientRect();
		dispatch(setMenuAccountSettingsPosition({ x: box.x, y: box.y }));
	};

	return (
		<>
			<div className={styles.tableItem}>
				<div className={styles.leftWrapper}>
					<div className={styles.id}>{profile.id}</div>
					<div className={styles.profileWrapper}>
						<div className={styles.avatar}>
							<div
								className={styles.border}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '25px',
								}}>
								{!profile.avatar_id && <TbUserPentagon />}
								{profile.avatar_id && (
									<img
										src={`${baseIconPath}/avatar/${profile.avatar_id}`}
										alt='Avatar'
									/>
								)}
							</div>
						</div>
						<div className={styles.content}>
							<div className={styles.name}>{profile.nickname}</div>
							<div className={styles.email}>{profile.email}</div>
						</div>
					</div>
				</div>
				<div className={styles.rightWrapper}>
					<div className={styles.balance}>{profile.balance} ₴</div>
					<div className={styles.dateWrapper}>
						{profile.created_at.split('T')[0]}
					</div>
					<div
						className={styles.settings}
						onClick={visibleMenu}
						ref={settingsRef}>
						<HiOutlineDotsVertical />
					</div>
				</div>
			</div>
		</>
	);
};

export default Account;
