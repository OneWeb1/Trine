import { FC, useState } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setAccount, setVisibleModal } from '../../store/slices/app.slice';

import Modal from './Modal';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

import styles from './../../stylesheet/styles-components/modals/Modal.module.scss';
import AdminService from '../../services/AdminService';

const ModalSettings: FC = () => {
	const dispatch = useDispatch();
	const { account, avatars } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [name, setName] = useState<string | number>(account.nickname);
	const [email, setEmail] = useState<string | number>(account.email);
	const [password, setPassword] = useState<string | number>(
		localStorage.getItem('password') || '********',
	);
	const [currentPassword, setCurrentPassword] = useState<string | number>('');
	const [newPassword, setNewPassword] = useState<string | number>('');

	const [isVisibleInput, setIsVisibleInput] = useState<boolean>(false);

	const changePassword = () => {
		setIsVisibleInput(!isVisibleInput);
		if (!isVisibleInput) {
			setCurrentPassword('');
			setNewPassword('');
		}
	};

	const saveChanges = async () => {
		const $password = String(password);
		const $currentPassword = String(currentPassword);
		const $newPassword = String(newPassword);
		if (name !== account.nickname) {
			await AdminService.changeNickname(String(name));
		}
		if ($password === $currentPassword && $newPassword.length > 3) {
			const formData = new FormData();
			formData.append('password', $newPassword);
			formData.append('prevPassword', $password);
			try {
				await AdminService.changePassword(formData);
				localStorage.setItem('password', $newPassword);
			} catch (e) {
				return;
			}
		} else if ($currentPassword.length || $newPassword.length) {
			throw new Error('Password is not empty');
		}

		const { data } = await AdminService.getMeProfile();
		if (data && Object.keys(data).length) {
			dispatch(setAccount(data));
		}
		dispatch(setVisibleModal('h'));
	};

	return (
		<Modal title='Налаштування' score={`#${account.id}`}>
			<div className={styles.subtitle}>Аватарки</div>
			{avatars.map(avatar => (
				<div>{avatar}</div>
			))}

			<div className={styles.subtitle}>Особисті дані</div>
			<Input
				type='text'
				placeholder="Введіть ім'я"
				label="Ім'я"
				value={name}
				onChange={setName}
			/>
			<Input
				type='text'
				readOnly={null}
				placeholder='Введіть імейл'
				label='Імейл'
				value={email}
				onChange={setEmail}
			/>
			<Input
				type='password'
				placeholder='Введіть пароль'
				label='Пароль'
				value={password}
				readOnly={isVisibleInput === false ? null : true}
				onChange={setPassword}>
				<Button
					style={{
						height: '40px',
						padding: '0px 34px',
						marginLeft: '10px',
					}}
					resize={true}
					value={(!isVisibleInput && 'Змінити') || 'Скасувати'}
					onClick={changePassword}
				/>
			</Input>

			{isVisibleInput && (
				<>
					<Input
						type='password'
						placeholder='Введіть поточний пароль'
						label='Поточний пароль'
						value={currentPassword}
						onChange={setCurrentPassword}
					/>

					<Input
						type='password'
						placeholder='Введіть новий пароль'
						label='Новий пароль'
						value={newPassword}
						onChange={setNewPassword}
					/>
				</>
			)}

			<Button
				style={{
					marginTop: '15px',
				}}
				value='Зберегти зміни'
				onClick={saveChanges}
			/>
		</Modal>
	);
};

export default ModalSettings;
