import { FC, ReactNode } from 'react';

import classNames from 'classnames';

import googleIcon from './../../public/assets/icon-google.png';

import styles from './../stylesheet/styles-ui/Button.module.scss';

interface IButton {
	value: string;
	icon?: ReactNode;
	onClick: () => void;
}

const Button: FC<IButton> = ({ value, onClick }) => {
	return (
		<div
			className={classNames(styles.button, styles.buttonIcon)}
			onClick={() => onClick()}>
			<div className={styles.flex}>
				<img src={googleIcon} alt='google' />
				<span>{value}</span>
			</div>
		</div>
	);
};

export default Button;
