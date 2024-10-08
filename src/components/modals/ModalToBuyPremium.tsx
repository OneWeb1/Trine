import { useState, useRef } from 'react';
import Modal from './Modal';
import Button from '../../UI/Button';
import AdminService from '../../services/AdminService';
import { useDispatch } from 'react-redux';
import { setVisibleModal } from '../../store/slices/app.slice';
import styles from './../../stylesheet/styles-components/modals/ModalToBuyPremium.module.scss';

const ModalToBuyPremium = () => {
	const dispatch = useDispatch();
	const [isErrorBuyPremium, setIsErrorBuyPremium] = useState<boolean>(false);
	const timerErrorRef = useRef<number>(0);

	const handleBuyPremium = async () => {
		try {
			const response = await AdminService.buyPremium();
			if (response.status !== 200) {
				throw new Error(`Status code ${response.status}`);
				return;
			}
			dispatch(setVisibleModal('h'));
		} catch (e) {
			setIsErrorBuyPremium(true);
			clearTimeout(timerErrorRef.current);
			timerErrorRef.current = setTimeout(() => {
				setIsErrorBuyPremium(false);
			}, 3000);
			console.log(e);
		}
	};

	return (
		<Modal title='Преміум підписка'>
			<p>
				Дай собі можливість віділитися серед других гравців. Більше можливостей
				з преміум підпискою
			</p>
			<div className={styles.selectWrapper}>
				<div className={styles.leftWrapper}>
					<div className={styles.checkMark}>
						<img src='assets/check-mark.png' alt='check-mark' />
					</div>
					<span style={{ fontWeight: '600', fontSize: '15px' }}>Назавжди</span>
				</div>
				<span>200 ₴</span>
			</div>
			<p style={{ fontWeight: '500', marginTop: '15px' }}>ПЕРЕВАГИ ПІДПИСКИ</p>
			<div className={styles.advantageItem}>
				<div className={styles.icon}>
					<img src='assets/avatar-icon.png' alt='avatar-icon' />
				</div>
				<div className={styles.rightWrapper}>
					<div className={styles.title}>Аватарки</div>
					<div className={styles.description}>
						Можливість завантаження власної аватарки з галереї
					</div>
				</div>
			</div>
			{isErrorBuyPremium && (
				<div style={{ color: 'red', fontWeight: 600, marginBottom: '10px' }}>
					На вашому рахунку недостатньо коштів
				</div>
			)}

			<Button
				loading={true}
				style={{
					background:
						'linear-gradient(45deg, rgb(255, 0, 191), rgb(149, 0, 255))',
				}}
				onClick={handleBuyPremium}>
				Підключіть за 200 ₴ назавжди
			</Button>
		</Modal>
	);
};

export default ModalToBuyPremium;
