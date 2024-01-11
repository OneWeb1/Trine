import { FC, useState, ReactNode, CSSProperties } from 'react';

import classNames from 'classnames';

import styles from './../stylesheet/styles-ui/Button.module.scss';
import Spinner from '../components/spinner';

interface IButtonSpecial {
	title: string;
	number?: number;
	numberVisible?: boolean;
	disabled: boolean;
	style?: CSSProperties;
	className?: string;
	wait?: boolean;
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
	className,
	wait,
	iconCenter,
	numberVisible,
	onClick,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const initHandler = () => {};
	const interceptorHandler = async () => {
		setIsLoading(true);
		if (onClick) {
			onClick();
		}
		if (wait === false) {
			setIsLoading(false);
		}
	};

	const wm450 = window.innerWidth < 450;

	return (
		<div
			className={classNames(
				styles.special,
				disabled && styles.hoverSpecial,
				className,
			)}
			style={{ ...style, opacity: !disabled ? 0.5 : 1 }}
			onClick={(disabled && interceptorHandler) || initHandler}>
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
						{(isLoading && wait && (
							<div style={{ marginTop: '-10px' }}>
								<Spinner />
							</div>
						)) ||
							title}
					</div>
					{number && numberVisible !== false && (
						<div className={styles.number}>
							{(wait === false && isLoading && (
								<div style={{ marginTop: '-10px' }}>
									<Spinner />
								</div>
							)) ||
								number}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ButtonSpecial;
