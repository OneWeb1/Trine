import { ProfileMeResponse } from './AdminResponse';

export interface WheelFortuneStateResponse {
	multipliers: number[];
}

export interface WheelFortuneResultResponse {
	multiplier: number;
	prize: number;
}

export interface WheelFortuneStatusResponse {
	balance: number;
	earned_from_tax: number;
}

export interface WheelFortuneHistoryResponse {
	pagination: WheelFortuneHistoryPaginationResponse;
	rotations: WheelFortuneHistoryRotationResponse[];
}

export interface WheelFortuneHistoryPaginationResponse {
	page: number;
	pages: number;
	total: number;
}

export interface WheelFortuneHistoryRotationResponse {
	id: number;
	account: ProfileMeResponse;
	balance: number;
	bid: number;
	is_premium: boolean;
	multiplier: number;
	prev_balance: number;
	prize: number;
}
