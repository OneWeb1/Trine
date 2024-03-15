import { FC } from 'react';

import Modal from './Modal';

interface IModalPay {
	title: string;
	message: string;
}

const ModalPay: FC<IModalPay> = ({ title, message }) => {
	return (
		<Modal title={title}>
			<span style={{ color: '#000' }}>{message}</span>

			<span style={{ display: 'block', marginTop: '15px', color: '#000' }}>
				Telegram:{' '}
				<span style={{ color: '#0053D0' }}>
					<a href='https://t.me/romuchtg' target='_blank'>
						@manager
					</a>
				</span>
			</span>
		</Modal>
	);
};

export default ModalPay;
