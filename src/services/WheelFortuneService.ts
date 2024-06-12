import { AxiosResponse } from 'axios';
import {
	// WheelFortuneHistoryPaginationResponse,
	WheelFortuneHistoryResponse,
	WheelFortuneResultResponse,
	WheelFortuneStateResponse,
	WheelFortuneStatusResponse,
} from '../models/response/WheelFortuneResponse';
import $api from '../http';

export default class WheelFortuneService {
	static async getState(): Promise<AxiosResponse<WheelFortuneStateResponse>> {
		return $api.get<WheelFortuneStateResponse>('/fortune/state');
	}

	static async getResult(
		bid: number,
	): Promise<AxiosResponse<WheelFortuneResultResponse>> {
		return $api.get<WheelFortuneResultResponse>(
			`/fortune/result?bid=${bid || 20}`,
		);
	}

	static async getStatus(): Promise<AxiosResponse<WheelFortuneStatusResponse>> {
		return $api.get<WheelFortuneStatusResponse>(`/admin/fortune/status`);
	}

	static async getHistory(params: {
		page?: number;
		profileId?: number;
	}): Promise<AxiosResponse<WheelFortuneHistoryResponse>> {
		return $api.get<WheelFortuneHistoryResponse>(
			`/admin/fortune/history?page=${params.page || 1}${
				params.profileId ? `&account_id=${params.profileId}` : ''
			}`,
		);
	}
}
