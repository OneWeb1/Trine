import { FC } from 'react';

import classNames from 'classnames';

import { MdDoubleArrow } from 'react-icons/md';

import styles from './../stylesheet/styles-ui/Button.module.scss';

interface IButtonFunction {
	text: string;
	number: number;
	disabled: boolean;
	className?: string;
	onClick: () => void;
}

const ButtonFunction: FC<IButtonFunction> = ({
	text,
	number,
	disabled,
	className,
	onClick,
}) => {
	const initHandler = () => {};
	return (
		<div
			style={{ opacity: !disabled ? 0.5 : 1 }}
			className={classNames(
				styles.function,
				disabled && styles.hoverFunction,
				className,
			)}
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
