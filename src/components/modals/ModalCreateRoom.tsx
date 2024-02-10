import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	setVisibleModal,
	setUpdatePublickRooms,
} from '../../store/slices/app.slice';
import Modal from './Modal';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import AdminService from '../../services/AdminService';
import { CreatePublicRoomParams } from '../../models/response/AdminResponse';

interface IModalCreateRoom {
	title: string;
	type: string;
}

const ModalCreateRoom: FC<IModalCreateRoom> = ({ title, type }) => {
	const dispatch = useDispatch();
	const [name, setName] = useState<number | string>('');
	const [numberPlayers, setNumberPlayers] = useState<number | string>(2);
	const [startBet, setStartBet] = useState<number | string>(10);
	const [maxBet, setMaxBet] = useState<number | string>(10);

	if (Number(startBet) > 1000) setStartBet(1000);

	const createPublicRoom = async () => {
		const playersCount =
			Number(numberPlayers) > 11 || Number(numberPlayers) < 2
				? 11
				: numberPlayers;
		const params: CreatePublicRoomParams = {
			max_players: String(playersCount),
			join_tax: String(startBet),
			max_bid: String(maxBet),
		};

		if (String(name).length) {
			params.name = String(name);
		}
		dispatch(setVisibleModal('v'));
		await AdminService.createPublicRoom(params);
		dispatch(setUpdatePublickRooms());
	};

	// useState(() => {
	// 	for (let i = 0; i < 1000; i++) {
	// 		createPublicRoom();
	// 	}
	// }, []);

	const createPrivateRoom = async () => {};

	const createRoom =
		(type === 'public' && createPublicRoom) || createPrivateRoom;

	const createRoomHandler = () => {
		createRoom();
	};

	return (
		<Modal title={title}>
			<Input
				type='text'
				placeholder='Введіть імя кімнати'
				label='Імя кімнати'
				value={name}
				onChange={setName}
			/>
			<Input
				type='number'
				placeholder='Виберіть кількість гравців'
				label='Кількість гравців'
				value={numberPlayers}
				onChange={setNumberPlayers}
			/>
			<Input
				type='number'
				placeholder='Від 1₴ до 1000₴'
				label='Сумма початкової ставки'
				value={startBet}
				onChange={setStartBet}
			/>
			<Input
				type='number'
				placeholder='Введіть сумму максимальної ставки'
				label='Сумма максимальної ставки'
				value={maxBet}
				onChange={setMaxBet}
			/>
			<Button
				style={{ marginTop: '15px' }}
				value='Створити'
				onClick={createRoomHandler}
			/>
		</Modal>
	);
};

export default ModalCreateRoom;
