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
	ProfileMeResponse,
} from '../../models/response/AdminResponse';

interface IModalChangeBalance {
	title: string;
}

const ModalChangeBalance: FC<IModalChangeBalance> = ({ title }) => {
	const dispatch = useDispatch();
	const [balance, setBalance] = useState<string | number>(0);
	const [account] = useState<ProfileMeResponse>(
		JSON.parse(
			localStorage.getItem('account_settings') || '{balance:0, id: -1}',
		),
	);
	const [currentBalance, setCurrentBalance] = useState<number>(account.balance);
	const w = window.innerWidth > 400;

	const changeBalance = async () => {
		if (!String(balance).replace(/\D/gi, '').length) return;
		await AdminService.changeBalance(
			account.id,
			currentBalance + Number(balance),
		);
		dispatch(setVisibleModal('h'));
		dispatch(setUpdateAccounts());
	};

	const resetBalance = async () => {
		await AdminService.changeBalance(account.id, 0);
		setCurrentBalance(0);
		dispatch(setUpdateAccounts());
	};

	return (
		<Modal title={title}>
			<div style={{ fontWeight: '600', marginBottom: '10px' }}>
				Поточний баланс: {currentBalance} ₴
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
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: w ? 'row' : 'column',
				}}>
				<Button
					style={{
						marginRight: w ? '10px' : '0px',
						marginBottom: w ? '0' : '10px',
					}}
					value='Обнулити баланс'
					onClick={resetBalance}
				/>

				<Button value='Змінити баланс' onClick={changeBalance} />
			</div>
		</Modal>
	);
};

export default ModalChangeBalance;
