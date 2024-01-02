import axios, { InternalAxiosRequestConfig } from 'axios';
import AuthService from '../services/AuthService';

export const API_URL = `https://trynka-backend.onrender.com/api`;

const $api = axios.create({
	withCredentials: false,
	baseURL: API_URL,
});

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = localStorage.getItem('token');
	const prolongToken = localStorage.getItem('prolong_token');

	if (token && prolongToken) {
		const decodedToken = decodeToken(token);
		const currentTime = Date.now() / 1000;
		if (decodedToken.exp && decodedToken.exp < currentTime) {
			return refreshToken(prolongToken, config);
		}
	}

	config.headers.Authorization = `Bearer ${token}`;
	return config;
});

function decodeToken(token: string) {
	try {
		const tokenPayload = token.split('.')[1];
		return JSON.parse(atob(tokenPayload));
	} catch (error) {
		console.error('Ошибка при декодировании токена:', error);
		return null;
	}
}

async function refreshToken(
	prolongToken: string,
	config: InternalAxiosRequestConfig,
) {
	try {
		const { data } = await AuthService.prolong(prolongToken);
		localStorage.setItem('token', data.access_token);
		localStorage.setItem('prolong_token', data.prolong_token);

		config.headers.Authorization = `Bearer ${data.access_token}`;

		return config;
	} catch (error) {
		console.error('Ошибка при обновлении токена:', error);
		throw error;
	}
}

export default $api;
