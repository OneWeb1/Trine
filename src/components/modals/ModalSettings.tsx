import { FC, memo, useState, useRef, useEffect } from 'react';

import classNames from 'classnames';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
	setAccount,
	setAvatars,
	setVisibleModal,
} from '../../store/slices/app.slice';

import Modal from './Modal';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

import styles from './../../stylesheet/styles-components/modals/Modal.module.scss';
import AdminService from '../../services/AdminService';

const ModalSettings: FC = () => {
	const dispatch = useDispatch();
	const { account, avatars, baseIconPath } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [name, setName] = useState<string | number>(account.nickname);
	const [email, setEmail] = useState<string | number>(account.email);
	const [password, setPassword] = useState<string | number>(
		localStorage.getItem('password') || '********',
	);
	const [currentPassword, setCurrentPassword] = useState<string | number>(
		localStorage.getItem('password') || '',
	);
	const [newPassword, setNewPassword] = useState<string | number>('');

	const [isVisibleInput, setIsVisibleInput] = useState<boolean>(false);

	const [selectAvatarId, setSelectAvatarId] = useState<string>(
		account.avatar_id,
	);
	const inputFileRef = useRef<HTMLInputElement | null>(null);

	const getAvatars = async () => {
		try {
			const { data: avatars } = await AdminService.getAvatars();
			dispatch(setAvatars(avatars));
		} catch (e) {
			console.log(e);
		}
	};

	const uploadAvatar = async (formData: FormData) => {
		try {
			await AdminService.uploadAvatar(formData);
		} catch (e) {
			console.log(e);
		}
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const formData = new FormData();
			formData.append('image', file);
			uploadAvatar(formData);
		}
	};

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
		if (account.avatar_id !== selectAvatarId) {
			await AdminService.changeAvatar(selectAvatarId);
		}
		if (name !== account.nickname) {
			await AdminService.changeNickname(String(name));
		}
		if ($password === $currentPassword && $newPassword.length > 3) {
			const formData = new FormData();
			formData.append('prevPassword', $password);
			formData.append('password', $newPassword);
			try {
				await AdminService.changePassword(formData);
				localStorage.setItem('password', $newPassword);
			} catch (e) {
				return;
			}
		} else if (!$currentPassword.length || !$newPassword.length) {
			// alert('Password is not empty');
			dispatch(setVisibleModal('h'));
			throw new Error('Password is not empty');
		}

		const { data } = await AdminService.getMeProfile();
		if (data && Object.keys(data).length) {
			dispatch(setAccount(data));
		}
		dispatch(setVisibleModal('h'));
	};

	const selectAvatar = (id: string) => {
		setSelectAvatarId(id);
	};

	const handleSelectAvatarToGallery = () => {
		if (!account.is_premium) {
			dispatch(setVisibleModal('pm'));
			return;
		}
		inputFileRef.current?.click();
	};

	if (!avatars.includes(account.avatar_id)) {
		dispatch(setAvatars([...avatars, account.avatar_id]));
	} else {
		const key = account.avatar_id.includes('premium');
		if (!key) {
			const premiumAvatar = avatars.find(avatar => avatar.includes('premium'));
			if (premiumAvatar) {
				dispatch(
					setAvatars([...avatars.filter(avatar => avatar !== premiumAvatar)]),
				);
			}
		}
	}

	useEffect(() => {
		if (!avatars.length) {
			getAvatars();
		}
	}, []);

	return (
		<>
			<Modal title='Налаштування' score={`#${account.id}`}>
				<div className={styles.subtitle}>Аватарки</div>
				<div className={styles.avatars}>
					{avatars.map(avatar => (
						<div
							key={Math.random()}
							className={classNames(
								styles.avatar,
								avatar === account.avatar_id && styles.currentSelectAvatar,
								avatar === selectAvatarId && styles.selectAvatar,
							)}
							onClick={() => selectAvatar(avatar)}>
							<img src={`${baseIconPath}/avatar/${avatar}`} alt='avatar' />
						</div>
					))}
				</div>
				<hr style={{ marginBottom: '10px', opacity: 0.3 }} />
				<input
					ref={inputFileRef}
					type='file'
					style={{ position: 'absolute', opacity: 0 }}
					onChange={handleImageChange}
				/>

				<button
					className={styles.selectGallery}
					onClick={handleSelectAvatarToGallery}>
					<div style={{ position: 'relative', width: '120px' }}>
						Вибрати з галереї
						{!account.is_premium && (
							<span className={styles.premiumMark}>Premium</span>
						)}
					</div>{' '}
				</button>

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
						noLoading={true}
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
		</>
	);
};

const memoModalSettings = memo(ModalSettings);
export default memoModalSettings;
