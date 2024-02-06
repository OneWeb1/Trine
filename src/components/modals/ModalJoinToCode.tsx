import { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setJoinRoom, setVisibleModal } from '../../store/slices/app.slice';

import Modal from './Modal';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import GameService from '../../services/GameService';

interface IModalJoinToRoom {
	title: string;
	buttonText: string;
	value?: string;
	readOnly?: boolean;
	isDeleteFocus?: boolean;
}

const ModalJoinToCode: FC<IModalJoinToRoom> = ({
	title,
	value = '',
	buttonText,
	readOnly,
	isDeleteFocus,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [codeRoom, setCodeRoom] = useState<string | number>('');
	const [isError, setIsError] = useState<boolean>(false);

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(value);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const joinToRoom = async () => {
		try {
			const { data } = await GameService.joinRoom(String(codeRoom));
			if (localStorage.getItem('joinRoom')) return;
			dispatch(setJoinRoom(data));
			dispatch(setVisibleModal('h'));
			navigate(`/game/${data.id}`);
			localStorage.setItem('joinRoom', JSON.stringify(data));
		} catch (e) {
			localStorage.removeItem('joinRoom');
			setIsError(true);
			setTimeout(() => {
				setIsError(false);
			}, 3000);
		}
		// 4d9e25dc-b3f0-11ee-9f4a-e9b61e7b6196
		if (readOnly) {
			copyCode();
			return;
		}
	};

	return (
		<Modal title={title}>
			<Input
				label='Код кімнати'
				type='text'
				placeholder='xxxx-xxxx-xxxx-xxxx'
				value={(readOnly && value) || codeRoom}
				readOnly={readOnly}
				isDeleteFocus={isDeleteFocus}
				onChange={setCodeRoom}
			/>
			{isError && (
				<p style={{ color: 'red' }}>Кімнити з таким кодом не існує</p>
			)}
			<Button
				style={{ marginTop: '15px' }}
				value={buttonText}
				loading={true}
				onClick={joinToRoom}
			/>
		</Modal>
	);
};

export default ModalJoinToCode;
