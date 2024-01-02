import {
	AdminProfileResponce,
	CreatePublicRoomParams,
	ProfileMeResponce,
	PublicRoomResponce,
} from '../models/responce/AdminResponce';
import $api from '../http';
import { AxiosResponse } from 'axios';

export default class AdminService {
	static async getProfiles(
		offset: number,
		limit: number,
	): Promise<AxiosResponse<AdminProfileResponce[]>> {
		return $api.get<AdminProfileResponce[]>('/admin/profile/', {
			params: { offset, limit },
		});
	}

	static async getProfileById(
		id: string,
	): Promise<AxiosResponse<AdminProfileResponce>> {
		return $api.get<AdminProfileResponce>(`/admin/profile/${id}`, {
			params: { id },
		});
	}

	static async removeProfileById(id: number): Promise<AxiosResponse<string>> {
		return $api.delete<string>(`/admin/profile/${id}`);
	}
	static async removeRoomById(id: string): Promise<AxiosResponse<string>> {
		return $api.delete<string>(`/room/${id}`);
	}

	static async roomIsReady(ready: boolean): Promise<AxiosResponse<string>> {
		return $api.post<string>(`/room/ready?ready=${ready}`);
	}

	static async getPublicRooms(): Promise<AxiosResponse<PublicRoomResponce[]>> {
		return $api.get<PublicRoomResponce[]>('/room/');
	}
	static async getPublicRoomByState(
		id: string,
	): Promise<AxiosResponse<PublicRoomResponce> | null> {
		if (typeof id !== 'string') return null;
		return $api.get<PublicRoomResponce>(`/room/${id}`);
	}

	static async getMeProfile(): Promise<AxiosResponse<ProfileMeResponce>> {
		return $api.get<ProfileMeResponce>('/profile/me');
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
	): Promise<AxiosResponse<PublicRoomResponce>> {
		const nameInUrl = `/room/create?max_players=${params.max_players}&join_tax=${params.join_tax}&max_bid=${params.max_bid}&name=${params.name}`;
		const nameNotUrl = `/room/create?max_players=${params.max_players}&join_tax=${params.join_tax}&max_bid=${params.max_bid}`;
		const url = (params.name && nameInUrl) || nameNotUrl;
		return $api.post<PublicRoomResponce>(url);
	}

	static async do(params: {
		action: string;
		sum?: number;
	}): Promise<AxiosResponse<PublicRoomResponce>> {
		const query =
			(params.action === 'raise' && {
				params: { sum: params.sum },
			}) ||
			{};
		return $api.post<PublicRoomResponce>(
			`/room/do/${params.action}`,
			null,
			query,
		);
	}
}
