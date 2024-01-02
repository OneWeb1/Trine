export interface AdminProfileResponce {
	id: number;
	nickname: string;
	avatar_id: string;
	created_at: string;
	is_admin: boolean;
	email: string;
	balance: number;
	verified: boolean;
}

export interface CreatePublicRoomResponce {
	name?: string;
	max_players: number;
	join_tax: number;
	max_bid: number;
}

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
}

export interface PublicRoomResponce {
	name: string;
	id: string;
	tax: number;
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
}

export interface CreatePublicRoomParams {
	name?: string;
	max_players: string;
	join_tax: string;
	max_bid: string;
}

export interface ProfileMeResponce {
	id: number;
	nickname: string;
	avatar_id: string;
	created_at: string;
	is_admin: boolean;
	email: string;
	balance: number;
	verified: false;
}
