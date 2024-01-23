import { CSSProperties, FC, useEffect } from 'react';

import './timer.css';
// import styles from './timer.module.scss';

interface CircleTimer {
	style?: CSSProperties;
	startTime: number;
	currentTime: number;
}

const CircleTimer: FC<CircleTimer> = ({ style, startTime, currentTime }) => {
	const d = 600;

	const offset = (d / startTime) * (startTime - (currentTime | 0));
	useEffect(() => {
		const timer = setInterval(function () {}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div style={style} className='timer'>
			<svg width='200' height='200' className='svg_timer'>
				<circle
					style={{ strokeDashoffset: offset }}
					className='c1'
					cx='100'
					cy='100'
					r='100'></circle>
			</svg>
		</div>
	);
};

export default CircleTimer;
