import { FC, useState } from 'react';

import Modal from './Modal';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

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
	const [codeRoom, setCodeRoom] = useState<string | number>('');

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(value);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const joinToRoom = () => {
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
			<Button
				style={{ marginTop: '15px' }}
				value={buttonText}
				onClick={joinToRoom}
			/>
		</Modal>
	);
};

export default ModalJoinToCode;
