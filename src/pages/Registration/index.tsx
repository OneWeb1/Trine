import { FC, useState } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuth, setIsSubmit } from '../../store/slices/app.slice';
import AuthService from '../../services/AuthService';

import CheckBoxLabel from '../../UI/CheckBoxLabel';
import CustomLink from '../../UI/CustomLink';
import ButtonIcon from '../../UI/ButtonIcon';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import Spinner from '../../components/spinner';

import styles from './../../stylesheet/styles/Auth.module.scss';

const Registration: FC = () => {
	const dispatch = useDispatch();
	const { isSubmit } = useSelector((state: CustomRootState) => state.app);
	const [email, setEmail] = useState<string | number>('');
	const [password, setPassword] = useState<string | number>('');
	const [isChecked, setIsChecked] = useState<boolean>(false);

	const registerUser = async () => {
		const formData = new FormData();
		formData.append('email', String(email));
		formData.append('password', String(password));

		if (isChecked) {
			const { data } = await AuthService.registration(formData);

			if (data.access_token) dispatch(setIsSubmit(true));
			localStorage.setItem('token', data.access_token);
			localStorage.setItem('prolong_token', data.prolong_token);
			dispatch(setIsAuth(true));
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
						<div className={styles.flex}></div>
						<CheckBoxLabel
							value='Запам’ятати мене'
							isChecked={isChecked}
							setIsChecked={setIsChecked}
						/>

						<div className={styles.subtitle}>Реєстрація за допомогою:</div>
						<ButtonIcon value='Google' onClick={() => {}} />
						<Button value='Зареєструватися' onClick={registerUser} />

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
