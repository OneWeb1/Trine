import { FC, useRef, useEffect, useState } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleModal } from '../../../store/slices/app.slice';

import Room from '../../Home/components/Room';

import Button from '../../../UI/Button';
import Pagination from '../../../components/Pagination';

import { PublicRoomResponse } from '../../../models/response/AdminResponse';

import AdminService from '../../../services/AdminService';

import styles from './../styles/Rooms.module.scss';
import Spinner from '../../../components/spinner';

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
	const [publicRooms, setPublicRooms] = useState<PublicRoomResponse[]>([]);
	const [pagesNumber, setPagesNumber] = useState<number>(
		JSON.parse(localStorage.getItem('rooms-length') || '0'),
	);
	const [limit] = useState<number>(1);
	const [offset, setOffset] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const sliceRooms = publicRooms.slice(offset, offset + limit);

	const isHideName = !hideName === false ? false : true;

	const w = window.innerWidth > 500;

	const getPublickRooms = async () => {
		const { data } = await AdminService.getPublicRooms();
		if (!data) return;
		setPagesNumber(Math.ceil(data.length));
		setPublicRooms(data);
		if (!loading) setLoading(true);
		localStorage.setItem(
			'rooms-length',
			JSON.stringify(Math.ceil(data.length)),
		);
	};

	const changePage = (currentPage: number) => {
		const offset = (currentPage - 1) * limit;
		setOffset(offset);
		setLoading(false);
		localStorage.setItem('admin-room-page', JSON.stringify(currentPage));
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
				<div
					className={styles.title}
					style={{ fontSize: window.innerWidth < 600 ? '14px' : '18px' }}>
					Кімнати
				</div>
				<Button
					style={{
						width: w ? '200px' : '140px',
						height: '40px',
						fontSize: w ? '14px' : '11px',
					}}
					value='Створити кімнату'
					onClick={() => dispatch(setVisibleModal('cpr'))}
				/>
			</div>
			<div className={styles.header}>
				<div></div>
			</div>

			<div>
				<div className={styles.rooms}>
					{!loading && (
						<div className={styles.flexCenter}>
							<Spinner />
						</div>
					)}
					{loading &&
						sliceRooms.map((room: PublicRoomResponse, idx) => (
							<Room
								key={idx}
								room={room}
								offset={400}
								hideName={isHideName}
								isDelete={true}
							/>
						))}

					{loading && !publicRooms.length && (
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
				<div style={{ padding: '0px 10px', paddingTop: '10px' }}>
					<Pagination
						numbers={pagesNumber > 10 ? pagesNumber : 10}
						workPages={!pagesNumber ? 1 : pagesNumber}
						current={JSON.parse(localStorage.getItem('admin-room-page') || '0')}
						changePage={changePage}
					/>
				</div>
			</div>
		</div>
	);
};

export default SettingsRooms;
