import { FC, useRef } from 'react';

import { TbUserPentagon } from 'react-icons/tb';

import { RootState as CustomRootState } from '../../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setVisibleMenuAccountSettings,
	setMenuAccountSettingsPosition,
} from '../../../../store/slices/app.slice';

import { HiOutlineDotsVertical } from 'react-icons/hi';

import { AdminProfileResponse } from '../../../../models/response/AdminResponse';

import styles from './../../styles/styles-components/History.module.scss';
import { WheelFortuneHistoryRotationResponse } from '../../../../models/response/WheelFortuneResponse';

interface IHistoryItem {
	pageNumber: number;
	id: number;
	rotate: WheelFortuneHistoryRotationResponse;
}

const HistoryItem: FC<IHistoryItem> = ({ rotate, pageNumber, id }) => {
	console.log(pageNumber * id);
	const dispatch = useDispatch();
	const { baseIconPath } = useSelector((state: CustomRootState) => state.app);
	const settingsRef = useRef<HTMLDivElement | null>(null);

	// const visibleMenu = () => {
	// 	if (!settingsRef.current) return;
	// 	dispatch(setVisibleMenuAccountSettings('account-settings'));
	// 	localStorage.setItem('account_settings', JSON.stringify(profile));

	// 	const box = settingsRef.current.getBoundingClientRect();
	// 	dispatch(setMenuAccountSettingsPosition({ x: box.x, y: box.y }));
	// };

	return (
		<>
			<div className={styles.tableItem}>
				<div className={styles.leftWrapper}>
					<div className={styles.id}>{pageNumber + id}</div>
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
								{!rotate.account.avatar_id && <TbUserPentagon />}
								{rotate.account.avatar_id && (
									<img
										src={`${baseIconPath}/avatar/${rotate.account.avatar_id}`}
										alt='Avatar'
									/>
								)}
							</div>
						</div>
						<div className={styles.content}>
							<div className={styles.name}>{rotate.account.nickname}</div>
							<div className={styles.email}>{rotate.account.email}</div>
						</div>
					</div>
				</div>
				<div className={styles.rightWrapper}>
					<div className={styles.cellItem}>{rotate.prev_balance}₴</div>
					<div className={styles.cellItem}>{rotate.bid}</div>
					<div className={styles.cellItem}>{rotate.multiplier}x</div>
					<div className={styles.cellItem}>{rotate.prize}</div>
					<div className={styles.cellItem}>{rotate.balance}₴</div>
				</div>
			</div>
		</>
	);
};

export default HistoryItem;
