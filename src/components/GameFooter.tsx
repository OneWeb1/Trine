import { FC, useState, useEffect, ChangeEvent, useRef } from 'react';

// import { useDispatch } from 'react-redux';
// import { setGameAction } from '../store/slices/app.slice';

import { MdDoubleArrow } from 'react-icons/md';

import ButtonSpecial from '../UI/ButtonSpecial';
// import Button from '../UI/Button';

import styles from './../stylesheet/styles-components/GameFooter.module.scss';
import ButtonFunction from '../UI/ButtonFunction';
import AdminService from '../services/AdminService';

interface IGameFooter {
	isReady?: boolean;
	isEnable: boolean;
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
	joinTax,
	fullBid,
	maxBid,
	bid,
	loading,
}) => {
	// const dispatch = useDispatch();
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [percent, setPercent] = useState<number>(0);
	const [raiseSum, setRaiseSum] = useState<number>(Number(bid) * 2);

	const rangeRef = useRef<HTMLInputElement>(null);
	const multiplay = (sum: number, x: number) => sum * x;
	const supportHandler = async () => {
		await AdminService.do({ action: 'support' });
	};

	const raiseHandler = async () => {
		console.log({ raiseSum: raiseSum / 2 });
		await AdminService.do({ action: 'raise', sum: Math.round(raiseSum / 2) });
		// setRaiseSum(raiseSum * 2);
		// setPercent((raiseSum / maxBid) * 10000);
	};

	const dropHandler = async () => {
		await AdminService.do({ action: 'drop' });
	};

	const changePercent = (e: ChangeEvent<HTMLInputElement>) => {
		let value = Number(e.target.value);
		const max = maxBid - 1500;
		const min = ((bid * 2) / max) * 10000;
		value = (value < min && min) || value;
		const percent = value / 10000;
		let newRaiseSum = Number((max * percent).toFixed(0));
		newRaiseSum =
			(maxBid - fullBid < newRaiseSum && maxBid - fullBid) || newRaiseSum;

		setPercent(value);

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
					height: (windowWidth < 1100 && '65px') || '65px',
				}}>
				{!isReady && (
					<div
						className={styles.readyWrapper}
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<ButtonSpecial
							style={{
								width: '250px',
								paddingBottom: '8px',
								fontSize: '16px',
								marginLeft: '0px',
								background: 'linear-gradient(#2970fa, #0729a2)',
							}}
							disabled={true}
							title='Готовий'
							onClick={readyHandler}
						/>
					</div>
				)}
				<div
					className={styles.menu}
					style={{ opacity: (isEnable && 1) || 0.4 }}>
					{isReady && (
						<div className={styles.flexContainer}>
							<div
								style={{
									margin: '0 auto',
									maxWidth: '300px',
									textAlign: 'center',
								}}>
								<div
									style={{
										width: '100%',
										height: '100%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									{windowWidth >= 1100 && (
										<div>
											<input
												type='range'
												ref={rangeRef}
												disabled={!isEnable}
												className={styles.range}
												min={0}
												max={10000}
												value={percent}
												onChange={e => changePercent(e)}
											/>
										</div>
									)}
									<div
										style={{ maxWidth: '600px', width: '550px' }}
										className={
											(windowWidth < 1100 && styles.buttonFlex) ||
											styles.buttonRow
										}>
										<ButtonSpecial
											title='Підвищити'
											number={raiseSum}
											icon={
												<MdDoubleArrow
													style={{ transform: 'rotate(-90deg)' }}
												/>
											}
											disabled={isEnable}
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
											onClick={dropHandler}
										/>
									</div>
									{windowWidth >= 1100 && (
										<div style={{ marginLeft: '20px', display: 'flex' }}>
											<ButtonFunction
												text='x2'
												number={multiplay(joinTax, 2)}
												disabled={isEnable}
												onClick={() => {
													let sum = multiplay(joinTax, 2);
													if (sum < bid * 2) sum = bid * 2;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
											<ButtonFunction
												text='x5'
												number={multiplay(joinTax, 5)}
												disabled={isEnable}
												onClick={() => {
													let sum = multiplay(joinTax, 5);
													if (sum < bid * 2) sum = bid * 5;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
											<ButtonFunction
												text='x10'
												number={multiplay(joinTax, 10)}
												disabled={isEnable}
												onClick={() => {
													let sum = multiplay(joinTax, 10);
													if (sum < bid * 2) sum = bid * 10;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
											<ButtonFunction
												text='MAX'
												number={maxBid - fullBid}
												disabled={isEnable}
												onClick={() => {
													const sum = maxBid - fullBid;
													setRaiseSum(sum);
													setPercent((sum / maxBid) * 10000);
												}}
											/>
										</div>
									)}
								</div>
							</div>

							{windowWidth < 1100 && (
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										marginTop: '10px',
									}}>
									<div>
										<input
											type='range'
											ref={rangeRef}
											disabled={!isEnable}
											min={0}
											max={10000}
											value={percent}
											className={styles.range}
											onChange={e => changePercent(e)}
										/>
									</div>
									<div style={{ marginLeft: '20px', display: 'flex' }}>
										<ButtonFunction
											text='x2'
											number={multiplay(joinTax, 2)}
											disabled={isEnable}
											onClick={() => {
												let sum = multiplay(joinTax, 2);
												if (sum < bid * 2) sum = bid * 2;
												setRaiseSum(sum);
												setPercent((sum / maxBid) * 10000);
											}}
										/>
										<ButtonFunction
											text='x5'
											number={multiplay(joinTax, 5)}
											disabled={isEnable}
											onClick={() => {
												let sum = multiplay(joinTax, 5);
												if (sum < bid * 2) sum = bid * 2;
												setRaiseSum(sum);
												setPercent((sum / maxBid) * 10000);
											}}
										/>
										<ButtonFunction
											text='x10'
											number={multiplay(joinTax, 10)}
											disabled={isEnable}
											onClick={() => {
												let sum = multiplay(joinTax, 10);
												if (sum < bid * 2) sum = bid * 2;
												setRaiseSum(sum);
												setPercent((sum / maxBid) * 10000);
											}}
										/>
										<ButtonFunction
											text='MAX'
											number={maxBid - fullBid}
											disabled={isEnable}
											onClick={() => {
												const sum = maxBid - fullBid;
												setRaiseSum(sum);
												setPercent((sum / maxBid) * 10000);
											}}
										/>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default GameFooter;
