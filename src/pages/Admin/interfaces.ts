export interface IPlayerRoom {
	id: number;
	nickname: string;
	cards: string[];
	cards_sum: number;
	last_bid: number;
	full_bid: number;
	avatar_id: string;
	state: string;
	last_move: string;
	last_polling_time: number;
	me: false;
	time_for_move: number;
	fight: boolean;
}

export interface IPublicRoom {
	id: string;
	players: IPlayerRoom[];
	bank: number;
	deck: string[];
	join_tax: number;
	bid: number;
	max_players: number;
	max_bid: number;
	template: boolean;
	creator_id: number;
	state: string;
	fight?: boolean;
}
