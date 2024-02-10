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
	const investigatorsCount =
		roomState.players?.filter(
			player => roomState.state === 'bidding' && player.state === 'spectate',
		).length || 0;
	const isQuarrel =
		roomState.players?.filter(player => player.state === 'out' || player.fight)
			.length || 0;
	const isWeldParty = roomState.players?.some(
		player => player.me && player.fight,
	);

	return (
		<div style={{ marginTop: '-20px' }} className={styles.tableWrapper}>
			<div className={styles.table} ref={tableRef}>
				{children}

				<div className={styles.tableBorder}>
					<div className={styles.tableField}>
						<div className={styles.screenCenter}>
							<div className={styles.column}>
								<div className={styles.eyeWrapper}>
									Слідкувачі: <span>{investigatorsCount}</span>
								</div>
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
								{isQuarrel ? (
									<div className={styles.swara}>
										<div className={styles.title}>СВАРА</div>
										{isWeldParty ? (
											<div className={styles.text}>Ви берете участь свари</div>
										) : (
											<div className={styles.text}>
												Вступити до свари можна за{' '}
												<span style={{ fontWeight: '600', marginLeft: '5px' }}>
													<img
														style={{
															maxWidth: '15px',
															borderRadius: '100%',
															marginRight: '2px',
														}}
														src='/assets/fishka.png'
														alt='fishka'
													/>
													15
												</span>
											</div>
										)}
									</div>
								) : (
									<div></div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MobilePortraitTable;
