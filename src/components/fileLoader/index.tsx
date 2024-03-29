import { FC } from 'react';
import { ExelGenerateStateResponse } from '../../models/response/AdminResponse';
import { BsFileEarmarkArrowDownFill } from 'react-icons/bs';
import styles from './fileLoader.module.scss';
import Button from '../../UI/Button';

interface FileLoaderProps {
	state: ExelGenerateStateResponse;
}

const FileLoader: FC<FileLoaderProps> = ({ state }) => {
	const downloadExelFile = () => {};

	return (
		<div className={styles.loaderWrapper}>
			<div className={styles.view}>
				<div className={styles.filename}>
					<BsFileEarmarkArrowDownFill style={{ marginRight: 10 }} />{' '}
					{state.filename?.slice(40, state.filename.length)}
				</div>
				<div className={styles.viewLoader}>
					<div className={styles.label}>Збір даних...</div>
					<div className={styles.loader}>
						<div
							style={{ width: `${state.data_gather_progress}%` }}
							className={styles.load}>
							{' '}
						</div>
					</div>
				</div>
				<div className={styles.viewLoader}>
					<div className={styles.label}>Генерація файлу...</div>
					<div className={styles.loader}>
						<div
							style={{ width: `${state.data_gather_progress * 100}%` }}
							className={styles.load}>
							{' '}
						</div>
					</div>
				</div>
				<div className={styles.buttonGroup}>
					<Button
						style={{ width: 130, height: 35, marginLeft: 'auto' }}
						className={state.done ? styles.a : styles.disabled}
						value='Завантажити'
						loading={state.done}
						onClick={() => downloadExelFile()}
					/>
				</div>
			</div>
		</div>
	);
};

export default FileLoader;
