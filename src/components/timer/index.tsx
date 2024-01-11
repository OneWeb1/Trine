import { FC, useEffect, useState } from 'react';

import './timer.css';
// import styles from './timer.module.scss';

const CircleTimer: FC = () => {
	const [time, setTime] = useState<number>(10);

	useEffect(() => {
		const timer = setInterval(function () {
			setTime(prev => (prev <= 0 ? 10 : prev - 1));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className='circleProgress_wrapper'>
			<div className='wrapper right'>
				<div className='circleProgress rightcircle right_cartoon'></div>
			</div>
			<div className='wrapper left'>
				<div className='circleProgress leftcircle left_cartoon'></div>
			</div>
			<span id='timer'>{time}</span>
		</div>
	);
};

export default CircleTimer;
