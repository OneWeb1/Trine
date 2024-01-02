export interface IPlayer {
	name: string;
	avatar: string;
}

export interface IRoomData {
	name: string;
	startBet: number;
	playersLength: number;
	playersLengthMax: number;
	players: IPlayer[];
}

export interface IRooms {
	private: IRoomData[];
	public: IRoomData[];
}
