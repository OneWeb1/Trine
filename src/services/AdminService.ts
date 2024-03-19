import {
	AdminProfileResponse,
	CreatePublicRoomParams,
	PlayerStatisticsResponse,
	ProfileMeResponse,
	RoomsCountResponse,
	ProfilesPageDataResponse,
	RoomStatisticsResponse,
	RoomsPageDataResponse,
	RoomsResponse,
} from '../models/response/AdminResponse';
import $api from '../http';
import { AxiosResponse } from 'axios';

export default class AdminService {
	static async getProfiles(
		offset: number,
		limit: number,
	): Promise<AxiosResponse<ProfilesPageDataResponse>> {
		return $api.get<ProfilesPageDataResponse>('/admin/profile/', {
			params: { offset, limit },
		});
	}

	static async getProfileById(
		id: number,
	): Promise<AxiosResponse<AdminProfileResponse>> {
		return $api.get<AdminProfileResponse>(`/admin/profile/${id}`);
	}

	static async getRoomsCount(): Promise<AxiosResponse<RoomsCountResponse>> {
		return $api.get(`/admin/rooms-count`);
	}

	static async getPlayerStatistics(
		id: number,
	): Promise<AxiosResponse<PlayerStatisticsResponse>> {
		return $api.get(`/stat/player/${id}`);
	}

	static async getRoomStatistics(
		id: string,
	): Promise<AxiosResponse<RoomStatisticsResponse>> {
		return $api.get(`/stat/room/${id}`);
	}

	static async removeProfileById(id: number): Promise<AxiosResponse<string>> {
		return $api.delete<string>(`/admin/profile/${id}`);
	}
	static async removeRoomById(id: string): Promise<AxiosResponse<string>> {
		return $api.delete<string>(`/room/${id}?runtime=true`);
	}

	static async roomIsReady(ready: boolean): Promise<AxiosResponse<string>> {
		return $api.post<string>(`/room/ready?ready=${ready}`);
	}

	static async roomLeave(): Promise<AxiosResponse<string>> {
		return $api.post<string>(`/room/leave`);
	}

	static async getRooms({
		offset,
		limit,
	}: {
		offset: number;
		limit: number;
	}): Promise<AxiosResponse<RoomsPageDataResponse>> {
		return $api.get<RoomsPageDataResponse>(
			`/room?offset=${offset}&limit=${limit}`,
		);
	}
	static async getPublicRoomByState(
		id: string,
		isFull: boolean,
	): Promise<AxiosResponse<RoomsResponse> | null> {
		if (typeof id !== 'string') return null;
		return $api.get<RoomsResponse>(`/room/${id}`, { params: { full: isFull } });
	}

	static async getMeProfile(): Promise<AxiosResponse<ProfileMeResponse>> {
		return $api.get<ProfileMeResponse>('/profile/me');
	}

	static async getAvatars(): Promise<AxiosResponse<string[]>> {
		return $api.get<string[]>('/profile/avatars');
	}

	static async changeNickname(name: string): Promise<AxiosResponse<string>> {
		return $api.post<string>(`/profile/change_nickname?nickname=${name}`);
	}

	static async changePassword(
		formData: FormData,
	): Promise<AxiosResponse<string>> {
		return $api.post<string>(`/profile/change_password`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static async changeAvatar(id: number): Promise<AxiosResponse<string>> {
		return $api.post<string>(`/profile/change_avatar?id=${id}`);
	}

	static async changeBalance(
		id: number,
		balance: number,
	): Promise<AxiosResponse<string>> {
		return $api.post<string>(`/admin/profile/${id}/update?balance=${balance}`);
	}

	static async createPublicRoom(
		params: CreatePublicRoomParams,
	): Promise<AxiosResponse<RoomsResponse>> {
		const nameInUrl = `/room/create?max_players=${params.max_players}&join_tax=${params.join_tax}&max_bid=${params.max_bid}&name=${params.name}`;
		const nameNotUrl = `/room/create?max_players=${params.max_players}&join_tax=${params.join_tax}&max_bid=${params.max_bid}`;
		const url = (params.name && nameInUrl) || nameNotUrl;
		return $api.post<RoomsResponse>(url);
	}

	static async do(params: {
		action: string;
		sum?: number;
	}): Promise<AxiosResponse<RoomsResponse>> {
		const query =
			(params.action === 'raise' && {
				params: { sum: params.sum },
			}) ||
			{};
		return $api.post<RoomsResponse>(`/room/do/${params.action}`, null, query);
	}
}
