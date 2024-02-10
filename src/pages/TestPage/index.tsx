import { FC } from 'react';

// import ModalAfterGame from '../../components/modals/ModalAfterGame';

import styles from './TestPage.module.scss';
import Loader from '../../components/loader';
// import CircleTimer from '../../components/timer';
// import ModalStatistics from '../../components/modals/ModalStatistics';

const TestPage: FC = () => {
	return (
		<div className={styles.page}>
			<Loader />
		</div>
	);
};

export default TestPage;
