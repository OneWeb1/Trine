import { useState } from 'react';
import Button from '../../UI/Button';
import Modal from './Modal';
import Input from '../../UI/Input';
import AdminService from '../../services/AdminService';

const ModalRecoveryPassword = () => {
	const [password, setPassword] = useState<string | number>('');
	const [isError, setIsError] = useState<boolean>(false);
	const [isClose, setIsClose] = useState<boolean>(false);

	const changePassword = async () => {
		const formData = new FormData();
		formData.append('password', String(password));
		await AdminService.changePassword(formData)
			.then(() => {
				setIsClose(true);
				window.location.href = '/';
			})
			.catch(error => {
				setIsError(true);
				console.log(error);
			});
	};

	return (
		<Modal
			style={{ maxWidth: '450px' }}
			title='Зміна паролю'
			isHide={false}
			close={isClose}>
			<Input
				type='password'
				label='Новий пароль'
				placeholder='Введіть новий пароль'
				setIsError={setIsError}
				onChange={setPassword}
			/>
			{isError && (
				<div style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
					Пароль закороткий
				</div>
			)}
			<div style={{ marginBottom: 10 }}></div>
			<Button
				value='Змінити пароль'
				noLoading={true}
				onClick={changePassword}
			/>
		</Modal>
	);
};

export default ModalRecoveryPassword;
