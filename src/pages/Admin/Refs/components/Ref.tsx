import { FC, useRef } from 'react';
import { Link } from 'react-router-dom';

// import { TbUserPentagon } from 'react-icons/tb';

// import { RootState as CustomRootState } from '../../../../store/rootReducer';
import { useDispatch } from 'react-redux';
import {
	setVisibleMenuAccountSettings,
	setMenuAccountSettingsPosition,
} from '../../../../store/slices/app.slice';

import { HiOutlineDotsVertical } from 'react-icons/hi';

import {
	// AdminProfileResponse,
	AdminRefResponse,
} from '../../../../models/response/AdminResponse';

import styles from './../../styles/styles-components/Ref.module.scss';

interface IRef {
	item: AdminRefResponse;
}

const Ref: FC<IRef> = ({ item }) => {
	const dispatch = useDispatch();
	// const { visibleMenuAccountSettings } = useSelector(
	// 	(state: CustomRootState) => state.app,
	// );
	const settingsRef = useRef<HTMLDivElement | null>(null);

	const visibleMenu = () => {
		if (!settingsRef.current) return;
		dispatch(setVisibleMenuAccountSettings('account-settings'));
		localStorage.setItem('ref_settings', JSON.stringify(item));

		const box = settingsRef.current.getBoundingClientRect();
		console.log(box);
		dispatch(setMenuAccountSettingsPosition({ x: box.x, y: box.y }));
	};

	return (
		<>
			<div className={styles.tableItem}>
				<div className={styles.leftWrapper}>
					<div className={styles.id}>{item.id}</div>
					<div className={styles.profileWrapper}>
						{/* <div className={styles.avatar}>
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
						</div> */}
						<div className={styles.content}>
							<div className={styles.name}>{item.name}</div>
							{/* <div className={styles.email}>{profile.email}</div> */}
						</div>
					</div>
				</div>
				<div className={styles.rightWrapper}>
					<div className={styles.link}>{item.refLink}</div>
					<div
						style={{ display: 'flex', alignItems: 'center' }}
						className={styles.wrapper}>
						{window.innerWidth > 550 && (
							<div className={styles.telegram}>
								<Link target='blank' to={`https://${item.effectiveLink}`}>
									@{item.effectiveLink.split('/')[1]}
								</Link>
							</div>
						)}
						<div
							className={styles.settings}
							onClick={() => visibleMenu()}
							ref={settingsRef}>
							<HiOutlineDotsVertical />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Ref;
