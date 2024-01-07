{
	/* {windowWidth < 1100 && (
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										marginTop: '10px',
									}}>
									<div>
										<input
											style={{ opacity: percent === 0 ? 0.5 : 1 }}
											type='range'
											ref={rangeRef}
											disabled={percent === 0 ? true : !isEnable}
											min={0}
											max={10000}
											value={percent}
											className={styles.range}
											onChange={e => changePercent(e)}
										/>
									</div>
									<div style={{ marginLeft: '20px', display: 'flex' }}>
										<ButtonFunction
											text='x2'
											number={multiplay(bid, 2)}
											disabled={
												maxBid - bid < multiplay(bid, 2)
													? maxBid - bid > multiplay(bid, 2)
													: isEnable
											}
											onClick={() => {
												let sum = multiplay(joinTax, 2);
												if (sum < bid * 2) sum = bid * 2;
												setRaiseSum(sum);
												setPercent((sum / maxBid) * 10000);
											}}
										/>
										<ButtonFunction
											text='x5'
											number={multiplay(bid, 5)}
											disabled={
												maxBid - bid < multiplay(bid, 5)
													? maxBid - bid > multiplay(bid, 5)
													: isEnable
											}
											onClick={() => {
												let sum = multiplay(joinTax, 5);
												if (sum < bid * 2) sum = bid * 2;
												setRaiseSum(sum);
												setPercent((sum / maxBid) * 10000);
											}}
										/>
										<ButtonFunction
											text='x10'
											number={multiplay(bid, 10)}
											disabled={
												maxBid - bid < multiplay(bid, 10)
													? maxBid - bid > multiplay(bid, 10)
													: isEnable
											}
											onClick={() => {
												let sum = multiplay(joinTax, 10);
												if (sum < bid * 2) sum = bid * 2;
												setRaiseSum(sum);
												setPercent((sum / maxBid) * 10000);
											}}
										/>
										<ButtonFunction
											text='MAX'
											number={maxBid - bid}
											disabled={
												maxBid - bid === 0 ? maxBid - bid !== 0 : isEnable
											}
											onClick={() => {
												const sum = maxBid - bid;
												setRaiseSum(sum);
												setPercent((sum / maxBid) * 10000);
											}}
										/>
									</div>
								</div>
							)} */
}
