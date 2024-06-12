import { FC } from 'react';
import Modal from './Modal';

interface IModalWheelOfFortuneStats {
	title: string;
	balance: number;
	earnedFromTax: number;
	isHide?: boolean;
}

const ModalWheelOfFortuneStats: FC<IModalWheelOfFortuneStats> = ({
	title,
	balance,
	earnedFromTax,
	isHide,
}) => {
	return (
		<Modal
			title={title}
			isHide={isHide}
			styleNode={{ background: 'rgba(0,0,0,.1)' }}>
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					Баланс для виграшів:{' '}
					<span style={{ fontWeight: 600 }}>{balance}₴</span>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginTop: '5px',
					}}>
					Баланс податку:{' '}
					<span style={{ fontWeight: 600 }}>{earnedFromTax}₴</span>
				</div>
			</div>
		</Modal>
	);
};

export default ModalWheelOfFortuneStats;
