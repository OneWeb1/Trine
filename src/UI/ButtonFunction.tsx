import { FC } from 'react';

import classNames from 'classnames';

import { MdDoubleArrow } from 'react-icons/md';

import styles from './../stylesheet/styles-ui/Button.module.scss';

interface IButtonFunction {
	text: string;
	number: number;
	disabled: boolean;
	onClick: () => void;
}

const ButtonFunction: FC<IButtonFunction> = ({
	text,
	number,
	disabled,
	onClick,
}) => {
	const initHandler = () => {};
	return (
		<div
			className={classNames(styles.function, disabled && styles.hoverFunction)}
			onClick={(disabled && onClick) || initHandler}>
			<div className={styles.top}>
				<div className={styles.center}>
					<MdDoubleArrow className={styles.icon} />
					<span className={styles.text}>{text}</span>
				</div>
			</div>

			<div className={styles.bottom}>
				<div className={styles.number}>{number}</div>
			</div>
		</div>
	);
};

export default ButtonFunction;
