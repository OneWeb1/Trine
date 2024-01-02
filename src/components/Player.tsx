import { FC, useEffect, useRef } from 'react';

import classNames from 'classnames';

import { GiCardExchange } from 'react-icons/gi';

import { RootState as CustomRootState } from '../store/rootReducer';
import { useSelector } from 'react-redux';

import FishkaItem from './FishkaItem';
import TreeCards from './cards';

import { IPlayerRoom } from '../models/responce/AdminResponce';

import cardsMin from './../../public/assets/cards-min.png';

import styles from './../stylesheet/styles-components/Players.module.scss';
import AdminService from '../services/AdminService';

interface IPlayer {
	cards: string[];
	player: IPlayerRoom;
	reverse: boolean;
	isCurrent?: boolean;
	isReady: boolean;
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
	isReady,
	check,
	lastId,
	cards,
	index,
}) => {
	const { visibleStateMessage, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const ref = useRef<HTMLDivElement | null>(null);

	const { visible, id } = visibleStateMessage;

	const doCheckCards = async () => {
		const { data } = await AdminService.do({ action: 'check' });
		const players = data.players;
		players.forEach(player => {
			console.log(player.state);
			if (player.me && player.state === 'won') {
				console.log('win');
				alert('WIN');
			}
			if (player.me && player.state === 'defeat') {
				console.log('defeat');
				alert('DEFEAT');
			}
		});
		console.log({ data });
	};

	useEffect(() => {
		if (!ref.current) return;
		const nb = ref.current.parentElement?.getBoundingClientRect();
		const b = ref.current.getBoundingClientRect();

		if (!nb) return;
		if (!b) return;

		const p = (nb.width - nb.width * 0.5) / 2;
		const ip = (nb.width * 0.8 - b.width * 3) / 3 + b.width - 20;
		const ipb = (nb.width * 0.8 - b.width * 2) / 2 + b.width - 30;
		const tp = (nb.height - nb.height * 0.6) / 2;

		const bc = b.width / 2;

		const position = {
			t: [
				{ top: -40, left: p - bc },
				{ top: -40, left: p + ip - bc },
				{ top: -40, left: p + ip * 2 - bc },
				{ top: -40, left: p + ip * 3 - bc },
			],
			b: [
				{ top: nb.height + 40, left: p - bc },
				{ top: nb.height + 40, left: p + ipb - bc },
				{ top: nb.height + 40, left: p + ipb * 2 - bc },
			],
			l: [
				{ top: tp, left: 0 },
				{ top: nb.height - tp, left: 0 },
			],
			r: [
				{ top: tp, left: nb.width + b.width + 40 },
				{ top: nb.height - tp, left: nb.width + b.width + 40 },
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

		// ref.current.style.left =
		// 	(index === 0 && positions[index].left - 10 + 'px') ||
		// 	positions[index].left + 'px';
		ref.current.style.left = positions[index].left + 'px';
		ref.current.style.top =
			(!reverse && positions[index].top + 'px') ||
			positions[index].top - 70 + 'px';
	});

	return (
		<div
			className={styles.player}
			ref={ref}
			style={{
				marginTop: (!reverse && '-10px') || '',
				marginLeft: (index === 0 && '-20px') || '0px',
				display: (index === 0 && 'flex') || '',
				opacity: player.state === 'defeat' ? 0.8 : 1,
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
						{player.last_move && (
							<div
								className={styles.viewState}
								style={{
									opacity: visible && player.id === id ? 1 : 0,
									marginBottom: '5px',
									marginTop:
										(reverse &&
											player.last_move &&
											player.state === 'move' &&
											'-2px') ||
										'0px',
								}}>
								{String(player.last_move) == 'raise'
									? 'Підвищити'
									: String(player.last_move) === 'support'
									? 'Підтримати'
									: String(player.last_move) === 'check'
									? 'Дивитися'
									: String(player.last_move) === 'support'
									? 'Впасти'
									: ''}
							</div>
						)}
					</>
				)}
				<div className={styles.avatarWrapper}>
					{check?.visible && check?.id === id && (
						<div
							style={{
								position: 'absolute',
								width: '160px',
								marginLeft: '-60px',
								marginTop: '-30px',
								zIndex: 1000,
							}}>
							<TreeCards cards={player.cards} />
						</div>
					)}

					<div
						className={classNames(
							styles.avatar,
							player.state === 'move' && styles.anim,
						)}
						style={{
							marginTop: (reverse && !player.last_move && '35px') || '8px',
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
						{player.last_move && (
							<div
								className={styles.viewState}
								style={{
									opacity: visible && player.id === id ? 1 : 0,
									marginTop: (!player.last_move && '0px') || '25px',
								}}>
								{String(player.last_move) == 'raise'
									? 'Підвищити'
									: String(player.last_move) === 'support'
									? 'Підтримати'
									: String(player.last_move) === 'check'
									? 'Дивитися'
									: String(player.last_move) === 'drop'
									? 'Впасти'
									: ''}
							</div>
						)}
						<div
							className={styles.info}
							style={{ marginTop: (!player.last_move && '30px') || '-5px' }}>
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
					{!isReady && (
						<TreeCards
							style={{ marginTop: '-10px' }}
							cards={['fb', 'fb', 'fb']}
						/>
					)}
					{isReady && (
						<TreeCards style={{ marginTop: '-10px' }} cards={cards} />
					)}
				</div>
			)}
		</div>
	);
};

export default Player;
