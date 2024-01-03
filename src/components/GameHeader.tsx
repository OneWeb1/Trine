import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { TbUserPentagon } from 'react-icons/tb';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useSelector } from 'react-redux';

import { VscDebugStepBack } from 'react-icons/vsc';
// import { RiSettings3Line } from 'react-icons/ri';

import fishka from './../../public/assets/fishka.png';

import styles from './../stylesheet/styles-components/GameHeader.module.scss';
import AdminService from '../services/AdminService';
import useOrientation from '../hooks/useOrientation';

const GameHeader: FC = () => {
	const { account, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);

	const navigate = useNavigate();
	const orientation = useOrientation();
	const wm750 = orientation === 'landscape' && window.innerWidth < 750;

	const roomLeave = async () => {
		try {
			await AdminService.roomLeave();
		} catch (e) {
			console.error(e);
		}
		navigate('/');
	};

	return (
		<div className={styles.header}>
			<div className={styles.container}>
				<div className={styles.profile}>
					<div className={styles.avatar}>
						<div className={styles.border}>
							{!account.avatar_id && <TbUserPentagon />}
							{account.avatar_id && (
								<img
									src={`${baseIconPath}/avatar/${account.avatar_id}`}
									alt='Avatar'
								/>
							)}
						</div>
					</div>
					<div className={styles.content}>
						<div
							className={styles.name}
							style={{
								fontSize: (wm750 && '10px') || '14px',
								fontWeight: '600',
							}}>
							{account.nickname}
						</div>
						<div className={styles.chips}>
							<span className={styles.item}>
								<img src={fishka} alt='fishka' />
							</span>{' '}
							<span
								className={styles.chipsNumber}
								style={{ fontSize: (wm750 && '10px') || '14px' }}>
								{account.balance}
							</span>
						</div>
					</div>
				</div>

				<div className={styles.rightWrapper}>
					<div className={styles.item} onClick={roomLeave}>
						<VscDebugStepBack />
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameHeader;
