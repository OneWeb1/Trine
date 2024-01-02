import { FC, useRef, useEffect, useState } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleModal } from '../../../store/slices/app.slice';

import Room from '../../Home/components/Room';

import styles from './../styles/Rooms.module.scss';
import Button from '../../../UI/Button';

import { PublicRoomResponce } from '../../../models/responce/AdminResponce';

import AdminService from '../../../services/AdminService';

interface ISettingsRooms {
	hideName?: boolean;
}

const SettingsRooms: FC<ISettingsRooms> = ({ hideName }) => {
	const dispatch = useDispatch();
	const [update, setUpdate] = useState<number>(1);
	const intervalRef = useRef<number | null>(null);
	const { updatePublicRooms } = useSelector(
		(state: CustomRootState) => state.app,
	);
	const [publicRooms, setPublicRooms] = useState<PublicRoomResponce[]>([]);
	const isHideName = !hideName === false ? false : true;

	const getPublickRooms = async () => {
		const { data } = await AdminService.getPublicRooms();
		if (!data) return;
		setPublicRooms(data);
	};

	useEffect(() => {
		setTimeout(() => {
			getPublickRooms();
		}, 100);
		if (!intervalRef.current) {
			intervalRef.current = setInterval(() => {
				setUpdate(prev => prev + 1);
			}, 3000);
			setUpdate(prev => prev + 1);
		}
	}, [updatePublicRooms, update]);

	return (
		<div className={styles.roomsWrapper}>
			<div className={styles.header}>
				<div className={styles.title}>Кімнати</div>
				<Button
					style={{ width: '200px', height: '40px', fontSize: '14px' }}
					value='Створити кімнату'
					onClick={() => dispatch(setVisibleModal('cpr'))}
				/>
			</div>
			<div className={styles.header}>
				<div></div>
			</div>
			<div className={styles.rooms}>
				{publicRooms.map((room: PublicRoomResponce, idx) => (
					<Room
						key={idx}
						room={room}
						offset={400}
						hideName={isHideName}
						isDelete={true}
					/>
				))}

				{!publicRooms.length && (
					<div className={styles.emptyWrapper}>
						<div className={styles.wrapper}>
							<div className={styles.title}>
								Список публічних кімнат порожній. Для відображення кімнат
								створіть кімнату
							</div>
							<Button
								style={{ width: '250px', margin: '50px auto' }}
								value='Створити кімнату'
								onClick={() => dispatch(setVisibleModal('cpr'))}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SettingsRooms;
