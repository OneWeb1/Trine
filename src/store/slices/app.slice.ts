import { createSlice } from '@reduxjs/toolkit';
import {
	AdminProfileResponse,
	PublicRoomResponse,
} from '../../models/response/AdminResponse';

interface IMenuAccountSettingsPosition {
	x: number;
	y: number;
}

interface IVisibleStateMessage {
	visible: boolean;
	message: '';
	id: number;
}

interface IState {
	avatars: string[];
	isAuth: boolean;
	isSubmit: boolean;
	isAction: boolean;
	isPlayerResize: boolean;
	ready: boolean;
	defeat: boolean;
	visibleHeaderMenu: boolean;
	visibleBurgerMenu: boolean;
	check: { visible: boolean; id: number };
	visibleStateMessage: IVisibleStateMessage;
	gameAction: { state: string; prevState: string };
	gameState: string;
	visibleModal: string;
	gameParamId: string;
	baseIconPath: string;
	visibleMenuAccountSettings: boolean;
	balance: number;
	updateAccounts: number;
	lastPlayerNumber: number;
	updatePublicRooms: number;
	account: AdminProfileResponse;
	menuAccountSettingsPosition: IMenuAccountSettingsPosition;
	joinRoom: PublicRoomResponse;
	roomState: PublicRoomResponse;
	roomResultState: PublicRoomResponse;
}
const initialState: IState = {
	avatars: JSON.parse(localStorage.getItem('avatars') || '[]'),
	baseIconPath: 'https://trynka-backend.onrender.com',
	isAuth: (localStorage.getItem('token') && true) || false,
	isAction: JSON.parse(localStorage.getItem('isAction') || 'false'),
	isPlayerResize: false,
	isSubmit: false,
	ready: JSON.parse(localStorage.getItem('ready') || 'false'),
	defeat: false,
	check: {} as { visible: boolean; id: number },
	gameState: localStorage.getItem('game_state') || '',
	visibleStateMessage: {} as IVisibleStateMessage,
	gameAction: { state: '', prevState: '' },
	visibleModal: '',
	visibleHeaderMenu: false,
	visibleBurgerMenu: false,
	visibleMenuAccountSettings: false,
	balance: 0,
	updateAccounts: 1,
	lastPlayerNumber: 0,
	updatePublicRooms: 1,
	account:
		JSON.parse(localStorage.getItem('account') || '{}') ||
		({} as AdminProfileResponse),
	menuAccountSettingsPosition: { x: 0, y: 0 },
	joinRoom:
		JSON.parse(localStorage.getItem('joinRoom') || '{}') ||
		({} as PublicRoomResponse),
	roomState: {} as PublicRoomResponse,
	roomResultState: {} as PublicRoomResponse,
	gameParamId: '',
};

const appSlice = createSlice({
	name: 'app',
	initialState: initialState,
	reducers: {
		setAvatars(state, action) {
			state.avatars = action.payload;
		},
		setIsAuth(state, action) {
			state.isAuth = action.payload;
		},
		setIsSubmit(state, action) {
			state.isSubmit = action.payload;
		},
		setIsAction(state, action) {
			state.isAction = action.payload;
		},
		setIsPlayerResize(state, action) {
			state.isPlayerResize = action.payload;
		},
		setReady(state, action) {
			state.ready = action.payload;
			localStorage.setItem('ready', JSON.stringify(action.payload));
		},
		setDefeat(state, action) {
			state.defeat = action.payload;
		},
		setCheck(state, action) {
			state.check = action.payload;
		},
		setVisibleStateMessage(state, action) {
			state.visibleStateMessage = action.payload;
		},
		setGameAction(state, action) {
			state.gameAction = action.payload;
		},
		setGameState(state, action) {
			state.gameState = action.payload;
			localStorage.setItem('game_state', action.payload);
		},
		setVisibleModal(state, action) {
			state.visibleModal = action.payload;
		},
		setVisibleHeaderMenu(state, action) {
			state.visibleHeaderMenu = action.payload;
		},
		setVisibleBurgerMenu(state, action) {
			state.visibleBurgerMenu = action.payload;
		},
		setBalance(state, action) {
			state.balance = action.payload;
		},
		setVisibleMenuAccountSettings(state, action) {
			state.visibleMenuAccountSettings = action.payload;
		},
		setUpdateAccounts(state) {
			state.updateAccounts++;
		},
		setUpdatePublickRooms(state) {
			state.updatePublicRooms++;
		},
		setAccount(state, action) {
			state.account = action.payload;
			localStorage.setItem('account', JSON.stringify(action.payload));
		},
		setLastPlayerNumber(state, action) {
			state.lastPlayerNumber = action.payload;
		},
		setMenuAccountSettingsPosition(state, action) {
			state.menuAccountSettingsPosition = action.payload;
		},
		setJoinRoom(state, action) {
			state.joinRoom = action.payload;
		},
		setRoomState(state, action) {
			state.roomState = action.payload;
		},
		setRoomResultState(state, action) {
			state.roomResultState = action.payload;
		},
		setGameParamId(state, action) {
			state.gameParamId = action.payload;
		},
	},
});

export const {
	setAvatars,
	setVisibleModal,
	setIsSubmit,
	setIsAction,
	setIsPlayerResize,
	setReady,
	setDefeat,
	setCheck,
	setGameAction,
	setGameState,
	setVisibleStateMessage,
	setVisibleHeaderMenu,
	setVisibleBurgerMenu,
	setVisibleMenuAccountSettings,
	setMenuAccountSettingsPosition,
	setBalance,
	setAccount,
	setLastPlayerNumber,
	setUpdateAccounts,
	setUpdatePublickRooms,
	setIsAuth,
	setJoinRoom,
	setRoomState,
	setRoomResultState,
	setGameParamId,
} = appSlice.actions;

export default appSlice.reducer;
