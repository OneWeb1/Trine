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
	// const investigatorsCount =
	// 	roomState.players?.filter(
	// 		player => roomState.state === 'bidding' && player.state === 'spectate',
	// 	).length || 0;
	// const isQuarrel =
	// 	roomState.players?.filter(player => player.state === 'out' || player.fight)
	// 		.length || 0;

	const isWeldParty = roomState.players?.some(
		player => player.me && player.fight,
	);

	// const isJoinParty = roomState.players?.some(
	// 	player => player.me && player.state !== 'spectate',
	// );

	const isSpectate =
		roomState.players?.some(
			player => player.me && player.state === 'spectate',
		) && roomState.state === 'bidding';

	const isVisualSvara =
		roomState.state === 'player_recruitment' || roomState.state === 'result';

	return (
		<div className={styles.tableWrapper}>
			<div className={styles.table} ref={tableRef}>
				{children}
				<div className={styles.tableBorder}>
					<div className={styles.tableField}>
						<div className={styles.screenCenter}>
							<div className={styles.column}>
								<div className={styles.displayWrapper}>
									<div className={styles.tax}>
										Податок (3%)
										<span
											className={styles.taxNumber}
											style={{ marginLeft: '3px', fontWeight: '600' }}>
											{(roomState.bank * 0.03).toFixed(2)}
										</span>
									</div>
									<div className={styles.eyeWrapper}>
										{/* Слідкувачі: <span>{investigatorsCount}</span> */}
									</div>
									<FishkaItem value={roomState.bank} />
								</div>

								{roomState.svara_pending && isVisualSvara && (
									<div className={styles.swara}>
										<div className={styles.title}>СВАРА</div>
										{isWeldParty ? (
											<div className={styles.text}>
												Ви берете участь у сварі
											</div>
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
													{Math.floor(roomState.bank / 2)}
												</span>
											</div>
										)}
									</div>
								)}
								{roomState.svara && roomState.state !== 'result' && (
									<div className={styles.swara}>
										<div className={styles.title}>СВАРА</div>
										{!isSpectate ? (
											<div className={styles.text}>
												Ви берете участь у сварі
											</div>
										) : (
											isSpectate && (
												<div className={styles.text}>
													Ви спостерігаєте за сварою
												</div>
											)
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LandscapeTable;
