import { FC } from 'react';
import styles from './Loader.module.scss';

const Loader: FC = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.cardWrapper}>
				<div className={styles.loaderImage}>
					<img src='/assets/loader/loader.gif' alt='loader' />
				</div>

				<div className={styles.loaderWrapper}>
					<div className={styles.viewLoader}>
						<div className={styles.load}></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Loader;
