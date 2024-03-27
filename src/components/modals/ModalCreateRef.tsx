import { FC, useState } from 'react';

import { setVisibleModal, setRefsUpdate } from '../../store/slices/app.slice';
import { useDispatch } from 'react-redux';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import AdminService from '../../services/AdminService';
import Modal from './Modal';

interface IModalCreateRef {
	nameValue?: string;
	effectiveLinkValue?: string;
}

const ModalCreateRef: FC<IModalCreateRef> = ({
	nameValue,
	effectiveLinkValue,
}) => {
	const dispatch = useDispatch();
	const [name, setName] = useState<string | number>(nameValue || '');
	const [effectiveLink, setEffectiveLink] = useState<string | number>(
		effectiveLinkValue || '',
	);
	const isRename = nameValue || effectiveLinkValue;

	const createRefHandler = async () => {
		if (isRename) {
			const refSettings = JSON.parse(
				localStorage.getItem('ref_settings') || '{}',
			);
			await AdminService.patchRef(refSettings.id, {
				name: String(name),
				effectiveLink: String(effectiveLink),
			})
				.then(() => {
					dispatch(setVisibleModal('h'));
					dispatch(setRefsUpdate(Math.random()));
				})
				.catch(console.log);
		} else {
			await AdminService.createRef({
				name: String(name),
				effectiveLink: String(effectiveLink),
			})
				.then(() => {
					dispatch(setVisibleModal('h'));
					dispatch(setRefsUpdate(Math.random()));
				})
				.catch(console.log);
		}
	};

	return (
		<Modal title={!isRename ? 'Створити посилання' : 'Редагувати посилання'}>
			<Input
				type='text'
				label='Назва реферального посилання'
				value={name}
				placeholder='Введіть назву посилання'
				onChange={setName}
			/>
			<Input
				type='text'
				label='Посилання на рекламного менеджера'
				value={effectiveLink}
				placeholder='Введіть текст посилання'
				onChange={setEffectiveLink}
			/>
			<div style={{ marginBottom: '10px' }}></div>
			<Button
				loading={true}
				value={!isRename ? 'Створити посилання' : 'Редагувати посилання'}
				onClick={createRefHandler}
			/>
		</Modal>
	);
};

export default ModalCreateRef;
