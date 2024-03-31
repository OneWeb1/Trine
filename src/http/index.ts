import axios, {
	AxiosError,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';
import AuthService from '../services/AuthService';

export const API_URL = `https://trine-game.online/api`;

const $api = axios.create({
	withCredentials: false,
	baseURL: API_URL,
});

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
	return config;
});

$api.interceptors.response.use(
	(config: AxiosResponse) => {
		return config;
	},
	async error => {
		const originRequest = error.config;

		if (
			error.response?.status === 401 &&
			originRequest &&
			!originRequest._isRetry
		) {
			originRequest._isRetry = true;
			try {
				const prolongToken = localStorage.getItem('prolong_token');
				const isRememberMe = JSON.parse(
					localStorage.getItem('isRememberMe') || 'false',
				);
				if (!isRememberMe) {
					logout();
				}
				try {
					const { data } = await AuthService.prolong(String(prolongToken));
					localStorage.setItem('token', data.access_token);
					localStorage.setItem('prolong_token', data.prolong_token);
				} catch (e) {
					if (e instanceof AxiosError && e.response?.status === 403) {
						logout();
					}
				}

				if (!originRequest._retryCount) {
					originRequest._retryCount = 1;
				} else {
					originRequest._retryCount++;
				}
				if (originRequest._retryCount <= 5) {
					return $api.request(originRequest);
				} else {
					throw new Error('Використано максимальну кількість спроб');
				}
			} catch (e) {
				console.error(e);
				throw e;
			}
		}
		throw error;
	},
);

function logout() {
	localStorage.removeItem('token');
	localStorage.removeItem('prolong_token');
	window.location.href = '/login';
}

export default $api;
