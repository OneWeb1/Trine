import { FC, useState, useRef } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuth, setIsSubmit } from '../../../store/slices/app.slice';
import AuthService from '../../../services/AuthService';

import CheckBoxLabel from '../../../UI/CheckBoxLabel';
import CustomLink from '../../../UI/CustomLink';
import ButtonIcon from '../../../UI/ButtonIcon';
import Button from '../../../UI/Button';
import Input from '../../../UI/Input';
import Spinner from '../../../components/spinner';

import styles from './../../../stylesheet/styles/Auth.module.scss';

const Registration: FC = () => {
	const dispatch = useDispatch();
	const { isSubmit } = useSelector((state: CustomRootState) => state.app);
	const [email, setEmail] = useState<string | number>('');
	const [password, setPassword] = useState<string | number>('');
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const timeoutRef = useRef<number>(0);

	const registerUser = async () => {
		const formData = new FormData();
		formData.append('email', String(email));
		formData.append('password', String(password));
		setIsLoading(false);

		try {
			const { data } = await AuthService.registration(formData);
			dispatch(setIsSubmit(true));
			localStorage.setItem('token', data.access_token);
			localStorage.setItem('prolong_token', data.prolong_token);
			localStorage.setItem('password', String(password));
			dispatch(setIsAuth(true));
		} catch (e) {
			setIsLoading(true);
			setIsError(true);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				setIsError(false);
			}, 2000);
		}
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
						<div className={styles.title}>Реєстрація</div>
						<Input
							type='text'
							label='Імейл'
							placeholder='mail@example.com'
							onChange={setEmail}
						/>
						<Input
							type='password'
							label='Пароль'
							placeholder='Введіть пароль'
							onChange={setPassword}
						/>
						{isError && (
							<div className={styles.error}>Неправильний імейл або пароль</div>
						)}
						<div style={{ marginTop: '10px' }}>
							<CheckBoxLabel
								value='Запам’ятати мене'
								isChecked={isChecked}
								setIsChecked={setIsChecked}
							/>
						</div>

						<div className={styles.subtitle}>Реєстрація за допомогою:</div>
						<ButtonIcon value='Google' onClick={() => {}} />
						<Button loading={isLoading} onClick={registerUser}>
							Зареєструватися
							{/* {!isLoading && (
								<div
									style={{
										position: 'absolute',
										marginLeft: '145px',
										marginTop: '-6px',
									}}>
									<Spinner style={{ transform: 'scale(.25)' }} />
								</div>
							)} */}
						</Button>

						<div className={styles.isAccount}>
							Чи вже є аккаунт? <CustomLink value='Увійти' to='/login' />
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Registration;
