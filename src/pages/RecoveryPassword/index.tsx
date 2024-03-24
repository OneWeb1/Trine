import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import styles from './RecoveryPassword.module.scss';
import Spinner from '../../components/spinner';
import ModalRecoveryPassword from '../../components/modals/ModalRecoveryPassword';

const RecoveryPassword = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const queryParams = new URLSearchParams(window.location.search);
	const code = queryParams.get('code') || '';

	const recovery = async () => {
		await AuthService.verify(code)
			.then(response => {
				const { access_token, prolong_token } = response.data;
				localStorage.setItem('token', access_token);
				localStorage.setItem('prolong_token', prolong_token);
				setIsLoading(true);
			})
			.catch(error => {
				setIsError(true);
				setIsLoading(true);
				console.log(error);
			});
	};

	useEffect(() => {
		recovery();
	}, []);

	return (
		<div className={styles.verify}>
			{!isLoading && !isError && (
				<div className={styles.wrapper}>
					<div style={{ color: '#fff' }}>Скидання паролю</div>
					<Spinner style={{ marginTop: '35px' }} />
				</div>
			)}
			{isLoading && !isError && <ModalRecoveryPassword />}
			{isError && (
				<div className={styles.errorWrapper}>
					<div className={styles.error}>Не вдалося верифікувати аккаунт</div>
					<div className={styles.toHome} onClick={() => navigate('/')}>
						На головну
					</div>
				</div>
			)}
		</div>
	);
};

export default RecoveryPassword;
