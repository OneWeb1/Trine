import { FC, memo } from 'react';

import { useDispatch } from 'react-redux';
import { setVisibleModal } from '../../store/slices/app.slice';

import Modal from './Modal';
import Button from '../../UI/Button';

interface IModalPayGroup {
	title: string;
}

const ModalPayGroup: FC<IModalPayGroup> = ({ title }) => {
	const dispatch = useDispatch();

	const showModalReplenishmentTelegram = () => {
		dispatch(setVisibleModal('mrt'));
	};

	const showModalReplenishmentAdmin = () => {
		dispatch(setVisibleModal('mra'));
	};

	return (
		<Modal title={title}>
			<Button
				style={{
					background: 'transparent',
					border: '2px solid #0d398d',
					color: '#000',
				}}
				value='Поповнити через телеграм'
				noLoading={true}
				onClick={showModalReplenishmentTelegram}
			/>
			<div style={{ margin: '10px 0' }}></div>
			<Button
				value='Поповнити через адміна'
				noLoading={true}
				onClick={showModalReplenishmentAdmin}
			/>
		</Modal>
	);
};

const memoModalPayGroup = memo(ModalPayGroup);
export default memoModalPayGroup;
