import { FC, useState } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuth, setIsSubmit } from '../../../store/slices/app.slice';
// import AuthService from '../../../services/AuthService';

// import { Navigate } from 'react-router-dom';
import Button from '../../../UI/Button';
import Input from '../../../UI/Input';

import styles from './../../../stylesheet/styles/Auth.module.scss';
import Spinner from '../../../components/spinner';
import AdminService from '../../../services/AdminService';
import AuthService from '../../../services/AuthService';

// da

const ForgotPassword: FC = () => {
	const dispatch = useDispatch();
	const { isSubmit } = useSelector((state: CustomRootState) => state.app);
	const [email, setEmail] = useState<string | number>('');
	const [isError, setIsError] = useState<boolean>(false);
	const [isLoading] = useState<boolean>(true);

	const recoveryPassword = async () => {
		const formData = new FormData();
		formData.append('email', String(email));

		if (String(email).length > 5) {
			// setIsLoading(false);
			try {
				const { data } = await AuthService.recoveryPassword(formData);
				console.log(data);
				// return <Navigate to='/' />;
			} catch (e) {
				// setIsLoading(true);
				setIsError(true);
			}
		} else setIsError(true);
		setTimeout(() => {
			setIsError(false);
		}, 2000);
	};

	return (
		<>
			{isSubmit && (
				<div className={styles.spinner}>
					<Spinner />
				</div>
			)}
			{!isSubmit && (
				<div className={styles.page}>
					<div className={styles.loginWrapper}>
						<div className={styles.title}>Відновлення</div>
						<Input
							type='text'
							label='Імейл'
							placeholder='mail@example.com'
							value={email}
							onChange={setEmail}
						/>

						{isError && <div className={styles.error}>Неправильний імейл</div>}

						<Button
							style={{ marginTop: '10px' }}
							loading={isLoading}
							onClick={recoveryPassword}>
							Відновити пароль
							{/* {!isLoading && (
								<div
									style={{
										position: 'absolute',
										marginLeft: '70px',
										marginTop: '-6px',
									}}>
									<Spinner style={{ transform: 'scale(.25)' }} />
								</div>
							)} */}
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default ForgotPassword;
