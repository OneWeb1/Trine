import { FC, Dispatch, SetStateAction } from 'react';

import { ImCheckboxChecked } from 'react-icons/im';

import styles from './../stylesheet/styles-ui/CheckBoxLabel.module.scss';

interface ICheckBoxLabel {
	value: string;
	isChecked: boolean;
	setIsChecked: Dispatch<SetStateAction<boolean>>;
}

const CheckBoxLabel: FC<ICheckBoxLabel> = ({
	value,
	isChecked,
	setIsChecked,
}) => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.checkbox} onClick={() => setIsChecked(!isChecked)}>
				{isChecked && <ImCheckboxChecked className={styles.checked} />}
			</div>
			<span>{value}</span>
		</div>
	);
};

export default CheckBoxLabel;
