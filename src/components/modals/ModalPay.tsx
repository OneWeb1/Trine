import { FC } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useSelector } from 'react-redux';

import Modal from './Modal';

interface IModalPay {
	title: string;
	message: string;
}

const ModalPay: FC<IModalPay> = ({ title, message }) => {
	const { transfersData } = useSelector((state: CustomRootState) => state.app);

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

export default ModalPay;
