import { useState } from 'react';
import Button from '../../UI/Button';
import Modal from './Modal';

const ModalVerify = () => {
	const [isClose, setIsClose] = useState<boolean>(false);

	return (
		<Modal
			style={{ maxWidth: '450px' }}
			title='Пошта підтверджена!'
			isHide={false}
			close={isClose}>
			<div
				style={{
					margin: ' -5px auto 25px auto',
					fontSize: '12px',
				}}>
				Ви можете використовувати її для входу до аккаунту
			</div>

			<Button
				value='Готово'
				noLoading={true}
				onClick={() => {
					setIsClose(true);
					window.location.href = '/';
				}}
			/>
		</Modal>
	);
};

export default ModalVerify;
