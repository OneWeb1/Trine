import { AuthResponce } from '../models/responce/AuthResponce';
import $api from '../http';
import { AxiosResponse } from 'axios';

export default class AuthService {
	static async login(formData: FormData): Promise<AxiosResponse<AuthResponce>> {
		return $api.post<AuthResponce>('/auth/signin', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static async registration(
		formData: FormData,
	): Promise<AxiosResponse<AuthResponce>> {
		return $api.post<AuthResponce>('/auth/signup', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}
	static async prolong(token: string): Promise<AxiosResponse<AuthResponce>> {
		return $api.post<AuthResponce>(
			`/auth/prolong?token=${token}`,
			// { token },
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	}
}
