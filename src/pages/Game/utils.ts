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

const getIdx = (length: number): { pos: number[]; lastIdx: number } => {
	const pos = [0, 7, 4, 2, 9, 5, 6, 3, 8, 1, 10];
	let max = 0;
	let id = 0;
	for (let i = 0; i < length; i++) {
		if (pos[i] > max) {
			id = i;
			max = pos[i];
		}
	}
	return { pos, lastIdx: id };
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
