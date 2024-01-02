import { createSlice } from '@reduxjs/toolkit';
import {
	AdminProfileResponce,
	PublicRoomResponce,
} from '../../models/responce/AdminResponce';

interface IMenuAccountSettingsPosition {
	x: number;
	y: number;
}

interface IVisibleStateMessage {
	visible: boolean;
	id: number;
}

interface IState {
	isAuth: boolean;
	isSubmit: boolean;
	ready: boolean;
	defeat: boolean;
	visibleHeaderMenu: boolean;
	check: { visible: boolean; id: number };
	visibleStateMessage: IVisibleStateMessage;
	gameOverAction: { state: string };
	gameState: string;
	visibleModal: string;
	gameParamId: string;
	baseIconPath: string;
	visibleMenuAccountSettings: boolean;
	updateAccounts: number;
	lastPlayerNumber: number;
	updatePublicRooms: number;
	account: AdminProfileResponce;
	menuAccountSettingsPosition: IMenuAccountSettingsPosition;
	joinRoom: PublicRoomResponce;
	roomState: PublicRoomResponce;
}
const initialState: IState = {
	baseIconPath: 'https://trynka-backend.onrender.com',
	isAuth: (localStorage.getItem('token') && true) || false,
	isSubmit: false,
	ready: JSON.parse(localStorage.getItem('ready') || 'false'),
	defeat: false,
	check: {} as { visible: boolean; id: number },
	gameState: localStorage.getItem('game_state') || '',
	visibleStateMessage: {} as IVisibleStateMessage,
	gameOverAction: {} as { state: string },
	visibleModal: '',
	visibleHeaderMenu: false,
	visibleMenuAccountSettings: false,
	updateAccounts: 1,
	lastPlayerNumber: 0,
	updatePublicRooms: 1,
	account:
		JSON.parse(localStorage.getItem('account') || '{}') ||
		({} as AdminProfileResponce),
	menuAccountSettingsPosition: { x: 0, y: 0 },
	joinRoom:
		JSON.parse(localStorage.getItem('joinRoom') || '{}') ||
		({} as PublicRoomResponce),
	roomState: {} as PublicRoomResponce,
	gameParamId: '',
};

const appSlice = createSlice({
	name: 'app',
	initialState: initialState,
	reducers: {
		setIsAuth(state, action) {
			state.isAuth = action.payload;
		},
		setIsSubmit(state, action) {
			state.isSubmit = action.payload;
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
		setGameOverAction(state, action) {
			state.gameOverAction = action.payload;
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
		setGameParamId(state, action) {
			state.gameParamId = action.payload;
		},
	},
});

export const {
	setVisibleModal,
	setIsSubmit,
	setReady,
	setDefeat,
	setCheck,
	setGameOverAction,
	setGameState,
	setVisibleStateMessage,
	setVisibleHeaderMenu,
	setVisibleMenuAccountSettings,
	setMenuAccountSettingsPosition,
	setAccount,
	setLastPlayerNumber,
	setUpdateAccounts,
	setUpdatePublickRooms,
	setIsAuth,
	setJoinRoom,
	setRoomState,
	setGameParamId,
} = appSlice.actions;

export default appSlice.reducer;
