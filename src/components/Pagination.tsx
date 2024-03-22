import React, {
	FC,
	useState,
	useEffect,
	CSSProperties,
	ReactNode,
} from 'react';

import classNames from 'classnames';

import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

import styles from './../stylesheet/styles-components/Pagination.module.scss';

interface IPagination {
	numbers: number;
	workPages: number;
	current?: number;
	changePage?: (pageNumber: number) => void;
}

interface IButton {
	style?: CSSProperties;
	className: string;
	workPages: number;
	children: ReactNode;
	onClick: () => void;
}

const Button: FC<IButton> = ({
	style,
	className,
	workPages,
	children,
	onClick,
}) => {
	if (!children) return;
	const disabled = Number(children) > workPages;
	return (
		<div
			style={style}
			className={classNames(className, disabled && styles.disabled)}
			onClick={() => (!disabled && onClick()) || false}>
			{children}
		</div>
	);
};

const Pagination: FC<IPagination> = ({
	numbers,
	workPages,
	current,
	changePage,
}) => {
	const buttons = new Array(numbers).fill(1).map((_, idx) => idx + 1);

	const [currentPageNumber, setCurrentPageNumber] = useState<number>(
		current || 1,
	);
	const [fixVisibleNumber] = useState<number>(5);
	const [minNumber, setMinNumber] = useState<number>(2);
	const [maxNumber, setMaxNumber] = useState<number>(fixVisibleNumber);

	const [visibleButtons, setVisibleButtons] = useState(
		buttons.slice(minNumber - 1, maxNumber),
	);
	const minCount = 3;
	const left = fixVisibleNumber - minCount;
	const right = fixVisibleNumber - minCount - 1;

	const isDal = currentPageNumber === 1;
	const isDar = currentPageNumber === numbers || currentPageNumber >= workPages;

	const changePageNumber = (pageNumber: number) => {
		setCurrentPageNumber(pageNumber);
		if (changePage) changePage(pageNumber);
		if (pageNumber === numbers) {
			setMinNumber(numbers - fixVisibleNumber);
			setMaxNumber(numbers - 1);
			setVisibleButtons(buttons.slice(numbers - fixVisibleNumber, numbers - 1));
		}
		if (pageNumber === 1) {
			setMinNumber(1);
			setMaxNumber(fixVisibleNumber);
			setVisibleButtons(buttons.slice(1, fixVisibleNumber));
		}
		if (
			pageNumber >= fixVisibleNumber &&
			pageNumber <= numbers - fixVisibleNumber + 1
		) {
			setMinNumber(pageNumber - 2);
			setMaxNumber(pageNumber + 2);
			setVisibleButtons(buttons.slice(pageNumber - left, pageNumber + right));
		} else if (pageNumber < fixVisibleNumber) {
			setMinNumber(1);
			setMaxNumber(fixVisibleNumber);
			setVisibleButtons(buttons.slice(1, fixVisibleNumber));
		} else if (pageNumber > numbers - fixVisibleNumber + 1) {
			setMinNumber(numbers - fixVisibleNumber);
			setMaxNumber(numbers - 1);

			setVisibleButtons(buttons.slice(numbers - fixVisibleNumber, numbers - 1));
		}
	};

	const movePageNumber = (n: number) => {
		if (n === 1 && currentPageNumber >= workPages) return;
		if (currentPageNumber <= minNumber && n === -1) return;
		if (currentPageNumber > maxNumber && n === 1) return;

		setCurrentPageNumber(currentPageNumber + n);
		changePageNumber(currentPageNumber + n);
	};

	useEffect(() => {
		changePageNumber(currentPageNumber);
		movePageNumber(currentPageNumber - 1);
		movePageNumber(currentPageNumber);
		changePageNumber(currentPageNumber);
	}, []);

	return (
		<div key={Math.random()} className={styles.paginationWrapper}>
			<div
				style={{
					cursor: (isDal && 'not-allowed') || 'pointer',
					opacity: isDal ? 0.5 : 1,
				}}
				className={styles.button}
				onClick={() => movePageNumber(-1)}>
				<IoIosArrowBack />
			</div>
			{visibleButtons.map((number, idx) => (
				<React.Fragment key={idx}>
					{idx === 0 && (
						<React.Fragment key={idx}>
							<Button
								className={classNames(
									styles.button,
									currentPageNumber === 1 && styles.activeButton,
								)}
								workPages={workPages}
								onClick={() => changePageNumber(1)}>
								{1}
							</Button>

							{(currentPageNumber > numbers - fixVisibleNumber + 1 ||
								currentPageNumber >= fixVisibleNumber) && (
								<div className={classNames(styles.button, styles.buttonDots)}>
									...
								</div>
							)}
						</React.Fragment>
					)}

					<Button
						className={classNames(
							styles.button,
							currentPageNumber === number && styles.activeButton,
						)}
						workPages={workPages}
						onClick={() => changePageNumber(number)}>
						{number}
					</Button>

					{idx === visibleButtons.length - 1 &&
						(currentPageNumber < 5 ||
							currentPageNumber <= numbers - fixVisibleNumber + 1) && (
							<div className={classNames(styles.button, styles.buttonDots)}>
								...
							</div>
						)}

					{idx === visibleButtons.length - 1 && (
						<Button
							className={classNames(
								styles.button,
								currentPageNumber === buttons[buttons.length - 1] &&
									styles.activeButton,
							)}
							workPages={workPages}
							onClick={() => changePageNumber(buttons[buttons.length - 1])}>
							{buttons[buttons.length - 1]}
						</Button>
					)}
				</React.Fragment>
			))}
			<Button
				style={{
					cursor: (isDar && 'not-allowed') || 'pointer',
					opacity: isDar ? 0.5 : 1,
				}}
				className={styles.button}
				workPages={workPages}
				onClick={() => movePageNumber(1)}>
				<IoIosArrowForward />
			</Button>
		</div>
	);
};

export default Pagination;
