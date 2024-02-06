import { FC } from 'react';

import { Link } from 'react-router-dom';

import styles from './../../stylesheet/styles/NotFound.module.scss';

const NotFound: FC = () => {
	return (
		<div className={styles.page}>
			<div className={styles.menu}>
				<div className={styles.image}>
					<img src='/assets/404.png' alt='not-found' />
				</div>
				<Link to='/'>
					<div className={styles.button}>На головну</div>
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
