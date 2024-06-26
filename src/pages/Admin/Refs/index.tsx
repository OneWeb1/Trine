import { FC, useState, useEffect, useRef } from 'react';
import { RootState as CustomRootState } from '../../../store/rootReducer';
import {
	setRefs,
	setVisibleModal,
	setRefsUpdate,
	setVisibleMenuAccountSettings,
} from '../../../store/slices/app.slice';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineSettingsEthernet } from 'react-icons/md';
import { CgSoftwareDownload } from 'react-icons/cg';

import Button from '../../../UI/Button';

import styles from './../styles/Refs.module.scss';

import InputSearch from '../../../UI/InputSearch';
// import Spinner from '../../../components/spinner';
import Ref from './components/Ref';
import Pagination from '../../../components/Pagination';
import AdminService from '../../../services/AdminService';
import MenuAccountSettings from '../../../components/menu/MenuAccountSettings';
import {
	AdminRefResponse,
	ExelGenerateStateResponse,
} from '../../../models/response/AdminResponse';
import FileLoader from '../../../components/fileLoader';
// import { AuthResponse } from '../../../models/response/AuthResponse';
import Spinner from '../../../components/spinner';

const Refs: FC = () => {
	const dispatch = useDispatch();
	const {
		refs,
		refsUpdate,
		visibleMenuAccountSettings,
		menuAccountSettingsPosition: menuPosition,
	} = useSelector((state: CustomRootState) => state.app);

	const [searchName, setSearchName] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [downloadFileState, setDownloadFileState] =
		useState<ExelGenerateStateResponse>({} as ExelGenerateStateResponse);
	const [isVisibleGenerateFile, setIsVisibleGenerateFile] =
		useState<boolean>(false);
	const refTimeoutId = useRef<number>(0);

	// const [isLoading, setIsLoading] = useState<boolean>(false);

	const visibleCreateRefHandler = (isClear: boolean) => {
		if (isClear) localStorage.removeItem('ref_settings');
		dispatch(setVisibleModal('crr'));
	};

	const hideMenu = () => {
		dispatch(setVisibleMenuAccountSettings('hide'));
	};

	const copyLinkFile = () => {
		if (navigator.clipboard) {
			const refSettings: AdminRefResponse = JSON.parse(
				localStorage.getItem('ref_settings') || '{}',
			);
			navigator.clipboard
				.writeText(refSettings.fileLink)
				.then(() => {
					console.log('Посилання скопіїовано');
				})
				.catch(err => {
					console.error('Помилка при копіюванні:', err);
				});
		} else {
			console.error('Браузер не підтримує API Clipboard');
		}
	};

	const copyLink = () => {
		if (navigator.clipboard) {
			const refSettings: AdminRefResponse = JSON.parse(
				localStorage.getItem('ref_settings') || '{}',
			);
			navigator.clipboard
				.writeText(refSettings.refLink)
				.then(() => {
					console.log('Текст скопіїовано');
				})
				.catch(err => {
					console.error('Помилка при копіюванні:', err);
				});
		} else {
			console.error('Браузер не підтримує API Clipboard');
		}
	};

	const editLink = () => {
		visibleCreateRefHandler(false);
	};

	const downloadExelFile = async () => {
		setIsVisibleGenerateFile(true);
		try {
			const createResponse = await AdminService.createExelFile();
			getStateExelFile(createResponse.data.filename);
		} catch (error) {
			console.error('Ошибка при загрузке файла:', error);
		}
	};

	const getStateExelFile = (filename: string) => {
		const intervalId = setInterval(async () => {
			try {
				const stateResponse = await AdminService.getStateExelFile();
				if (!stateResponse.data.done) {
					setDownloadFileState(stateResponse.data);
				} else {
					setDownloadFileState(stateResponse.data);
					clearInterval(intervalId);

					try {
						const downloadResponse = await AdminService.downloadExelFile(
							filename,
						);
						const url = window.URL.createObjectURL(
							new Blob([downloadResponse.data]),
						);
						const link = document.createElement('a');
						link.href = url;
						link.setAttribute('download', filename);
						document.body.appendChild(link);
						link.click();
						setIsVisibleGenerateFile(false);
					} catch (e) {
						console.log(e);
					}
				}
			} catch (e) {
				console.log(e);
			}
		}, 100);
	};

	const deleteLink = async () => {
		const refSettings: AdminRefResponse = JSON.parse(
			localStorage.getItem('ref_settings') || '{}',
		);
		await AdminService.removeRef(refSettings.id);
		dispatch(setRefsUpdate(Math.random()));
	};

	const changePage = (pageNumber: number) => {
		const lsPage = Number(localStorage.getItem('refs-page'));

		if (lsPage === pageNumber) return;
		getRefs('', 8, pageNumber - 1);
		localStorage.setItem('refs-page', JSON.stringify(pageNumber));
		localStorage.setItem('refs-pages', JSON.stringify(refs.pages));
		localStorage.setItem('refs-page-save', JSON.stringify(refs.page));
	};

	const getRefs = async (query: string, pages: number, page: number) => {
		await AdminService.searchRef(query, pages, page)
			.then(response => {
				const { pages, page, items_count, items } = response.data;
				dispatch(setRefs({ pages, page, items_count, items }));
				setLoading(true);
			})
			.catch(console.log);
	};

	useEffect(() => {
		clearTimeout(refTimeoutId.current);
		refTimeoutId.current = setTimeout(async () => {
			getRefs(searchName, 8, Number(localStorage.getItem('refs-page')) - 1);
		}, 300);
	}, [searchName]);

	useEffect(() => {
		getRefs('', 8, Number(localStorage.getItem('refs-page')) - 1);
	}, [refsUpdate]);

	return (
		<>
			<div className={styles.tableWrapper}>
				<div className={styles.header}>
					<div
						className={styles.title}
						style={{
							marginRight: '20px',
							fontSize: window.innerWidth < 600 ? '12px' : '18px',
						}}>
						Рефералки
					</div>

					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}>
						<InputSearch
							value={searchName}
							placeholder='Пошук по імені посилання'
							onChange={setSearchName}
						/>
						<Button
							style={{
								width: '100px',
								height: '35px',
								fontSize: '12px',
								marginLeft: '10px',
								padding: '0px 10px',
							}}
							value='Створити'
							noLoading={true}
							onClick={() => visibleCreateRefHandler(true)}
						/>
						<Button
							style={{
								minWidth: '35px',
								width: '35px',
								height: '35px',
								fontSize: '20px',
								marginLeft: '10px',
								background: 'green',
							}}
							noLoading={true}
							onClick={() => downloadExelFile()}>
							<CgSoftwareDownload />
						</Button>
					</div>
				</div>
				<div
					className={styles.tableHeader}
					style={{
						background: 'rgba(255, 255, 255, 0.04)',
						marginBottom: '10px',
						borderRadius: '10px',
					}}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div className={styles.idColumn}>ID</div>
						<div className={styles.name}>Ім'я</div>
					</div>
					<div className={styles.rightWrapper}>
						<div className={styles.link}>Посилання</div>
						<div style={{ display: 'flex' }}>
							{window.innerWidth > 550 && (
								<div className={styles.telegram}>Зв'язок</div>
							)}

							<div className={styles.iconWrapper}>
								<MdOutlineSettingsEthernet />
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className={styles.tableItems}>
						{!loading && (
							<div className={styles.flexCenter}>
								<Spinner />
							</div>
						)}

						{loading && refs.items.map(ref => <Ref item={ref} />)}

						{!refs.items?.length && (
							<div
								style={{ display: !loading ? 'none' : 'flex' }}
								className={styles.flexCenter}>
								Посилань з такою назвою не знайдено
							</div>
						)}
					</div>

					<div style={{ padding: '0px 10px', paddingTop: '10px' }}>
						<Pagination
							numbers={refs.pages > 10 ? refs.pages : 10}
							workPages={!refs.pages ? 1 : refs.pages}
							current={JSON.parse(localStorage.getItem('refs-page') || '0')}
							changePage={changePage}
						/>
					</div>
				</div>
			</div>
			{visibleMenuAccountSettings === 'account-settings' && (
				<MenuAccountSettings
					style={{ minWidth: '200px' }}
					x={menuPosition.x}
					y={menuPosition.y}
					values={[
						'Реферальне посилання',
						'Посилання до файлу',
						'Редагувати посилання',
						'Видалити посилання',
					]}
					handlers={[copyLink, copyLinkFile, editLink, deleteLink]}
					isAccounts={false}
					hideMenu={hideMenu}
				/>
			)}
			{isVisibleGenerateFile && <FileLoader state={downloadFileState} />}
		</>
	);
};

export default Refs;
