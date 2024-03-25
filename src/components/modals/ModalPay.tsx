import { FC, useEffect, memo } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import AdminService from '../../services/AdminService';
import { setTransfersData } from '../../store/slices/app.slice';
import { GlobalsData } from '../../models/response/AdminResponse';
import { AxiosResponse } from 'axios';

import Modal from './Modal';

interface IModalPay {
	title: string;
	message: string;
}

const ModalPay: FC<IModalPay> = ({ title, message }) => {
	const dispatch = useDispatch();
	const { transfersData } = useSelector((state: CustomRootState) => state.app);

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

	useEffect(() => {
		getGlobals();
	}, []);

	return (
		<Modal title={title}>
			<span style={{ color: '#000' }}>{message}</span>

			<span style={{ display: 'block', marginTop: '15px', color: '#000' }}>
				{transfersData.label}{' '}
				<span style={{ color: '#0053D0' }}>
					<a href={transfersData.link} target='_blank'>
						{transfersData.name}
					</a>
				</span>
			</span>
		</Modal>
	);
};

const memoModalPay = memo(ModalPay);
export default memoModalPay;
