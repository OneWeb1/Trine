import { AxiosResponse } from 'axios';
import $api from '../http';

import { PublicRoomResponse } from '../models/response/AdminResponse';

export default class GameService {
	static async joinRoom(
		id: string,
	): Promise<AxiosResponse<PublicRoomResponse>> {
		return $api.post<PublicRoomResponse>(`/room/join?id=${id}`);
	}
}
