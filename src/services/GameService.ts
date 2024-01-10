import { AxiosResponse } from 'axios';
import $api from '../http';

import { RoomsResponse } from '../models/response/AdminResponse';

export default class GameService {
	static async joinRoom(id: string): Promise<AxiosResponse<RoomsResponse>> {
		return $api.post<RoomsResponse>(`/room/join?id=${id}`);
	}
}
