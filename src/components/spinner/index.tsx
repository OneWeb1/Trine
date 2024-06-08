import { FC, CSSProperties } from 'react';
import './spinner.css';

interface ISpinner {
	style?: CSSProperties;
	black?: string;
}

const Spinner: FC<ISpinner> = ({ style, black }) => {
	const s = style || {};

	return (
		<div style={s} className='lds-spinner'>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
			<div className={black ? 'black' : 'white'}></div>
		</div>
	);
};

export default Spinner;
