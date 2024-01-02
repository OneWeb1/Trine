import { FC } from 'react';

import ModalAfterGame from '../../components/modals/ModalAfterGame';

import styles from './TestPage.module.scss';

const TestPage: FC = () => {
	return (
		<div className={styles.page}>
			<ModalAfterGame
				title='Ви виграли'
				message='Сума виграшу'
				isHide={false}
				isWin={true}
				sum={500}
				onClick={() => {}}
			/>
		</div>
	);
};

export default TestPage;
