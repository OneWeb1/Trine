import { FC, useRef, useState } from 'react';

import styles from './../../stylesheet/styles-components/menu/MenuAccountSettings.module.scss';

interface IMenuAccountSettings {
	x: number;
	y: number;
	values: string[];
	handlers: Array<() => void>;
	hideMenu?: () => void;
}

const MenuAccountSettings: FC<IMenuAccountSettings> = ({
	x,
	y,
	values,
	handlers,
	hideMenu,
}) => {
	const [visible, setVisible] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

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

	return (
		<div className={styles.menuWrapper} onClick={hideMenu}>
			<div
				style={{
					opacity: (visible && 1) || 0,
					height: values.length * 35 + 20 + values.length * 5 - 5,
				}}
				className={styles.menu}
				ref={menuRef}>
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
