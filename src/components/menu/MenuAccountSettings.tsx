import { FC, useRef, useState } from 'react';

import styles from './../../stylesheet/styles-components/menu/MenuAccountSettings.module.scss';

interface IMenuAccountSettings {
	x: number;
	y: number;
	changeBalance: () => void;
	removeAccount: () => void;
	hideMenu?: () => void;
}

const MenuAccountSettings: FC<IMenuAccountSettings> = ({
	x,
	y,
	changeBalance,
	removeAccount,
	hideMenu,
}) => {
	const [visible, setVisible] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	setTimeout(() => {
		if (!menuRef.current) return;
		const box = menuRef.current.getBoundingClientRect();
		const left = x - box.width + 40;
		const top = y + 50;

		menuRef.current.style.left = `${left}px`;
		menuRef.current.style.top = `${top}px`;
		setVisible(true);
	}, 0);

	return (
		<div className={styles.menuWrapper} onClick={hideMenu}>
			<div
				style={{
					opacity: (visible && 1) || 0,
				}}
				className={styles.menu}
				ref={menuRef}>
				<div className={styles.item} onClick={changeBalance}>
					Змінити баланс
				</div>
				<div className={styles.item} onClick={removeAccount}>
					Видалити аккаунт
				</div>
			</div>
		</div>
	);
};

export default MenuAccountSettings;
