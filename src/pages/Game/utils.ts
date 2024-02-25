import { RefObject } from 'react';

import {
	RoomsResponse,
	IPlayerRoom,
} from '../../models/response/AdminResponse';

const assets = [
	'0',
	'6c',
	'7c',
	'8c',
	'9c',
	'10c',
	'jc',
	'qc',
	'kc',
	'ac',
	'6d',
	'7d',
	'8d',
	'9d',
	'10d',
	'jd',
	'qd',
	'kd',
	'ad',
	'6h',
	'7h',
	'8h',
	'9h',
	'10h',
	'jh',
	'qh',
	'kh',
	'ah',
	'6s',
	'7s',
	'8s',
	'9s',
	'10s',
	'js',
	'qs',
	'ks',
	'as',
	'fr',
	'fb',
];

const resizeHandler = (tableRef: RefObject<HTMLDivElement>) => {
	const landscapeTableWidth = 1000;
	const landscapeTableHeight = 530;

	const portraitTableWidth = 560;
	const portraitTableHeight = 1030;

	const table = tableRef?.current || {
		style: { transform: '' },
	};
	const isMobile = window.innerWidth <= 600 && window.innerHeight > 500;
	if (!isMobile) {
		const horZoom = window.innerWidth / landscapeTableWidth;
		const horPadding = 150 * horZoom;
		const vertPadding =
			window.innerHeight > 650
				? 260
				: window.innerHeight > 400
				? 140
				: window.innerHeight > 300
				? 90
				: window.innerHeight < 250
				? 50
				: 70;
		const maxScale = (window.innerHeight - vertPadding) / landscapeTableHeight;
		let scale =
			horZoom * landscapeTableWidth > window.innerWidth - horPadding
				? (window.innerWidth - horPadding) / landscapeTableWidth
				: window.innerHeight / landscapeTableWidth;
		scale = Math.min(maxScale, scale);

		const custDeg = '0deg';
		table.style.transform = `scale(${scale}) perspective(900px) rotateX(${custDeg})`;
	} else {
		const horZoom = window.innerWidth / portraitTableWidth;
		const vertPadding =
			window.innerHeight > 800 ? 300 : window.innerHeight > 600 ? 140 : 100;
		const horPadding = 90 * horZoom;
		const maxScale = (window.innerHeight - vertPadding) / portraitTableHeight;

		let scale =
			horZoom * portraitTableWidth > window.innerWidth - horPadding
				? (window.innerWidth - horPadding) / portraitTableWidth
				: window.innerHeight / portraitTableWidth;
		scale = Math.min(maxScale, scale);

		const custDeg = '0deg';
		table.style.transform = `scale(${scale}) perspective(900px) rotateX(${custDeg})`;
	}
};

const getRoomsIndexPosition = (length: number): number[] => {
	const position = [0, 3, 4, 2, 9, 5, 6, 3, 8, 1, 10];

	return position.slice(0, length).sort((a, b) => a - b);
};

const sortPlayerRelative = (stateRoom: RoomsResponse): IPlayerRoom[] => {
	const players = [] as IPlayerRoom[];
	let isAdd = false;
	stateRoom.players.forEach(player => {
		if (player.me) isAdd = true;
		if (isAdd) players.push({ ...player });
	});
	stateRoom.players.forEach(player => {
		if (player.me) isAdd = false;
		if (isAdd) players.push({ ...player });
	});

	return players;
};

export { assets, resizeHandler, getRoomsIndexPosition, sortPlayerRelative };
