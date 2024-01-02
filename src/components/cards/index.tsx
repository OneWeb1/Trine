import { CSSProperties, FC, useEffect, useState } from 'react';

import styles from './../../stylesheet/styles-components/cards/TreeCards.module.scss';
// import Spinner from '../spinner';

interface ITreeCards {
	cards: string[];
	red?: boolean;
	blue?: boolean;
	style?: CSSProperties;
}

const TreeCards: FC<ITreeCards> = ({ cards, style }) => {
	const [visible, setVisible] = useState<boolean>(false);

	const baseCardsUrl = './assets/cards';

	const cssStyle = (style && { ...style, opacity: (visible && 1) || 0 }) || {
		...style,
		opacity: (visible && 1) || 0,
	};

	useEffect(() => {
		setTimeout(() => {
			setVisible(true);
		}, 1000);
	}, []);

	return (
		<div style={cssStyle} className={styles.cardsWrapper}>
			<img
				className={styles.card}
				src={`${baseCardsUrl}/${cards[0]}.svg`}
				alt='card'
			/>
			<img
				className={styles.card}
				src={`${baseCardsUrl}/${cards[1]}.svg`}
				alt='card'
			/>
			<img
				className={styles.card}
				src={`${baseCardsUrl}/${cards[2]}.svg`}
				alt='card'
			/>
		</div>
	);
};

export default TreeCards;
