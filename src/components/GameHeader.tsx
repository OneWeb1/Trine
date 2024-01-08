import { FC, useState, useRef, useEffect } from 'react';

import useOrientation from '../hooks/useOrientation';

import { MdOutlineFullscreen } from 'react-icons/md';
import { MdFullscreenExit } from 'react-icons/md';
import { BiArrowToTop } from 'react-icons/bi';
import { BiSolidArrowFromTop } from 'react-icons/bi';

import { useNavigate } from 'react-router-dom';

import { TbUserPentagon } from 'react-icons/tb';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setAccount } from '../store/slices/app.slice';

import { VscDebugStepBack } from 'react-icons/vsc';
// import { RiSettings3Line } from 'react-icons/ri';

import AdminService from '../services/AdminService';

import fishka from './../../public/assets/fishka.png';

import styles from './../stylesheet/styles-components/GameHeader.module.scss';

interface IGameHeader {
	isFullScreen: boolean;
	handleFullScreen: () => void;
}

const GameHeader: FC<IGameHeader> = ({ isFullScreen, handleFullScreen }) => {
	const dispatch = useDispatch();
	const { account, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const navigate = useNavigate();
	const orientation = useOrientation();
	const [isVisibleHeader, setIsVisibleHeader] = useState<boolean>(true);
	const headerRef = useRef<HTMLDivElement>(null);
	const intervalRef = useRef<number>(0);

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

	useEffect(() => {
		if (!intervalRef.current) {
			intervalRef.current = setInterval(async () => {
				try {
					const { data } = await AdminService.getMeProfile();
					if (data && Object.keys(data).length) {
						dispatch(setAccount(data));
					}
				} catch (e) {
					console.log(e);
				}
			}, 3000);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

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
