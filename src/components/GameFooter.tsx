import { FC, useState, useEffect, ChangeEvent, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { setIsEnable } from '../store/slices/app.slice';

import { MdDoubleArrow } from 'react-icons/md';

import ButtonSpecial from '../UI/ButtonSpecial';
// import Button from '../UI/Button';

import styles from './../stylesheet/styles-components/GameFooter.module.scss';
import ButtonFunction from '../UI/ButtonFunction';
import AdminService from '../services/AdminService';
import { IPlayerRoom } from '../models/response/AdminResponse';

interface IGameFooter {
	isReady?: boolean;
	isEnable: boolean;
	mePlayer: IPlayerRoom;
	joinTax: number;
	bid: number;
	fullBid: number;
	maxBid: number;
	loading: boolean;
	readyHandler: () => void;
}

const GameFooter: FC<IGameFooter> = ({
	readyHandler,
	isReady,
	isEnable,
	mePlayer,
	joinTax,
	fullBid,
	maxBid,
	bid,
	loading,
}) => {
	const dispatch = useDispatch();
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [percent, setPercent] = useState<number>(0);
	const [raiseSum, setRaiseSum] = useState<number>(Number(bid) * 2);

	const rangeRef = useRef<HTMLInputElement>(null);
	const multiplay = (sum: number, x: number) => sum * x;

	const supportHandler = async () => {
		dispatch(setIsEnable(false));
		await AdminService.do({ action: 'support' });
	};
	const raiseHandler = async () => {
		dispatch(setIsEnable(false));
		try {
			await AdminService.do({
				action: 'raise',
				sum: Math.round(raiseSum),
			});
			setRaiseSum(raiseSum * 2);
			setPercent((raiseSum / maxBid) * 10000);
		} catch (e) {
			console.log(e);
		}
	};

	const dropHandler = async () => {
		dispatch(setIsEnable(false));

		try {
			await AdminService.do({ action: 'drop' });
		} catch (e) {
			console.log(e);
		}
	};

	const changePercent = (e: ChangeEvent<HTMLInputElement>) => {
		let value = Number(e.target.value);
		const max = maxBid - fullBid;
		const min = ((bid * 2) / max) * 10000;
		value = (value < min && min) || value;
		const percent = value / 10000;
		let newRaiseSum = Number((max * percent).toFixed(0));
		newRaiseSum = newRaiseSum < 0 || bid === maxBid ? 0 : newRaiseSum;

		newRaiseSum =
			(maxBid - bid > 0 && maxBid - bid < newRaiseSum && maxBid - bid) ||
			newRaiseSum;
		if (!newRaiseSum || fullBid > maxBid) setPercent(0);
		else setPercent(value);

		setRaiseSum(newRaiseSum);
	};

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		if (rangeRef.current) {
			changePercent({
				target: { value: rangeRef.current.value },
			} as ChangeEvent<HTMLInputElement>);
		}
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [loading]);

	useEffect(() => {
		if (bid === joinTax) {
			setPercent((bid / maxBid) * 10000);
			setRaiseSum(bid * 2);
		}
		if (rangeRef.current)
			changePercent({
				target: { value: rangeRef.current.value },
			} as ChangeEvent<HTMLInputElement>);
	});

	return (
		<>
			<div
				className={styles.footer}
				style={{
					height: (windowWidth < 800 && '35px') || '65px',
					bottom: isEnable || !isReady ? '15px' : '-100px',
					transition: '.5s',
					transitionDelay: '.05s',
					// opacity: isEnable || !isReady ? 1 : 0,
				}}>
				{!isReady && (
					<div className={styles.readyWrapper}>
						<ButtonSpecial
							style={{ minWidth: '200px' }}
							className={styles.buttonReady}
							disabled={true}
							wait={true}
							title={mePlayer.state === 'out' ? 'Вступити до свари' : 'Готовий'}
							onClick={async () => {
								readyHandler();
							}}
						/>
					</div>
				)}
				<div
					className={styles.menu}
					style={{
						opacity: (isEnable && 1) || 0.4,
						display: (!isReady && 'none') || 'block',
					}}>
					{isReady && (
						<div className={styles.flexContainer}>
							<div
								style={{
									margin: '0 auto',
									maxWidth: window.innerWidth > 340 ? '300px' : '240px',
									display: 'flex',
									flexDirection: 'column',
									// padding: window.innerWidth < 340 ? '0px' : '0px 15px',
									textAlign: 'center',
								}}>
								<div className={styles.gameButtonsWrapper}>
									{windowWidth > 700 && (
										<div>
											<input
												style={{ opacity: percent === 0 ? 0.5 : 1 }}
												type='range'
												ref={rangeRef}
												disabled={percent === 0 ? false : !isEnable}
												className={styles.range}
												min={0}
												max={10000}
												value={percent}
												onChange={e => changePercent(e)}
											/>
										</div>
									)}
									<div
										style={{
											maxWidth: '600px',
											width: '550px',
											marginTop: windowWidth < 700 ? '-20px' : '0px',
										}}
										className={
											(windowWidth < 1100 && styles.buttonFlex) ||
											styles.buttonRow
										}>
										<ButtonSpecial
											title='Підвищити'
											number={isNaN(raiseSum) ? 0 : raiseSum}
											icon={
												<MdDoubleArrow
													style={{ transform: 'rotate(-90deg)' }}
												/>
											}
											disabled={raiseSum === 0 ? raiseSum !== 0 : isEnable}
											wait={false}
											onClick={raiseHandler}
										/>
										<ButtonSpecial
											style={{
												background: `linear-gradient(#0556D5, #216BF4)`,
												margin: '0px 10px',
											}}
											title='Підтримати'
											number={bid}
											disabled={isEnable}
											wait={false}
											onClick={supportHandler}
										/>
										<ButtonSpecial
											title='Впасти'
											numberVisible={false}
											icon={
												<MdDoubleArrow style={{ transform: 'rotate(90deg)' }} />
											}
											iconCenter={true}
											disabled={isEnable}
											wait={mePlayer.state === 'move'}
											onClick={dropHandler}
										/>
									</div>
									{windowWidth > 700 && (
										<div
											style={{
												marginLeft: windowWidth < 1150 ? '7px' : '20px',
												display: 'flex',
											}}>
											<ButtonFunction
												className={styles.x2}
												text='x2'
												number={multiplay(bid, 2)}
												disabled={
													maxBid - bid < multiplay(bid, 2)
														? maxBid - bid > multiplay(bid, 2)
														: isEnable
												}
												onClick={() => {
													let sum = multiplay(bid, 2);
													if (sum < bid * 2) sum = bid * 2;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
											<ButtonFunction
												text='x5'
												number={multiplay(bid, 5)}
												disabled={
													maxBid - bid < multiplay(bid, 5)
														? maxBid - bid > multiplay(bid, 5)
														: isEnable
												}
												onClick={() => {
													let sum = multiplay(bid, 5);
													if (sum < bid * 2) sum = bid * 5;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
											<ButtonFunction
												text='x10'
												number={multiplay(bid, 10)}
												disabled={
													maxBid - bid < multiplay(bid, 10)
														? maxBid - bid > multiplay(bid, 10)
														: isEnable
												}
												onClick={() => {
													let sum = multiplay(joinTax, 10);
													if (sum < bid * 2) sum = bid * 10;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
											<ButtonFunction
												text='MAX'
												number={maxBid - bid}
												disabled={
													maxBid - bid === 0 ? maxBid - bid !== 0 : isEnable
												}
												onClick={() => {
													const sum = maxBid - bid;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
										</div>
									)}
								</div>
								{windowWidth <= 700 && (
									<div
										style={{ paddingLeft: '4px', marginTop: '4px' }}
										className={styles.gameButtonsWrapper}>
										<div>
											<input
												style={{ opacity: percent === 0 ? 0.5 : 1 }}
												type='range'
												ref={rangeRef}
												disabled={percent === 0 ? false : !isEnable}
												className={styles.range}
												min={0}
												max={10000}
												value={percent}
												onChange={e => changePercent(e)}
											/>
										</div>

										<div
											style={{
												marginLeft: windowWidth < 1150 ? '7px' : '20px',
												display: 'flex',
											}}>
											<ButtonFunction
												className={styles.x2}
												text='x2'
												number={multiplay(bid, 2)}
												disabled={
													maxBid - bid < multiplay(bid, 2)
														? maxBid - bid > multiplay(bid, 2)
														: isEnable
												}
												onClick={() => {
													let sum = multiplay(bid, 2);
													if (sum < bid * 2) sum = bid * 2;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
											<ButtonFunction
												text='x5'
												number={multiplay(bid, 5)}
												disabled={
													maxBid - bid < multiplay(bid, 5)
														? maxBid - bid > multiplay(bid, 5)
														: isEnable
												}
												onClick={() => {
													let sum = multiplay(bid, 5);
													if (sum < bid * 2) sum = bid * 5;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
											<ButtonFunction
												text='x10'
												number={multiplay(bid, 10)}
												disabled={
													maxBid - bid < multiplay(bid, 10)
														? maxBid - bid > multiplay(bid, 10)
														: isEnable
												}
												onClick={() => {
													let sum = multiplay(joinTax, 10);
													if (sum < bid * 2) sum = bid * 10;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
											<ButtonFunction
												text='MAX'
												number={maxBid - bid}
												disabled={
													maxBid - bid === 0 ? maxBid - bid !== 0 : isEnable
												}
												onClick={() => {
													const sum = maxBid - bid;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default GameFooter;
