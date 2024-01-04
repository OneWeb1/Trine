import { CSSProperties, FC } from 'react';

import styles from './../../stylesheet/styles-components/cards/TreeCards.module.scss';
// import Spinner from '../spinner';

interface ITreeCards {
	cards: string[];
	red?: boolean;
	blue?: boolean;
	visible?: boolean;
	style?: CSSProperties;
}

const TreeCards: FC<ITreeCards> = ({ cards, visible, style }) => {
	const type = (cards?.length === 3 && 'svg') || 'jpg';
	const cardsItem = cards && cards.length ? cards : ['fb', 'fb', 'fb'];

	const baseCardsUrl = './assets/cards';

	const cssStyle = (style && { ...style, opacity: (visible && 1) || 0 }) || {
		...style,
		opacity: (visible && 1) || 0,
	};

	return (
		<div style={cssStyle} className={styles.cardsWrapper}>
			<img
				className={styles.card}
				src={`${baseCardsUrl}/${cardsItem[0]}.${type}`}
				alt='card'
			/>
			<img
				className={styles.card}
				src={`${baseCardsUrl}/${cardsItem[1]}.${type}`}
				alt='card'
			/>
			<img
				className={styles.card}
				src={`${baseCardsUrl}/${cardsItem[2]}.${type}`}
				alt='card'
			/>
		</div>
	);
};

export default TreeCards;
