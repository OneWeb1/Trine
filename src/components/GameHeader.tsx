import { FC, useState, useRef } from 'react';

import { MdOutlineFullscreen } from 'react-icons/md';
import { MdFullscreenExit } from 'react-icons/md';
import { BiArrowToTop } from 'react-icons/bi';
import { BiSolidArrowFromTop } from 'react-icons/bi';

import { useNavigate } from 'react-router-dom';

import { TbUserPentagon } from 'react-icons/tb';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useSelector } from 'react-redux';
// import { setGameAction } from '../store/slices/app.slice';

import { VscDebugStepBack } from 'react-icons/vsc';
// import { RiSettings3Line } from 'react-icons/ri';

import fishka from './../../public/assets/fishka.png';

import styles from './../stylesheet/styles-components/GameHeader.module.scss';
import AdminService from '../services/AdminService';
import useOrientation from '../hooks/useOrientation';

interface IGameHeader {
	isFullScreen: boolean;
	handleFullScreen: () => void;
}

const GameHeader: FC<IGameHeader> = ({ isFullScreen, handleFullScreen }) => {
	// const dispatch = useDispatch();
	const { account, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const navigate = useNavigate();
	const orientation = useOrientation();
	const [isVisibleHeader, setIsVisibleHeader] = useState<boolean>(true);
	const headerRef = useRef<HTMLDivElement>(null);

	const wm750 = orientation === 'landscape' && window.innerWidth < 750;

	const roomLeave = async () => {
		navigate('/');

		try {
			await AdminService.roomLeave();
		} catch (e) {
			console.error(e);
		}
	};

	const handleVisibleHeader = () => {
		if (!headerRef.current) return;

		const { height } = headerRef.current.getBoundingClientRect();

		if (isVisibleHeader) {
			headerRef.current.style.marginTop = `${-height}px`;
		} else {
			headerRef.current.style.marginTop = `0px`;
		}

		setIsVisibleHeader(prev => !prev);
	};

	return (
		<div className={styles.header} ref={headerRef}>
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
					<div className={styles.item} onClick={handleFullScreen}>
						{(!isFullScreen && <MdOutlineFullscreen />) || <MdFullscreenExit />}
					</div>
					<div
						style={{ position: 'absolute', marginTop: '120px', right: '20px' }}
						className={styles.visibleHeader}
						onClick={handleVisibleHeader}>
						{(isVisibleHeader && <BiArrowToTop />) || <BiSolidArrowFromTop />}
					</div>
					<div className={styles.item} onClick={roomLeave}>
						<VscDebugStepBack style={{ fontSize: '14px' }} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameHeader;
