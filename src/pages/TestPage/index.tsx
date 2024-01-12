import { FC } from 'react';

// import ModalAfterGame from '../../components/modals/ModalAfterGame';

import styles from './TestPage.module.scss';
import CircleTimer from '../../components/timer';
import ModalStatistics from '../../components/modals/ModalStatistics';

const TestPage: FC = () => {
	return (
		<div className={styles.page}>
			<ModalStatistics
				title='Статистика гравця'
				values={['0', '1', '2']}
				numbers={[0, 1, 2]}
			/>
		</div>
	);
};

export default TestPage;
