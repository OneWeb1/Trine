import { FC, useState, useEffect } from 'react';
import { RootState as CustomRootState } from '../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setTransfersData } from '../../../store/slices/app.slice';
import Input from '../../../UI/Input';
import Button from '../../../UI/Button';

import styles from './../styles/Transfers.module.scss';
import AdminService from '../../../services/AdminService';
import { GlobalsData } from '../../../models/response/AdminResponse';
import { AxiosResponse } from 'axios';

const Transfers: FC = () => {
	const dispatch = useDispatch();
	const { transfersData } = useSelector((state: CustomRootState) => state.app);

	const [label, setLabel] = useState<number | string>(transfersData.label);
	const [name, setName] = useState<number | string>(transfersData.name);
	const [link, setLink] = useState<number | string>(transfersData.link);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const saveChanged = async () => {
		await AdminService.postGlobalsAll({
			transfers: {
				resource_name: String(label),
				username: String(name),
				link: String(link),
			},
		})
			.then(() => {
				dispatch(
					setTransfersData({
						label,
						name,
						link,
					}),
				);
				setIsLoading(true);
				location.reload();
			})
			.catch(e => console.log(e));
	};

	const getGlobals = async () => {
		await AdminService.getGlobalsAll()
			.then((response: AxiosResponse<GlobalsData>) => {
				const { transfers } = response.data.globals;
				dispatch(
					setTransfersData({
						label: transfers.resource_name,
						name: transfers.username,
						link: transfers.link,
					}),
				);
				setLabel(transfers.resource_name);
				setName(transfers.username);
				setLink(transfers.link);
				setIsLoading(true);
			})
			.catch(e => console.log(e));
	};

	useEffect(() => {
		getGlobals();
	}, []);

	return (
		<>
			{isLoading ? (
				<div className={styles.roomsWrapper}>
					<div className={styles.header}>
						<div
							className={styles.title}
							style={{ fontSize: window.innerWidth < 600 ? '14px' : '18px' }}>
							Перекази
						</div>
					</div>
					<div className={styles.view}>
						<div className={styles.row}>
							<div className={styles.input}>
								<Input
									type='text'
									label='Назва ресурсу'
									placeholder='Введіть назву ресурсу'
									value={label}
									onChange={setLabel}
								/>
							</div>
							<div className={styles.input}>
								<Input
									type='text'
									label="Ім'я користувача"
									placeholder="Введіть Ім'я користувача"
									value={name}
									onChange={setName}
								/>
							</div>
						</div>
						<Input
							type='text'
							label='Посилання на ресурс'
							placeholder='Введіть посилання на ресурс'
							value={link}
							onChange={setLink}
						/>

						<Button
							style={{
								width: 'fit-content',
								padding: '0px 20px',
								marginTop: 10,
							}}
							value='Зберегти зміни'
							noLoading={false}
							onClick={saveChanged}></Button>
					</div>
				</div>
			) : (
				'Загрузка...'
			)}
		</>
	);
};

export default Transfers;
