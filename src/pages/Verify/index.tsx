import { useState, useEffect } from 'react';
import ModalVerify from '../../components/modals/ModalVerify';
import AuthService from '../../services/AuthService';
import styles from './Verify.module.scss';
import Spinner from '../../components/spinner';

const Verify = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const queryParams = new URLSearchParams(window.location.search);
	const code = queryParams.get('code') || '';

	const verify = async () => {
		await AuthService.verify(code)
			.then(() => {
				setIsLoading(true);
			})
			.catch(error => {
				console.log(error);
				alert('Не вдалося пройти верифікацію. Спробуйте пізніше!');
			});
	};

	useEffect(() => {
		verify();
	}, []);

	return (
		<div className={styles.verify}>
			{!isLoading && (
				<div className={styles.wrapper}>
					<div style={{ color: '#fff' }}>Підтвердження пошти</div>
					<Spinner style={{ marginTop: '35px' }} />
				</div>
			)}
			{isLoading && <ModalVerify />}
		</div>
	);
};

export default Verify;
