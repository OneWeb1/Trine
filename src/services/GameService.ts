import { AxiosResponse } from 'axios';
import $api from '../http';

import { PublicRoomResponce } from '../models/responce/AdminResponce';

export default class GameService {
	static async joinRoom(
		id: string,
	): Promise<AxiosResponse<PublicRoomResponce>> {
		return $api.post<PublicRoomResponce>(`/room/join?id=${id}`);
	}
}
