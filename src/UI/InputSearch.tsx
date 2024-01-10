import { Dispatch, FC, SetStateAction } from 'react';

import { CgSearch } from 'react-icons/cg';

import styles from './../stylesheet/styles-ui/InputSearch.module.scss';

interface IInputSearch {
	placeholder: string;
	value: string;
	onChange: Dispatch<SetStateAction<string>>;
}

const InputSearch: FC<IInputSearch> = ({ placeholder, value, onChange }) => {
	return (
		<div className={styles.wrapper}>
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
