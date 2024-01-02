import {
	PublicRoomResponce,
	IPlayerRoom,
} from '../../models/responce/AdminResponce';

const resizeHandler = (
	tableRef: { current: HTMLDivElement | null },
	screenWidth: number,
) => {
	if (!tableRef.current) return;
	if (screenWidth < 900 && screenWidth > 800) {
		tableRef.current.style.transform = `scale(.7)`;
	} else if (screenWidth < 800 && screenWidth > 700) {
		tableRef.current.style.transform = `scale(.6)`;
	} else if (screenWidth < 700 && screenWidth > 600) {
		tableRef.current.style.transform = `scale(.5)`;
	} else if (screenWidth < 600 && screenWidth > 500) {
		tableRef.current.style.transform = `scale(.6) rotate(-90deg)`;
	} else if (screenWidth < 500 && screenWidth > 400) {
		tableRef.current.style.transform = `scale(.5) rotate(-90deg)`;
	} else if (screenWidth < 400 && screenWidth > 300) {
		tableRef.current.style.transform = `scale(.4) rotate(-90deg)`;
	} else if (screenWidth < 300 && screenWidth > 200) {
		tableRef.current.style.transform = `scale(.3) rotate(-90deg)`;
	} else if (screenWidth < 260 && screenWidth > 160) {
		tableRef.current.style.transform = `scale(.1) rotate(-90deg)`;
	} else if (screenWidth >= 900) {
		tableRef.current.style.transform = `scale(.8)`;
	}
};

const getIdx = (length: number): number[] => {
	const pos: { [key: number]: number[] } = {
		1: [0],
		2: [0, 6],
		3: [0, 4, 7],
		4: [0, 1, 6, 10],
		5: [0, 2, 4, 7, 10],
		6: [0, 1, 2, 4, 7, 10],
		7: [0, 1, 2, 4, 7, 9, 10],
		8: [0, 1, 2, 4, 5, 7, 9, 10],
		9: [0, 1, 2, 4, 5, 6, 7, 9, 10],
		10: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10],
		11: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	};

	return pos[length];
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

export { resizeHandler, getIdx, sortPlayerRelative };
