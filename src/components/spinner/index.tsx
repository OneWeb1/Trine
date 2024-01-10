import { FC, CSSProperties } from 'react';
import './spinner.css';

interface ISpinner {
	style?: CSSProperties;
}

const Spinner: FC<ISpinner> = ({ style }) => {
	const s = style || {};

	return (
		<div style={s} className='lds-spinner'>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};

export default Spinner;
