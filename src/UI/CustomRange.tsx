import { FC, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import './../stylesheet/styles-ui/CustomRange.css';

interface CustomRangeProps {
	bet: number;
	setBet: Dispatch<SetStateAction<number>>;
}

const CustomRange: FC<CustomRangeProps> = ({ setBet }) => {
	const range = useRef<HTMLInputElement | null>(null);
	const tooltip = useRef<HTMLDivElement | null>(null);
	const setValue = () => {
		if (!range.current) return;
		if (!tooltip.current) return;

		const newValue = Number(
				((Number(range.current.value) - Number(range.current.min)) * 100) /
					(Number(range.current.max) - Number(range.current.min)),
			),
			newPosition = 16 - newValue * 0.32;

		setBet(Number(range.current.value));
		tooltip.current.innerHTML = `<span>${range.current.value}₴</span>`;
		tooltip.current.style.left = `calc(${newValue}% + (${newPosition}px))`;
		document.documentElement.style.setProperty(
			'--range-progress',
			`calc(${newValue}% + (${newPosition}px))`,
		);
	};

	useEffect(() => {
		setValue();
		document.addEventListener('DOMContentLoaded', setValue);
		range?.current?.addEventListener('input', setValue);
	}, []);

	return (
		<div className='range-slider'>
			<div ref={tooltip} id='tooltip'></div>
			<input ref={range} id='range' type='range' step='10' min='20' max='200' />
		</div>
	);
};

export default CustomRange;
