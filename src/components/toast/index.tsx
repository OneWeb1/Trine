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
	height: 220px;
	overflow-y: scroll;
	opacity: 1;

	&::-webkit-scrollbar {
		width: 0;
	}

	.toast {
		height: 10px;
		background: rgba(255, 255, 255, 1);
	}
	.progress {
		background: rgba(42, 113, 255, 0.804);
	}
`;

const TableItem: FC<ITableItem> = ({ item }) => {
	return (
		<div className={styles.tableItem}>
			<div className={styles.profileWrapper}>
				<div className={styles.icon}>
					<img
						src={`https://trine-game.online/avatar/${item.account.avatar_id}`}
						alt='icon'
					/>
				</div>
				<div className={styles.name}>{item.account.nickname}</div>
			</div>
			<div className={styles.winWrapper}>+{item.prize} ₴</div>
		</div>
	);
};

const ToastNotification = () => {
	useEffect(() => {
		const getLiveWins = async () => {
			try {
				const { data } = await GameService.liveWins();
				data.forEach(item => {
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
				position='bottom-right'
				autoClose={10000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='light'
			/>
		</div>
	);
};

export default ToastNotification;
