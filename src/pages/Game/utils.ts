import {
	PublicRoomResponce,
	IPlayerRoom,
} from '../../models/responce/AdminResponce';

const resizeHandler = (tableRef: { current: HTMLDivElement | null }) => {
	const screenWidth = window.innerWidth;

	if (!tableRef.current) return;
	let scale = 1;
	let deg = 0;

	const screens = [
		[1600, 1200, 0.85],
		[1200, 1100, 0.8],
		[1100, 1000, 0.8],
		[1000, 900, 0.48],
		[900, 800, 0.5],
		[800, 700, 0.45],
		[700, 600, 0.42],
		[600, 500, 0.35],
		[500, 400, 0.3],
		[400, 300, 0.45, -90],
		[300, 200, 0.3, -90],
		[260, 160, 0.1, -90],
	];
	screens.forEach(screen => {
		const [max, min, zoom, d] = screen;
		if (screenWidth <= max && screenWidth >= min) {
			const angle = d || 0;
			scale = zoom;
			deg = angle;
		}
	});
	tableRef.current.style.transform = `scale(${scale}) rotate(${deg}deg)`;
};

const getRoomIndexPosition = (length: number): number[] => {
	const position = [0, 7, 4, 2, 9, 5, 6, 3, 8, 1, 10];

	return position.slice(0, length).sort((a, b) => a - b);
};

const sortPlayerRelative = (stateRoom: PublicRoomResponce): IPlayerRoom[] => {
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

export { resizeHandler, getRoomIndexPosition, sortPlayerRelative };
