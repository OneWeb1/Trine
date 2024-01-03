import {
	PublicRoomResponce,
	IPlayerRoom,
} from '../../models/responce/AdminResponce';

const resizeHandler = (
	tableRef: { current: HTMLDivElement | null },
	screenWidth: number,
) => {
	if (!tableRef.current) return;
	if (screenWidth < 1600 && screenWidth > 1200) {
		tableRef.current.style.transform = `scale(.85)`;
	} else if (screenWidth < 1200 && screenWidth > 1100) {
		tableRef.current.style.transform = `scale(.8)`;
	} else if (screenWidth < 1100 && screenWidth > 1000) {
		tableRef.current.style.transform = `scale(.8)`;
	} else if (screenWidth < 1000 && screenWidth > 900) {
		tableRef.current.style.transform = `scale(.48)`;
	} else if (screenWidth < 900 && screenWidth > 800) {
		tableRef.current.style.transform = `scale(.50)`;
	} else if (screenWidth < 800 && screenWidth > 700) {
		tableRef.current.style.transform = `scale(.45)`;
	} else if (screenWidth < 700 && screenWidth > 600) {
		tableRef.current.style.transform = `scale(.42)`;
	} else if (screenWidth < 600 && screenWidth > 500) {
		tableRef.current.style.transform = `scale(.35)`;
	} else if (screenWidth < 500 && screenWidth > 400) {
		tableRef.current.style.transform = `scale(.30)`;
	} else if (screenWidth < 400 && screenWidth > 300) {
		tableRef.current.style.transform = `scale(.45) rotate(-90deg)`;
	} else if (screenWidth < 300 && screenWidth > 200) {
		tableRef.current.style.transform = `scale(.20) rotate(-90deg)`;
	} else if (screenWidth < 260 && screenWidth > 160) {
		tableRef.current.style.transform = `scale(.1) rotate(-90deg)`;
	} else if (screenWidth >= 900) {
		tableRef.current.style.transform = `scale(.8)`;
	}
};

const getRoomIndexPosition = (length: number): number[] => {
	const position = [0, 7, 4, 2, 9, 5, 6, 3, 8, 1, 10];

	return position.slice(0, length);
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
