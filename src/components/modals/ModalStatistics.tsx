import { FC } from 'react';

import Modal from './Modal';

interface IStats {
	title: string;
	values: string[];
	numbers: number[];
}

interface IModalStatistics {
	stats: IStats;
}

const ModalStatistics: FC<IModalStatistics> = ({ stats }) => {
	const { title, values, numbers } = stats;

	return (
		<Modal title={title}>
			<div style={{ marginBottom: '5px' }}>
				Ім'я:{' '}
				<span style={{ fontWeight: 600 }}>{values[values.length - 1]}</span>
			</div>
			{values.map((value, idx) => {
				if (idx === values.length - 1) return;
				return (
					<div key={idx} style={{ marginBottom: '5px' }}>
						{value}: <span style={{ fontWeight: 600 }}>{numbers[idx]}</span>
					</div>
				);
			})}
		</Modal>
	);
};

export default ModalStatistics;
