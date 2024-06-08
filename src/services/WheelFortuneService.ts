import { AxiosResponse } from 'axios';
import {
	WheelFortuneResultResponse,
	WheelFortuneStateResponse,
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
}
