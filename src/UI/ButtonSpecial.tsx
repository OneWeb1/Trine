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

	return (
		<div
			className={classNames(
				styles.special,
				disabled && styles.hoverSpecial,
				className,
			)}
			style={{ ...style, opacity: !disabled ? 0.5 : 1 }}
			onClick={(disabled && interceptorHandler) || initHandler}>
			{icon && <div className={styles.icon}>{icon}</div>}
			<div className={styles.rightWrapper}>
				<div className={styles.center}>
					<div
						className={styles.text}
						style={{
							paddingTop: numberVisible !== false ? '12px' : '2px',
						}}>
						{(isLoading && wait && (
							<div className={styles.flexSpinner}>
								<Spinner style={{ marginLeft: '0px', marginTop: '0px' }} />
							</div>
						)) ||
							title}
					</div>
					{number && numberVisible !== false && (
						<div className={styles.number}>
							{(wait === false && isLoading && (
								<div className={styles.flexSpinner}>
									<Spinner style={{ marginLeft: '0px', marginTop: '0px' }} />
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
