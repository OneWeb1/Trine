import { FC, useEffect, useRef } from 'react';

import classNames from 'classnames';

import { GiCardExchange } from 'react-icons/gi';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useSelector } from 'react-redux';

import FishkaItem from './FishkaItem';
import TreeCards from './cards';

import { IPlayerRoom } from '../models/responce/AdminResponce';

import styles from './../stylesheet/styles-components/Players.module.scss';
import AdminService from '../services/AdminService';
// import { setVisibleStateMessage } from '../store/slices/app.slice';

interface IPlayer {
	cards: string[];
	player: IPlayerRoom;
	reverse: boolean;
	isCurrent?: boolean;
	isReady: boolean;
	isVisibleCards: boolean;
	check: { visible: boolean; id: number };
	lastId: number;
	isMeMove: boolean;
	bet: number;
	index: number;
}

const Player: FC<IPlayer> = ({
	player,
	reverse,
	isMeMove,
	// isReady,
	isVisibleCards,
	// check,
	lastId,
	cards,
	index,
}) => {
	const { visibleStateMessage, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const ref = useRef<HTMLDivElement | null>(null);
	const blockedRePositionRef = useRef<boolean>(false);
	const timeoutRef = useRef<number | null>(null);
	const avatarRef = useRef<HTMLDivElement>(null);

	const { visible, message, id } = visibleStateMessage;
	const visibleMessage = visible && player.id === id;

	const doCheckCards = async () => {
		try {
			await AdminService.do({ action: 'check' });
		} catch (e) {
			console.log(e);
		}
	};

	const setPosition = () => {
		if (!ref.current) return;
		if (!avatarRef.current) return;
		if (!ref.current.parentElement) return;
		const nbw = ref.current.parentElement.clientWidth;
		const nbh = ref.current.parentElement.clientHeight;
		const bw = ref.current.clientWidth;

		const position = {
			t: [
				{ top: -40, left: nbw * 0.2 - bw / 2 },
				{ top: -40, left: nbw * 0.4 - bw / 2 },
				{ top: -40, left: nbw * 0.6 - bw / 2 },
				{ top: -40, left: nbw * 0.8 - bw / 2 },
			],
			b: [
				{ top: nbh - 60, left: nbw * 0.2 - bw / 2 },
				{ top: nbh - 60, left: nbw * 0.5 - bw / 2 },
				{ top: nbh - 60, left: nbw * 0.8 - bw / 2 },
			],
			l: [
				{ top: nbh * 0.15, left: 0 },
				{ top: nbh * 0.85 - nbh * 0.15, left: 0 },
			],
			r: [
				{ top: nbh * 0.15, left: nbw - bw },
				{ top: nbh * 0.85 - nbh * 0.15, left: nbw - bw },
			],
		};

		const positions = [
			position.b[1],
			position.b[0],
			position.l[1],
			position.l[0],
			position.t[0],
			position.t[1],
			position.t[2],
			position.t[3],
			position.r[0],
			position.r[1],
			position.b[2],
		];

		ref.current.style.left = positions[index].left + 'px';
		ref.current.style.top =
			(!reverse && positions[index].top + 'px') ||
			positions[index].top - 70 + 'px';
	};

	const handleResize = () => {
		if (!blockedRePositionRef.current) blockedRePositionRef.current = true;
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			blockedRePositionRef.current = false;
		}, 3000);
	};

	useEffect(() => {
		setPosition();

		window.addEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (!blockedRePositionRef.current) setPosition();
	});

	return (
		<div
			className={styles.player}
			ref={ref}
			style={{
				display: (index === 0 && 'flex') || '',
				// opacity: player.state === 'defeat' ? 0.3 : 1,
			}}>
			<div>
				{reverse && (
					<>
						<div
							className={styles.info}
							style={{ marginTop: (!player.last_move && '0px') || '0px' }}>
							<FishkaItem isPlayer={true} value={player.full_bid} />
							<div className={styles.icon}>
								<TreeCards
									style={{
										position: 'absolute',
										left: '0',
										top: '-10px',
										width: '170px',
										transform: 'scale(.2)',
									}}
									cards={['fb', 'fb', 'fb', 'jpg']}
								/>
							</div>
						</div>
						{/* {(player.last_move || player.state === 'idle') && ( */}
						<div
							className={styles.viewState}
							style={{
								opacity: visibleMessage ? 1 : 0,
								marginBottom: '0px',
							}}>
							{message}
						</div>
					</>
				)}
				<div ref={avatarRef} className={styles.avatarWrapper}>
					{!player.cards.includes('*') && !player.me && (
						<div
							style={{
								position: 'absolute',
								width: '160px',
								marginLeft: '-60px',
								marginTop: '0px',
								zIndex: 1000,
							}}>
							<TreeCards
								style={{ transform: 'scale(.8) translateY(-20px)' }}
								cards={player.cards}
								visible={true}
							/>
						</div>
					)}

					<div
						className={classNames(
							styles.avatar,
							player.state === 'move' && styles.anim,
						)}
						style={{
							marginTop: '5px',
						}}>
						{/* {player.state === 'move' && <div className={styles.timeLoader}></div>} */}

						<div
							className={styles.border}
							style={{
								background:
									(player.state === 'move' &&
										'linear-gradient(#00ff7b, #005027)') ||
									'linear-gradient(#2970fa, #17203f)',
							}}>
							<img
								src={`${baseIconPath}/avatar/${player.avatar_id}`}
								alt='Avatar'
							/>
						</div>
					</div>
					{isMeMove && lastId === player.id && (
						<div className={styles.checkWrapper}>
							<div className={styles.checkButton} onClick={doCheckCards}>
								<GiCardExchange />
							</div>
						</div>
					)}
				</div>

				<div className={styles.name}>
					{(player.me && 'Я') || player.nickname}
				</div>

				{!reverse && (
					<>
						{/* {player.last_move && player.state === 'idle' && ( */}
						<div
							className={styles.viewState}
							style={{
								opacity: visibleMessage ? 1 : 0,
								marginTop: '28px',
							}}>
							{message}
						</div>
						{/* )} */}
						<div className={styles.info} style={{ marginTop: '5px' }}>
							<FishkaItem isPlayer={true} value={player.full_bid} />
							<div className={styles.icon}>
								<TreeCards
									style={{
										position: 'absolute',
										left: '0',
										top: '-10px',
										width: '170px',
										transform: 'scale(.2)',
									}}
									cards={['fb', 'fb', 'fb', 'jpg']}
								/>
							</div>
						</div>
					</>
				)}
			</div>
			{index === 0 && (
				<div className={styles.cards}>
					{!isVisibleCards && (
						<TreeCards
							style={{ marginTop: '-10px', marginLeft: '30px' }}
							visible={true}
							cards={['fb', 'fb', 'fb']}
						/>
					)}
					{isVisibleCards && (
						<TreeCards
							style={{ marginTop: '-10px', marginLeft: '30px' }}
							visible={isVisibleCards}
							cards={cards}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default Player;
