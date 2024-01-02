import { FC, useState } from 'react';
// import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch } from 'react-redux';
import {
	setVisibleModal,
	setUpdateAccounts,
} from '../../store/slices/app.slice';

import Modal from './Modal';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import AdminService from '../../services/AdminService';
import {
	// IPlayerRoom,
	ProfileMeResponce,
} from '../../models/responce/AdminResponce';

interface IModalChangeBalance {
	title: string;
}

const ModalChangeBalance: FC<IModalChangeBalance> = ({ title }) => {
	const dispatch = useDispatch();
	const [balance, setBalance] = useState<string | number>(0);
	const [account] = useState<ProfileMeResponce>(
		JSON.parse(
			localStorage.getItem('account_settings') || '{balance:0, id: -1}',
		),
	);
	const changeBalance = async () => {
		if (!String(balance).replace(/\D/gi, '').length) return;
		await AdminService.changeBalance(
			account.id,
			account.balance + Number(balance),
		);
		dispatch(setVisibleModal('h'));
		dispatch(setUpdateAccounts());
	};

	return (
		<Modal title={title}>
			<div style={{ fontWeight: '600', marginBottom: '10px' }}>
				Поточний баланс: {account.balance} ₴
			</div>
			<Input
				type='number'
				label='Сумма'
				placeholder='Вкажіть сумму для зміни балансу'
				onChange={setBalance}
			/>

			<div
				style={{
					margin: '10px 0px 20px 0px',
					fontWeight: '500',
					fontSize: '13px',
					color: 'green',
				}}>
				<p style={{ marginBottom: '5px' }}>
					Для того щоб поповнити баланс, введіть сумму більшу за нуль.
				</p>
				<p>Для того щоб зняти кошти з балансу, введіть сумму меншу за нуль.</p>
			</div>

			<Button value='Змінити баланс' onClick={changeBalance} />
		</Modal>
	);
};

export default ModalChangeBalance;
