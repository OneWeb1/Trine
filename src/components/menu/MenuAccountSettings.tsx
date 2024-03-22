import { FC, useEffect, useRef, useState } from 'react';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useSelector } from 'react-redux';

import styles from './../../stylesheet/styles-components/menu/MenuAccountSettings.module.scss';
import AdminService from '../../services/AdminService';
import { ProfileMeResponse } from '../../models/response/AdminResponse';

interface IMenuAccountSettings {
	x: number;
	y: number;
	values: string[];
	handlers: Array<() => void>;
	isAccounts: boolean;
	hideMenu?: () => void;
}

const MenuAccountSettings: FC<IMenuAccountSettings> = ({
	x,
	y,
	values,
	handlers,
	isAccounts,
	hideMenu,
}) => {
	const { account } = useSelector((state: CustomRootState) => state.app);
	const [settingsProfile] = useState<ProfileMeResponse>(
		JSON.parse(localStorage.getItem('account_settings') || '{}'),
	);
	const [isAdmin, setIsAdmin] = useState<boolean>(
		settingsProfile.is_super_admin || settingsProfile.is_admin,
	);
	const [visible, setVisible] = useState<boolean>(false);
	const [offset] = useState<number>(
		isAccounts && account.is_super_admin ? 1 : 0,
	);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const giveAdminHandler = async () => {
		if (account.id === settingsProfile.id) return;
		await AdminService.giveAdmin(settingsProfile.id, !settingsProfile.is_admin)
			.then(() => {
				setIsAdmin(!settingsProfile.is_admin);
				location.reload();
			})
			.catch(e => console.log(e));
	};

	setTimeout(() => {
		if (!menuRef.current) return;
		const box = menuRef.current.getBoundingClientRect();
		const left = x - box.width + 40;
		let top = y + 50;

		if (top + box.height > window.innerHeight) {
			top = y - box.height - 5;
		}

		menuRef.current.style.left = `${left}px`;
		menuRef.current.style.top = `${top}px`;
		setVisible(true);
	}, 0);

	useEffect(() => {
		document.body.style.overflowY = 'hidden';

		return () => {
			document.body.style.overflowY = 'scroll';
		};
	}, [visible]);

	return (
		<div className={styles.menuWrapper} onClick={hideMenu}>
			<div
				style={{
					opacity: (visible && 1) || 0,
					height: (offset + values.length) * 35 + 20 + values.length * 5 - 5,
				}}
				className={styles.menu}
				ref={menuRef}>
				{isAccounts && account.is_super_admin && (
					<div className={styles.item} onClick={giveAdminHandler}>
						<div>Адміністратор</div>
						<div className={styles.check}>
							{isAdmin && <div className={styles.checked}></div>}
						</div>
					</div>
				)}

				{values.map((value, idx) => (
					<div key={idx} className={styles.item} onClick={handlers[idx]}>
						{value}
					</div>
				))}
			</div>
		</div>
	);
};

export default MenuAccountSettings;
