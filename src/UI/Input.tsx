import { FC, Dispatch, SetStateAction, ReactNode } from 'react';

import styles from './../stylesheet/styles-ui/Input.module.scss';

interface IInput {
	type: string;
	label: string;
	placeholder: string;
	value?: number | string;
	readOnly?: boolean | null;
	children?: ReactNode;
	isDeleteFocus?: boolean;
	onChange: Dispatch<SetStateAction<number | string>>;
}

const Input: FC<IInput> = ({
	type,
	label,
	placeholder,
	value,
	readOnly,
	children,
	onChange,
}) => {
	return (
		<div className={styles.inputWrapper}>
			<div className={styles.label}>{label}</div>

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
						onChange={e => onChange(e.target.value)}
					/>
					{children}
				</div>
			) : (
				<input
					type={type}
					readOnly={readOnly === null && true}
					placeholder={placeholder}
					className={styles.input}
					value={value}
					onChange={e => onChange(e.target.value)}
				/>
			)}
		</div>
	);
};

export default Input;
