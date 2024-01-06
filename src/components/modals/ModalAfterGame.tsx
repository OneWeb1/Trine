import { FC } from 'react';
import Modal from './Modal';
import Button from '../../UI/Button';

interface IModalAfterGame {
	title: string;
	value?: string;
	message: string;
	isHide?: boolean;
	isWin?: boolean;
	sum?: number;
	onClick: () => void;
}

const ModalAfterGame: FC<IModalAfterGame> = ({
	title,
	value,
	message,
	isWin,
	// isHide,
	sum,
	onClick,
}) => {
	return (
		<Modal title={title} styleNode={{ background: 'rgba(255,255,255,.6)' }}>
			<div
				style={{
					marginBottom: '10px',
					fontWeight: 500,
				}}>
				{message}{' '}
				{<span style={{ fontWeight: '600' }}>{sum && `${sum}₴`}</span>}
			</div>

			{isWin === false && (
				<div style={{ color: 'green' }}>
					Не розчаровуйтесь, слідуючий виграш обов'язково буде за вами
				</div>
			)}

			{isWin && <div style={{ color: 'green' }}>Вітаю! Сьогодні ваш день.</div>}
			<Button
				style={{ marginTop: '20px' }}
				value={value || 'Продовжити гру'}
				onClick={onClick}
			/>
		</Modal>
	);
};

export default ModalAfterGame;
