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
			window.innerHeight > 800 ? 400 : window.innerHeight > 600 ? 300 : 250;
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
		const vertZoom = window.innerHeight / landscapeTableHeight;
		const vertPadding =
			window.innerHeight > 800 ? 300 : window.innerHeight > 600 ? 180 : 250;
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

	// const screens = [
	// 	[1600, 1200, 0.85],
	// 	[1200, 1100, 0.8],
	// 	[1100, 1000, 0.8],
	// 	[1000, 900, 0.55],
	// 	[900, 800, 0.5],
	// 	[800, 700, 0.45],
	// 	[700, 600, 0.42],
	// 	[600, 500, 0.5],
	// 	[500, 400, 0.5],
	// 	[400, 300, 0.5],
	// 	[300, 200, 0.38],
	// 	[260, 160, 0.34],
	// ];
	// let deg = 0;
	// if (deg) deg * deg;
	// screens.forEach(screen => {
	// 	const [max, min, zoom, d] = screen;
	// 	if (screenWidth <= max && screenWidth >= min) {
	// 		const angle = d || 0;
	// 		scale = zoom;
	// 		deg = angle;
	// 	}
	// });

	// if (screenWidth <= 600 && window.innerHeight < 670) {
	// 	table.style.transform = `scale(${0.35}) perspective(900px) rotateX(${custDeg})`;
	// } else if (screenWidth <= 600 && window.innerHeight < 750) {
	// 	table.style.transform = `scale(${0.45}) perspective(900px) rotateX(${custDeg})`;
	// } else if (window.innerHeight < 300 && window.innerWidth > 700) {
	// 	table.style.transform = `scale(${0.32}) perspective(900px) rotateX(${custDeg}) translateY(-121px)`;
	// } else if (window.innerHeight < 301 && window.innerWidth < 700) {
	// 	table.style.transform = `scale(${0.32}) perspective(900px) rotateX(${custDeg}) translateY(0px)`;
	// } else if (window.innerHeight < 420 && window.innerHeight < 1200) {
	// 	table.style.transform = `scale(${0.45}) perspective(900px) rotateX(${custDeg})`;
	// } else
	// 	table.style.transform = `scale(${scale}) perspective(900px) rotateX(${custDeg})`;
};

const getRoomsIndexPosition = (length: number): number[] => {
	const position = [0, 7, 4, 2, 9, 5, 6, 3, 8, 1, 10];

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
