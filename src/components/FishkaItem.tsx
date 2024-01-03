import { FC } from 'react';

import classNames from 'classnames';

import fishka from './../../public/assets/fishka.png';

import styles from './../stylesheet/styles-components/FishkaItem.module.scss';

interface IFishkaItem {
	value: number;
	isPlayer?: boolean;
}

const FishkaItem: FC<IFishkaItem> = ({ isPlayer, value }) => {
	return (
		<div
			style={{ marginLeft: (!isPlayer && '7px') || '0px' }}
			className={classNames(styles.display, isPlayer && styles.player)}>
			<img className={styles.fishka} src={fishka} alt='fishka' />
			{value}
		</div>
	);
};

export default FishkaItem;
