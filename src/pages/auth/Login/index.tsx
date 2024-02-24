import { FC, useState } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setIsAuth,
	setIsRememberMe,
	setIsSubmit,
} from '../../../store/slices/app.slice';
import AuthService from '../../../services/AuthService';

import { Navigate } from 'react-router-dom';
import CheckBoxLabel from '../../../UI/CheckBoxLabel';
import CustomLink from '../../../UI/CustomLink';
import ButtonIcon from '../../../UI/ButtonIcon';
import Button from '../../../UI/Button';
import Input from '../../../UI/Input';

import styles from './../../../stylesheet/styles/Auth.module.scss';
import Spinner from '../../../components/spinner';

// da

const Login: FC = () => {
	const dispatch = useDispatch();
	const { isSubmit } = useSelector((state: CustomRootState) => state.app);
	const [email, setEmail] = useState<string | number>('');
	const [password, setPassword] = useState<string | number>('');
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const login = async () => {
		const formData = new FormData();
		formData.append('email', String(email));
		formData.append('password', String(password));

		if (String(email).length > 5 && String(password).length > 3) {
			setIsLoading(false);
			try {
				const { data } = await AuthService.login(formData);
				dispatch(setIsSubmit(true));
				localStorage.setItem('token', data.access_token);
				localStorage.setItem('prolong_token', data.prolong_token);
				localStorage.setItem('password', String(password));
				localStorage.setItem('isRememberMe', String(isChecked));
				dispatch(setIsRememberMe(isChecked));
				dispatch(setIsAuth(true));
				return <Navigate to='/' />;
			} catch (e) {
				setIsLoading(true);
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
						<div className={styles.title}>Вхід</div>
						<Input
							type='text'
							label='Імейл'
							placeholder='mail@example.com'
							value={email}
							onChange={setEmail}
						/>
						<Input
							type='password'
							label='Пароль'
							placeholder='Введіть пароль'
							value={password}
							onChange={setPassword}
						/>

						{isError && (
							<div className={styles.error}>Неправильний імейл або пароль</div>
						)}
						<div className={styles.flex}>
							<CheckBoxLabel
								value='Запам’ятати мене'
								isChecked={isChecked}
								setIsChecked={setIsChecked}
							/>
							{/* <span className={styles.forgot}>Забули пароль?</span> */}
							<CustomLink value='Забули пароль?' to='/forgot_password' />
						</div>

						{/* <div className={styles.subtitle}>Вхід за допомогою:</div>
						<ButtonIcon value='Google' onClick={() => {}} /> */}

						<Button
							style={{ margin: '20px 0px 0px 0px' }}
							loading={isLoading}
							onClick={login}>
							Увійти
						</Button>
						<div className={styles.isAccount}>
							Ще немає аккаунту?{' '}
							<CustomLink value='Зареєструватися' to='/registration' />
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Login;
