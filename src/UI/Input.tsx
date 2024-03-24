import { FC, Dispatch, SetStateAction, ReactNode, useState } from 'react';

import { ImEyeBlocked } from 'react-icons/im';
import { ImEye } from 'react-icons/im';

import styles from './../stylesheet/styles-ui/Input.module.scss';

interface IInput {
	type: string;
	label?: string;
	placeholder: string;
	value?: number | string;
	readOnly?: boolean | null;
	children?: ReactNode;
	isDeleteFocus?: boolean;
	setIsError?: Dispatch<SetStateAction<boolean>>;
	onChange: Dispatch<SetStateAction<number | string>>;
}

const Input: FC<IInput> = ({
	type,
	label,
	placeholder,
	value,
	setIsError,
	readOnly,
	children,
	onChange,
}) => {
	const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

	return (
		<div className={styles.inputWrapper}>
			{label && <div className={styles.label}>{label}</div>}

			{children ? (
				<div className={styles.flexInput}>
					<input
						style={
							(readOnly && {
								outline: 'none',
								border: 'none',
								borderLeft: '3px solid #2a72ff',
								borderRadius: '0px',
								pointerEvents: 'none',
							}) || { pointerEvents: 'auto' }
						}
						type={(!readOnly && type) || 'text'}
						placeholder={placeholder}
						className={styles.input}
						value={(!readOnly && value) || 'Зміна пароля'}
						readOnly={
							(readOnly === null && true) || (readOnly && true) || false
						}
						onChange={e => {
							onChange(e.target.value);
							setIsError(false);
						}}
					/>
					{children}
				</div>
			) : (
				<>
					<input
						type={(visiblePassword && 'text') || type}
						readOnly={readOnly === null && true}
						placeholder={placeholder}
						className={styles.input}
						value={value}
						onChange={e => {
							onChange(e.target.value);
							setIsError(false);
						}}
					/>

					{type === 'password' && (
						<div
							style={{ top: (window.innerWidth < 450 && '52%') || '54%' }}
							className={styles.eye}
							onClick={() => setVisiblePassword(prev => !prev)}>
							{' '}
							{visiblePassword ? <ImEye /> : <ImEyeBlocked />}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Input;
