import { CSSProperties, FC, useState } from 'react';

import styles from './../../stylesheet/styles-components/cards/TreeCards.module.scss';
// import Spinner from '../spinner';

interface ITreeCards {
	cards: string[];
	number?: number;
	red?: boolean;
	blue?: boolean;
	visible?: boolean;
	style?: CSSProperties;
}

const TreeCards: FC<ITreeCards> = ({ cards, number, visible, style }) => {
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const type = (cards?.length === 3 && 'svg') || 'jpg';
	const cardsItem = cards && cards.length ? cards : ['fb', 'fb', 'fb'];

	const baseCardsUrl = './assets/cards';

	const cssStyle = (style && {
		...style,
		opacity: ((visible || visible === undefined) && 1) || 0,
	}) || {
		...style,
		opacity: (visible && 1) || 0,
	};

	const loadImage = () => {
		setIsLoaded(true);
	};

	return (
		<div style={cssStyle} className={styles.cardsWrapper} onLoad={loadImage}>
			<div
				style={{ opacity: (number && 1) || 0 }}
				className={styles.cardsNumber}>
				{number}
			</div>
			<div style={{ display: isLoaded ? 'flex' : 'none', marginLeft: '-50px' }}>
				<img
					style={{ transform: 'rotate(-5deg)', zIndex: 0 }}
					className={styles.card}
					src={`${baseCardsUrl}/${cardsItem[0]}.${type}`}
					alt='card'
				/>
				<img
					style={{ transform: 'translateY(-2px)', zIndex: 1 }}
					className={styles.card}
					src={`${baseCardsUrl}/${cardsItem[1]}.${type}`}
					alt='card'
				/>
				<img
					style={{ transform: 'rotate(5deg)', zIndex: 2 }}
					className={styles.card}
					src={`${baseCardsUrl}/${cardsItem[2]}.${type}`}
					alt='card'
				/>
			</div>
		</div>
	);
};

export default TreeCards;
