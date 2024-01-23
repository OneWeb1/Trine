import { FC, ReactNode, RefObject } from 'react';

import FishkaItem from '../../../../../components/FishkaItem';

import styles from './LandscapeTable.module.scss';
import { IPublicRoom } from '../../../../Admin/interfaces';

interface ILandscapeTable {
	tableRef: RefObject<HTMLDivElement>;
	roomState: IPublicRoom;
	children: ReactNode;
}

const LandscapeTable: FC<ILandscapeTable> = ({
	tableRef,
	roomState,
	children,
}) => {
	return (
		<div style={{ marginTop: '-20px' }} className={styles.tableWrapper}>
			<div className={styles.table} ref={tableRef}>
				{children}
				{/* {players.map((player, idx) => (
					<Player
						key={idx}
						cards={mePlayer.cards}
						player={player}
						reverse={reverseIds.includes(pos[idx])}
						isMeMove={mePlayer.state === 'move'}
						isVisibleCards={roomState.state === 'bidding'}
						isReady={ready}
						check={check}
						bet={player.last_bid}
						lastId={getLastId()}
						index={pos[idx]}
					/>
				))} */}

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

export default LandscapeTable;
