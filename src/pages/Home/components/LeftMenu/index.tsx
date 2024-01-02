import { FC } from 'react';

import { useDispatch } from 'react-redux';
import { setVisibleModal } from '../../../../store/slices/app.slice';

import Button from '../../../../UI/Button';

// import previewImage from './../../../../../public/assets/desc-image.svg';

import styles from './LeftMenu.module.scss';

const LeftMenu: FC = () => {
	const dispatch = useDispatch();
	const createPrivateRoom = () => {
		dispatch(setVisibleModal('cpr'));
	};

	const onRoomsHandler = () => {
		dispatch(setVisibleModal('mr'));
	};

	return (
		<div className={styles.leftMenu}>
			<div className={styles.title}>Створення кімнат</div>

			<Button value='Створити приватну кімнату' onClick={createPrivateRoom} />
			<div className={styles.hr}></div>

			<Button
				style={{
					marginBottom: '30px',
				}}
				value='Мої кімнати'
				background='linear-gradient(180deg, #2C3756 0%, #1F2841 100%)'
				resize={false}
				onClick={onRoomsHandler}
			/>

			{/* <div className={styles.description}>
				<div className={styles.image}>
					<img src={previewImage} alt='Cards' />
				</div>

				<div className={styles.content}>
					<div className={styles.title}>Карткова гра Тринька</div>
					<div className={styles.subtitle}>
						Тринька (сека) - картярська гра, що найчастіше застосовується
						шулерами. Головне її гідність - у простоті, що дозволяє картежникам
						за лічені хвилини навчити підібрану їм жертву правилам гри
					</div>
				</div>
			</div> */}
		</div>
	);
};

export default LeftMenu;
