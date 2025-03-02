import { createSlice } from '@reduxjs/toolkit';
import {
	AdminProfileResponse,
	AdminRefsResponse,
	RoomsResponse,
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

interface IStats {
	title: string;
	values: string[];
	numbers: number[];
}

interface ITransfersData {
	label: string;
	name: string;
	link: string;
}

interface IState {
	stats: IStats;
	refs: AdminRefsResponse;
	refsUpdate: number;
	transfersData: ITransfersData;
	avatars: string[];
	isAuth: boolean;
	isRememberMe: boolean;
	isSubmit: boolean;
	isAction: boolean;
	isEnable: boolean;
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
	visibleMenuAccountSettings: string;
	balance: number;
	updateAccounts: number;
	lastPlayerNumber: number;
	updateRoom: number;
	accountsLength: number;
	refreshBottomMenu: number;
	account: AdminProfileResponse;
	menuAccountSettingsPosition: IMenuAccountSettingsPosition;
	joinRoom: RoomsResponse;
	roomState: RoomsResponse;
	roomResultState: RoomsResponse;
}

const initialState: IState = {
	stats: {} as IStats,
	refs: {} as AdminRefsResponse,
	refsUpdate: 1,
	transfersData: {
		label: 'Telegram:',
		name: '@admin',
		link: 'https://t.me/trinka_1',
	},
	avatars: JSON.parse(localStorage.getItem('avatars') || '[]'),
	baseIconPath: 'https://trine-game.online',
	isAuth: (localStorage.getItem('token') && true) || false,
	isRememberMe: JSON.parse(localStorage.getItem('isRememberMe') || 'false'),
	isAction: JSON.parse(localStorage.getItem('isAction') || 'false'),
	isEnable: true,
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
	visibleMenuAccountSettings: 'hide',
	balance: 0,
	updateAccounts: 1,
	lastPlayerNumber: 0,
	updateRoom: 1,
	refreshBottomMenu: 1,
	accountsLength: JSON.parse(localStorage.getItem('accounts-length') || '0'),
	account:
		JSON.parse(localStorage.getItem('account') || '{}') ||
		({} as AdminProfileResponse),
	menuAccountSettingsPosition: { x: 0, y: 0 },
	joinRoom:
		JSON.parse(localStorage.getItem('joinRoom') || '{}') ||
		({} as RoomsResponse),
	roomState: {} as RoomsResponse,
	roomResultState: {} as RoomsResponse,
	gameParamId: '',
};

const appSlice = createSlice({
	name: 'app',
	initialState: initialState,
	reducers: {
		setStats(state, action) {
			state.stats = action.payload;
		},
		setRefs(state, action) {
			state.refs = action.payload;
		},
		setRefsUpdate(state, action) {
			state.refsUpdate = action.payload;
		},
		setTransfersData(state, action) {
			state.transfersData = action.payload;
		},
		setAvatars(state, action) {
			state.avatars = action.payload;
		},
		setIsAuth(state, action) {
			state.isAuth = action.payload;
		},
		setIsRememberMe(state, action) {
			state.isAuth = action.payload;
		},
		setIsSubmit(state, action) {
			state.isSubmit = action.payload;
		},
		setIsAction(state, action) {
			state.isAction = action.payload;
		},
		setIsEnable(state, action) {
			state.isEnable = action.payload;
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
			state.updateRoom++;
		},
		setRefreshBottomMenu(state) {
			state.refreshBottomMenu++;
		},
		setAccountsLength(state, action) {
			state.accountsLength = action.payload;
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
	setStats,
	setRefs,
	setRefsUpdate,
	setTransfersData,
	setAvatars,
	setVisibleModal,
	setIsSubmit,
	setIsAction,
	setIsEnable,
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
	setRefreshBottomMenu,
	setAccountsLength,
	setIsAuth,
	setIsRememberMe,
	setJoinRoom,
	setRoomState,
	setRoomResultState,
	setGameParamId,
} = appSlice.actions;

export default appSlice.reducer;
