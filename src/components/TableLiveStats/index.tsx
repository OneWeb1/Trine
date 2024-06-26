import { CSSProperties, FC } from 'react';
import styles from './TableLiveStats.module.scss';
import { LiveWinsResponse } from '../../models/response/AdminResponse';

interface ITableLiveStats {
	title: string;
	data: LiveWinsResponse[];
	style?: CSSProperties;
}

interface ITableItem {
	item: LiveWinsResponse;
}

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
			<div className={styles.winWrapper}>{item.prize} ₴</div>
		</div>
	);
};

const TableLiveStats: FC<ITableLiveStats> = ({ title, data, style }) => {
	return (
		<div style={style} className={styles.table}>
			<div style={{ fontWeight: 600, textAlign: 'left' }}>{title}</div>
			<div className={styles.header}>
				<div className={styles.item}>Гравець</div>
				<div className={styles.item}>Виграш</div>
			</div>
			<div className={styles.content}>
				{data?.map(item => (
					<TableItem item={item} />
				))}
				{!data.length && (
					<div style={{ textAlign: 'center' }}>
						Грай щоб зявилася статистика
					</div>
				)}
			</div>
		</div>
	);
};

export default TableLiveStats;
