import { FC, useState } from 'react';
import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setTransfersData } from '../../../store/slices/app.slice';
import Input from '../../../UI/Input';
import Button from '../../../UI/Button';

import styles from './../styles/Transfers.module.scss';

const Transfers: FC = () => {
	const dispatch = useDispatch();
	const { transfersData } = useSelector((state: CustomRootState) => state.app);

	const [label, setLabel] = useState<number | string>(transfersData.label);
	const [name, setName] = useState<number | string>(transfersData.name);
	const [link, setLink] = useState<number | string>(transfersData.link);

	const saveChanged = () => {
		dispatch(
			setTransfersData({
				label,
				name,
				link,
			}),
		);
	};

	return (
		<div className={styles.roomsWrapper}>
			<div className={styles.header}>
				<div
					className={styles.title}
					style={{ fontSize: window.innerWidth < 600 ? '14px' : '18px' }}>
					Перекази
				</div>
			</div>
			<div className={styles.view}>
				<div className={styles.row}>
					<div className={styles.input}>
						<Input
							type='text'
							label='Назва ресурсу'
							placeholder='Введіть назву ресурсу'
							value={label}
							onChange={setLabel}
						/>
					</div>
					<div className={styles.input}>
						<Input
							type='text'
							label="Ім'я користувача"
							placeholder="Введіть Ім'я користувача"
							value={name}
							onChange={setName}
						/>
					</div>
				</div>
				<Input
					type='text'
					label='Посилання на ресурс'
					placeholder='Введіть посилання на ресурс'
					value={link}
					onChange={setLink}
				/>

				<Button
					style={{ width: 'fit-content', padding: '0px 20px', marginTop: 10 }}
					value='Зберегти зміни'
					noLoading={true}
					onClick={saveChanged}></Button>
			</div>
		</div>
	);
};

export default Transfers;
