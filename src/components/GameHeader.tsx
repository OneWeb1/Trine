import { FC } from 'react';

import { TbUserPentagon } from 'react-icons/tb';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { VscDebugStepBack } from 'react-icons/vsc';
// import { RiSettings3Line } from 'react-icons/ri';

import fishka from './../../public/assets/fishka.png';

import styles from './../stylesheet/styles-components/GameHeader.module.scss';

const GameHeader: FC = () => {
	const { account, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);
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
						<div className={styles.name}>{account.nickname}</div>
						<div className={styles.chips}>
							<span className={styles.item}>
								<img src={fishka} alt='fishka' />
							</span>{' '}
							<span className={styles.chipsNumber}>{account.balance}</span>
						</div>
					</div>
				</div>

				<div className={styles.rightWrapper}>
					<Link to='/'>
						<div className={styles.item}>
							<VscDebugStepBack />
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default GameHeader;
