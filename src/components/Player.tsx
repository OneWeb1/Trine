import { FC, useEffect, useRef, memo } from 'react';

import classNames from 'classnames';

import { GiCardExchange } from 'react-icons/gi';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useSelector } from 'react-redux';

import FishkaItem from './FishkaItem';
import TreeCards from './cards';

import { IPlayerRoom } from '../models/response/AdminResponse';

import styles from './../stylesheet/styles-components/Players.module.scss';
import AdminService from '../services/AdminService';
import CircleTimer from './timer';
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

	// const indexes = [1, 2, 3, 4, 5];
	// const isReverseCards = indexes.includes(index);

	const isMobile = window.innerWidth <= 600 && window.innerHeight >= 500;

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
		const bh = ref.current.clientHeight;

		const landscapePlayersPosition = {
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

		const portraitPlayersPositions = {
			l: [
				{ left: -40, top: nbh * 0.2 - bh / 2 },
				{ left: -40, top: nbh * 0.4 - bh / 2 },
				{ left: -40, top: nbh * 0.6 - bh / 2 },
				{ left: -40, top: nbh * 0.8 - bh / 2 },
			],
			r: [
				{ left: nbw - 55, top: nbh * 0.2 - bh / 2 },
				{ left: nbw - 55, top: nbh * 0.4 - bh / 2 },
				{ left: nbw - 55, top: nbh * 0.6 - bh / 2 },
				{ left: nbw - 55, top: nbh * 0.8 - bh / 2 },
			],
			t: [
				{ left: nbw * 0.15, top: -10 },
				{ left: nbw * 0.85 - nbw * 0.15, top: -10 },
			],
			b: [{ left: nbw * 0.5 - bw / 2, top: nbh + 20 - bh / 2 }],
		};

		const landscapePosition = [
			landscapePlayersPosition.b[1],
			landscapePlayersPosition.b[0],
			landscapePlayersPosition.l[1],
			landscapePlayersPosition.l[0],
			landscapePlayersPosition.t[0],
			landscapePlayersPosition.t[1],
			landscapePlayersPosition.t[2],
			landscapePlayersPosition.t[3],
			landscapePlayersPosition.r[0],
			landscapePlayersPosition.r[1],
			landscapePlayersPosition.b[2],
		];

		const portraitPosition = [
			portraitPlayersPositions.b[0],
			portraitPlayersPositions.l[3],
			portraitPlayersPositions.l[2],
			portraitPlayersPositions.l[1],
			portraitPlayersPositions.l[0],
			portraitPlayersPositions.t[0],
			portraitPlayersPositions.t[1],
			portraitPlayersPositions.r[0],
			portraitPlayersPositions.r[1],
			portraitPlayersPositions.r[2],
			portraitPlayersPositions.r[3],
		];

		const positions = isMobile ? portraitPosition : landscapePosition;

		ref.current.style.left = positions[index].left + 'px';
		ref.current.style.top =
			(!reverse && positions[index].top + 'px') ||
			positions[index].top - 70 + 'px';
	};

	const rightPlayersId = [6, 7, 8, 9, 10];
	const isRightPlayer = rightPlayersId.includes(index);

	const pStyle = {
		position: 'absolute',
		left: !isRightPlayer ? '90px' : '-140px',
		top: '100px',
	};

	const prStyle = {
		position: 'absolute',
		left:
			isRightPlayer && index !== 6
				? '-140px'
				: index === 5
				? '40px'
				: index === 6
				? '-90px'
				: '90px',
		top: index === 5 || index === 6 ? '150px' : '60px',
	};

	const portraitStyle = isMobile && index ? pStyle : {};
	const portraitRightStyle = isMobile ? prStyle : {};

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
			onClick={isMeMove && lastId === player.id ? doCheckCards : () => {}}
			className={styles.player}
			ref={ref}
			style={{
				display: (index === 0 && 'flex') || '',
				marginLeft: player.me ? '15px' : '0px',
				opacity: player.state === 'defeat' ? 0.5 : 1,
			}}>
			<div>
				{reverse && (
					<>
						<div
							className={styles.info}
							style={{
								marginTop: (!player.last_move && '0px') || '0px',
								...portraitStyle,
							}}>
							<div style={{ marginLeft: '50px' }}>
								<FishkaItem isPlayer={true} value={player.full_bid} />
							</div>
							<div className={styles.icon}>
								{!player.me && player.state !== 'defeat' && (
									<TreeCards
										style={{
											position: 'absolute',
											left: !isRightPlayer ? '-120px' : '50px',
											top: '-10px',
											width: '170px',
											transform: 'scale(.2)',
										}}
										cards={['fb', 'fb', 'fb']}
									/>
								)}
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
					{(player.state === 'move' || player.me) &&
						player.time_for_move > 0 && (
							<CircleTimer
								style={{ marginLeft: player.me ? '-10.5px' : '0px' }}
								startTime={20}
								currentTime={player.time_for_move}
							/>
						)}

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
								number={player.cards_sum}
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
						<div
							style={{
								position: 'absolute',
								zIndex: '0',
								cursor: 'pointer',
							}}
							className={styles.checkWrapper}>
							<div className={styles.checkButton}>
								<GiCardExchange />
							</div>
						</div>
					)}
				</div>

				<div className={styles.name}>
					{(player.me && 'Ви') || player.nickname}
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
						<div
							className={styles.info}
							style={{
								marginTop: '5px',
								marginLeft: !isMobile ? '-80px' : '',
								...portraitRightStyle,
							}}>
							<div style={{ marginLeft: '50px' }}>
								<FishkaItem isPlayer={true} value={player.full_bid} />
							</div>
							<div className={styles.icon}>
								{!player.me && player.state !== 'defeat' && (
									<TreeCards
										style={{
											position: 'absolute',
											left: !isRightPlayer ? '-120px' : '50px',
											top: '-10px',
											width: '180px',
											transform: 'scale(.2)',
										}}
										cards={['fb', 'fb', 'fb', 'jpg']}
									/>
								)}
							</div>
						</div>
					</>
				)}
			</div>
			{index === 0 && (
				<div className={styles.cards}>
					{!isVisibleCards && (
						<TreeCards
							style={{ width: '180px', marginTop: '-25px', marginLeft: '30px' }}
							visible={true}
							cards={['fb', 'fb', 'fb']}
						/>
					)}
					{isVisibleCards && (
						<TreeCards
							style={{ width: '180px', marginTop: '-25px', marginLeft: '30px' }}
							visible={isVisibleCards}
							cards={cards}
							number={player.cards_sum}
						/>
					)}
				</div>
			)}
		</div>
	);
};

const memoPlayer = memo(Player);

export default memoPlayer;
