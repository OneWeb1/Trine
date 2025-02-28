import { FC, useEffect, memo, useState } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import AdminService from '../../services/AdminService';
import { setTransfersData } from '../../store/slices/app.slice';
import { GlobalsData } from '../../models/response/AdminResponse';
import { AxiosResponse } from 'axios';
import { setVisibleModal } from '../../store/slices/app.slice';

import Modal from './Modal';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

interface IModalReplenishment {
	title: string;
}

const ModalReplenishment: FC<IModalReplenishment> = ({ title }) => {
	const dispatch = useDispatch();
	const { account } = useSelector((state: CustomRootState) => state.app);

	const [userId, setUserId] = useState<number | string>(account.id);
	const [deposit, setDeposit] = useState<number | string>(0);

	const [isError, setIsError] = useState<boolean>(false);

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
			})
			.catch(e => console.log(e));
	};

	const replenishmentBalance = (userId: number, deposit: number) => {
		if (isError) setIsError(false);
		if (!userId || !deposit) {
			setIsError(true);
		}
		if (userId && deposit) {
			window.open(
				`https://t.me/trineGameBot?start=d-${userId}-${deposit}`,
				'_blank',
			);
			dispatch(setVisibleModal('h'));
		}
	};

	useEffect(() => {
		getGlobals();
	}, []);

	return (
		<Modal title={title}>
			<Input
				type='number'
				label='ID'
				value={account.id}
				placeholder='Введіть ID облікового запису'
				onChange={setUserId}
			/>
			<Input
				type='number'
				label='Сума депозиту'
				placeholder='Введіть суму депозиту'
				onChange={setDeposit}
			/>
			<div style={{ marginBottom: '20px', color: 'red' }}>
				{isError && 'Ви не вказали суму депозиту'}
			</div>
			<Button
				noLoading={true}
				onClick={() => replenishmentBalance(Number(userId), Number(deposit))}>
				Поповнити рахунок
			</Button>
		</Modal>
	);
};

const MemoModalReplenishment = memo(ModalReplenishment);
export default MemoModalReplenishment;
