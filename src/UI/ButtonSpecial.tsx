import { CSSProperties, FC, ReactNode } from 'react';

import classNames from 'classnames';

import styles from './../stylesheet/styles-ui/Button.module.scss';

interface IButtonSpecial {
	title: string;
	number?: number;
	numberVisible?: boolean;
	disabled: boolean;
	style?: CSSProperties;
	iconCenter?: boolean;
	icon?: ReactNode;
	onClick?: () => void;
}

const ButtonSpecial: FC<IButtonSpecial> = ({
	title,
	number,
	disabled,
	icon,
	style,
	iconCenter,
	numberVisible,
	onClick,
}) => {
	const initHandler = () => {};

	const wm450 = window.innerWidth < 450;

	return (
		<div
			className={classNames(styles.special, disabled && styles.hoverSpecial)}
			style={style}
			onClick={(disabled && onClick) || initHandler}>
			{icon && (
				<div
					className={styles.icon}
					style={{ marginTop: (wm450 && iconCenter && '-8px') || '0px' }}>
					{icon}
				</div>
			)}
			<div
				className={styles.rightWrapper}
				style={{ display: (wm450 && iconCenter && 'none') || 'flex' }}>
				<div className={styles.center}>
					<div
						className={styles.text}
						style={{
							paddingTop: numberVisible !== false ? '12px' : '2px',
						}}>
						{title}
					</div>
					{number && numberVisible !== false && (
						<div className={styles.number}>{number}</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ButtonSpecial;
