import { CSSProperties, FC, ReactNode } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleModal } from '../../store/slices/app.slice';
import { IoClose } from 'react-icons/io5';

import styles from './../../stylesheet/styles-components/modals/Modal.module.scss';

interface IModal {
	title: string;
	score?: string;
	isHide?: boolean;
	children: ReactNode;
	styleNode?: CSSProperties;
}

const Modal: FC<IModal> = ({ title, score, isHide, children, styleNode }) => {
	const dispatch = useDispatch();
	const { visibleModal } = useSelector((state: CustomRootState) => state.app);
	console.log({ visibleModal });
	const hideModal = () => {
		if (isHide !== false) dispatch(setVisibleModal('h'));
	};
	return (
		<>
			{visibleModal !== 'h' && (
				<div
					style={styleNode}
					className={styles.modalWrapper}
					onClick={() => hideModal()}>
					<div className={styles.modal} onClick={e => e.stopPropagation()}>
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
									{isHide !== false && (
										<div className={styles.close} onClick={() => hideModal()}>
											<IoClose />
										</div>
									)}
								</>
							)}
						</div>
						{children}
					</div>
				</div>
			)}
		</>
	);
};

export default Modal;
