import { CSSProperties, Dispatch, FC, SetStateAction } from 'react';

import { CgSearch } from 'react-icons/cg';

import styles from './../stylesheet/styles-ui/InputSearch.module.scss';

interface IInputSearch {
	placeholder: string;
	value: string;
	style?: CSSProperties;
	onChange: Dispatch<SetStateAction<string>>;
}

const InputSearch: FC<IInputSearch> = ({
	placeholder,
	value,
	style,
	onChange,
}) => {
	return (
		<div style={{ marginLeft: '10px', ...style }} className={styles.wrapper}>
			<div className={styles.icon}>
				<CgSearch />
			</div>{' '}
			<input
				className={styles.input}
				type='text'
				value={value}
				placeholder={placeholder}
				onChange={e => onChange(e.target.value)}
			/>
		</div>
	);
};

export default InputSearch;
