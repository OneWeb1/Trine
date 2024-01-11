import { FC } from 'react';

// import ModalAfterGame from '../../components/modals/ModalAfterGame';

import styles from './TestPage.module.scss';
import CircleTimer from '../../components/timer';

const TestPage: FC = () => {
	return (
		<div className={styles.page}>
			<CircleTimer />
		</div>
	);
};

export default TestPage;
