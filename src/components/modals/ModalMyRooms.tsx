import { FC } from 'react';

import Modal from './Modal';
// import Room from '../../pages/Home/components/Room';

const ModalMyRooms: FC = () => {
	return (
		<Modal title='Мої кімнати'>
			<div
				style={{
					fontWeight: 700,
					color: '#52565A',
					fontSize: '16px',
					marginBottom: '10px',
				}}>
				Приватні кімнати
			</div>
			{/* <Room  /> */}
		</Modal>
	);
};

export default ModalMyRooms;
