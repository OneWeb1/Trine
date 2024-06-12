import { FC, useEffect, useState } from 'react';

import Modal from './Modal';
import TableLiveStats from '../TableLiveStats';
import GameService from '../../services/GameService';
import { LiveWinsResponse } from '../../models/response/AdminResponse';

interface IModalLiveStats {
	title: string;
}

const ModalLiveStats: FC<IModalLiveStats> = ({ title }) => {
	const [trineData, setTrineData] = useState<LiveWinsResponse[]>([]);
	const [wheelData, setWheelData] = useState<LiveWinsResponse[]>([]);
	const getLiveWins = async () => {
		try {
			const { data } = await GameService.liveWins();
			console.log(data);
			setTrineData(data.filter(item => item.type === 'room'));
			setWheelData(data.filter(item => item.type === 'fortune'));
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getLiveWins();
	}, []);

	return (
		<Modal title={title}>
			<TableLiveStats title='Тринька' data={trineData} />
			<TableLiveStats
				style={{ paddingBottom: '30px' }}
				title='Колесо фортуни'
				data={wheelData}
			/>
		</Modal>
	);
};

export default ModalLiveStats;
