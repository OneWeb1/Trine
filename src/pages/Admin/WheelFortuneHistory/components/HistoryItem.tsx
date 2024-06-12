import { FC } from 'react';

import { TbUserPentagon } from 'react-icons/tb';

import { RootState as CustomRootState } from '../../../../store/rootReducer';
import { useSelector } from 'react-redux';
// import {
// 	setVisibleMenuAccountSettings,
// 	setMenuAccountSettingsPosition,
// } from '../../../../store/slices/app.slice';

// import { HiOutlineDotsVertical } from 'react-icons/hi';

// import { AdminProfileResponse } from '../../../../models/response/AdminResponse';

import styles from './../../styles/styles-components/History.module.scss';
import { WheelFortuneHistoryRotationResponse } from '../../../../models/response/WheelFortuneResponse';

interface IHistoryItem {
	rotate: WheelFortuneHistoryRotationResponse;
}

const HistoryItem: FC<IHistoryItem> = ({ rotate }) => {
	const { baseIconPath } = useSelector((state: CustomRootState) => state.app);

	return (
		<>
			<div className={styles.tableItem}>
				<div className={styles.leftWrapper}>
					<div className={styles.id}>{rotate.id}</div>
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
					<div className={styles.cellItem}>{rotate.bid}</div>
					<div className={styles.cellItem}>{rotate.multiplier}x</div>
					<div className={styles.cellItem}>{rotate.prize}</div>
					<div className={styles.cellItem}>{rotate.prev_balance}₴</div>
					<div className={styles.cellItem}>{rotate.balance}₴</div>
				</div>
			</div>
		</>
	);
};

export default HistoryItem;
