import { FC, useRef, useEffect, useState } from 'react';

import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleModal } from '../../../store/slices/app.slice';

import Room from '../../Home/components/Room';

import Button from '../../../UI/Button';
import Pagination from '../../../components/Pagination';

import { RoomsResponse } from '../../../models/response/AdminResponse';

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
	const { updateRoom } = useSelector((state: CustomRootState) => state.app);
	const [rooms, setRooms] = useState<RoomsResponse[]>([]);
	const [pagesNumber, setPagesNumber] = useState<number>(
		JSON.parse(localStorage.getItem('room-pages-length') || '1'),
	);
	const [limit] = useState<number>(9);
	const [offset, setOffset] = useState<number>(
		(JSON.parse(localStorage.getItem('admin-room-page') || '0') - 1) * limit,
	);
	const loadingRef = useRef<boolean>(false);

	const isHideName = !hideName === false ? false : true;

	const w = window.innerWidth > 500;

	const getPublickRooms = async () => {
		const { data } = await AdminService.getRooms({ offset, limit });
		if (!data) return;
		setPagesNumber(data.pages);
		setRooms(data.items);
		if (!loadingRef.current) loadingRef.current = true;
		localStorage.setItem('room-pages-length', JSON.stringify(data.pages));
	};

	const changePage = (page: number) => {
		const currentPage = JSON.parse(
			localStorage.getItem('admin-room-page') || '1',
		);
		if (currentPage === page) return;

		const offset = (page - 1) * limit;
		setOffset(offset);
		loadingRef.current = false;
		localStorage.setItem('admin-room-page', JSON.stringify(page));
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
	}, [updateRoom, update]);

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
					{!loadingRef.current && (
						<div className={styles.flexCenter}>
							<Spinner />
						</div>
					)}
					{loadingRef.current &&
						rooms.map((room: RoomsResponse, idx) => (
							<Room
								key={idx}
								room={room}
								offset={400}
								hideName={isHideName}
								isDelete={true}
							/>
						))}

					{loadingRef.current && !rooms.length && (
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
