export interface AdminProfileResponse {
	id: number;
	nickname: string;
	avatar_id: string;
	created_at: string;
	is_admin: boolean;
	email: string;
	balance: number;
	verified: boolean;
}

export interface CreateRoomsResponse {
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
	time_for_move: number;
	fight: boolean;
}

export interface RoomsResponse {
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
	svara: boolean;
	svara_pending: boolean;
	state: string;
	time_to_start: number;
}

export interface RoomsPageDataResponse {
	pages: number;
	page: number;
	items_count: number;
	items: RoomsResponse[];
}

export interface CreatePublicRoomParams {
	name?: string;
	max_players: string;
	join_tax: string;
	max_bid: string;
}

export interface ProfileMeResponse {
	id: number;
	nickname: string;
	avatar_id: string;
	created_at: string;
	is_admin: boolean;
	email: string;
	balance: number;
	verified: false;
}

export interface ProfilesPageDataResponse {
	pages: number;
	page: number;
	items_count: number;
	items: ProfileMeResponse[];
}

export interface PlayerStatisticsResponse {
	won_times: number;
	defeat_times: number;
}

export interface RoomStatisticsResponse {
	max_bank: 0;
	total_bank: 0;
	round_count: 0;
}

export interface RoomsCountResponse {
	player_recruitment: number;
	// inactive_rooms_count: number;
	rooms_count: number;
}
