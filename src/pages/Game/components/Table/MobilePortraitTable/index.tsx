import { FC, ReactNode, RefObject } from 'react';

import FishkaItem from '../../../../../components/FishkaItem';

import styles from './MobilePortraitTable.module.scss';
import { IPublicRoom } from '../../../../Admin/interfaces';

interface IMobilePortraitTable {
	tableRef: RefObject<HTMLDivElement>;
	roomState: IPublicRoom;
	children: ReactNode;
}

const MobilePortraitTable: FC<IMobilePortraitTable> = ({
	tableRef,
	roomState,
	children,
}) => {
	return (
		<div style={{ marginTop: '-20px' }} className={styles.tableWrapper}>
			<div className={styles.table} ref={tableRef}>
				{children}

				<div className={styles.tableBorder}>
					<div className={styles.tableField}>
						<div className={styles.screenCenter}>
							<div className={styles.displayWrapper}>
								<div className={styles.tax}>
									Налог (3%){' '}
									<span
										className={styles.taxNumber}
										style={{ marginLeft: '3px', fontWeight: '600' }}>
										{(roomState.bank * 0.03).toFixed(2)}
									</span>
								</div>
								<FishkaItem value={roomState.bank} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MobilePortraitTable;
