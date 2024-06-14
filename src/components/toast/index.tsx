import { FC, useEffect } from 'react';
import styles from './toast.module.scss';

import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { LiveWinsResponse } from '../../models/response/AdminResponse';
import GameService from '../../services/GameService';

interface ITableItem {
	item: LiveWinsResponse;
}

const StyledToastContainer = styled(ToastContainer).attrs({
	className: 'toast-container',
	toastClassName: 'toast',
	bodyClassName: 'body',
	progressClassName: 'progress',
})`
	/* .progress is passed to progressClassName */
	// height: 410px;

	padding: 0px 20px;
	// overflow-y: scroll;
	// opacity: 1;

	&::-webkit-scrollbar {
		width: 0;
	}

	.toast {
		max-height: 10px;
		background: rgba(255, 255, 255, 1);
		border-radius: 5px;
		margin-bottom: 5px;
	}
	.progress {
		background: rgba(42, 113, 255, 0.804);
	}
`;

const TableItem: FC<ITableItem> = ({ item }) => {
	return (
		<div className={styles.tableItem}>
			{/* Гравець */}
			<div className={styles.icon}>
				<img
					src={`https://trine-game.online/avatar/${item.account.avatar_id}`}
					alt='icon'
				/>
			</div>
			<div className={styles.name}>{item.account.nickname}</div>
			<div className={styles.winWrapper}>щойно виграв +{item.prize} ₴</div>
		</div>
	);
};

const ToastNotification = () => {
	useEffect(() => {
		const getLiveWins = async () => {
			try {
				const { data } = await GameService.liveWins();
				data.slice(0, 1).forEach(item => {
					const notify = () => toast(<TableItem item={item} />);
					notify();
				});
			} catch (e) {
				console.log(e);
			}
		};

		getLiveWins();
	}, []);

	return (
		<div>
			<StyledToastContainer
				position={window.innerWidth > 500 ? 'bottom-right' : 'top-center'}
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				// pauseOnHover
				theme='light'
			/>
		</div>
	);
};

export default ToastNotification;
