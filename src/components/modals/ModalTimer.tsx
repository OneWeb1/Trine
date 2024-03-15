import { FC } from 'react';

import styles from './../../stylesheet/styles-components/modals/Modal.module.scss';

interface IModalTimer {
	timer: number;
}

const ModalTimer: FC<IModalTimer> = ({ timer }) => {
	return (
		<div className={styles.modalTimer}>
			<div className={styles.timer}>
				Гра розпочнеться через {timer} секунд...
			</div>
		</div>
	);
};

export default ModalTimer;
