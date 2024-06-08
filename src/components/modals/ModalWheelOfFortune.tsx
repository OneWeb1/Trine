import { FC, useState } from 'react';

import Modal from './Modal';

import Wheel from '../Wheel';
import CustomRange from '../../UI/CustomRange';

interface IModalWheelOfFortune {}

const ModalWheelOfFortune: FC<IModalWheelOfFortune> = () => {
	const [bet, setBet] = useState<number>(50);

	return (
		<Modal title={'Колесо фортуни'}>
			<div style={{ fontSize: '13px', marginBottom: '30px' }}>
				Ласкаво просимо до колеса фортуни! У вас є можливість випробувати свою
				удачу. Крутіть колесо та дізнайтеся, які призи на вас чекають.
			</div>
			<Wheel bet={bet} setBet={setBet} />
			<CustomRange bet={bet} setBet={setBet} />
			<div style={{ fontSize: '13px', marginTop: '30px' }}>
				Виберіть суму ставки та натисніть кнопку крутити.
			</div>
		</Modal>
	);
};

export default ModalWheelOfFortune;
