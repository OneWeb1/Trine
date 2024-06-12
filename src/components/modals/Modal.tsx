import { FC, memo, CSSProperties, ReactNode } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleModal } from '../../store/slices/app.slice';
import { IoClose } from 'react-icons/io5';

import styles from './../../stylesheet/styles-components/modals/Modal.module.scss';

interface IModal {
	title: string;
	score?: string;
	isHide?: boolean;
	close?: boolean;
	children: ReactNode;
	style?: CSSProperties;
	styleNode?: CSSProperties;
}

const Modal: FC<IModal> = ({
	title,
	score,
	isHide,
	close,
	children,
	styleNode,
	style,
}) => {
	const dispatch = useDispatch();
	const { visibleModal } = useSelector((state: CustomRootState) => state.app);
	if (close) dispatch(setVisibleModal('h'));
	const hideModal = () => {
		if (isHide !== false) dispatch(setVisibleModal('h'));
	};
	const hideModalClose = () => {
		if (isHide !== false || close === false) dispatch(setVisibleModal('h'));
	};
	return (
		<>
			{visibleModal !== 'h' && (
				<div
					style={styleNode}
					className={styles.modalWrapper}
					onClick={() => hideModal()}>
					<div
						style={style}
						className={styles.modal}
						onClick={e => e.stopPropagation()}>
						<div className={styles.header}>
							<div className={styles.title}>{title}</div>
							{score ? (
								<div className={styles.rightWrapper}>
									<div className={styles.scoreWrapper}>ID {score}</div>
									{isHide !== false && (
										<div className={styles.close} onClick={() => hideModal()}>
											<IoClose />
										</div>
									)}
								</div>
							) : (
								<>
									{(isHide !== false || close === false) && (
										<div
											className={styles.close}
											onClick={() => hideModalClose()}>
											<IoClose />
										</div>
									)}
								</>
							)}
						</div>
						<div
							className={styles.scrollWrapper}
							style={{
								height:
									window.innerHeight - 80 < 700
										? window.innerHeight - 80 + 'px'
										: 700 + 'px',
								overflowY: 'scroll',
								paddingBottom: '20px',
							}}>
							{children}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const memoModal = memo(Modal);

export default memoModal;
