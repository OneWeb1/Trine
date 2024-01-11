import { FC, useState, useRef, CSSProperties, ReactNode } from 'react';

import classNames from 'classnames';

import styles from './../stylesheet/styles-ui/Button.module.scss';
import Spinner from '../components/spinner';

interface IButton {
	style?: CSSProperties;
	value?: string;
	background?: string;
	className?: string;
	resize?: boolean;
	children?: ReactNode;
	onClick: () => void;
}

const Button: FC<IButton> = ({
	style,
	value,
	background,
	className,
	resize,
	children,
	onClick,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const timeRef = useRef<number>(new Date().getTime());
	const isResize = resize || false;
	const styleProps = style || {};
	const buttonStyles = { ...styleProps, background: background };

	const handler = () => {
		const date = new Date().getTime();
		if (date - timeRef.current > 100) {
			console.log('click');
			setIsLoading(true);
			onClick();
			timeRef.current = date;
		}
	};

	return (
		<div
			className={classNames(
				!style || isResize === false ? styles.button : styles.cutButton,
				className,
			)}
			style={buttonStyles}
			onClick={() => handler()}>
			{(isLoading && <Spinner />) || value || children}
		</div>
	);
};

export default Button;
