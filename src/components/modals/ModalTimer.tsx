import { FC } from 'react';

import styles from './../../stylesheet/styles-components/modals/Modal.module.scss';

interface IModalTimer {
	timer: number;
}

const ModalTimer: FC<IModalTimer> = ({ timer }) => {
	return (
		<div className={styles.modalTimer}>
			<div className={styles.title}>Гра скоро розпочнеться!</div>
			<div className={styles.subtitle}>До початку раунду лишилося:</div>
			<div className={styles.timer}>{timer}</div>
		</div>
	);
};

export default ModalTimer;
