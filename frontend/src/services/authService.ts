import { api } from "../utils/api";
import { AuthResponse, LoginDto, RegisterDto } from "../types";

export const authService = {
	async login(credentials: LoginDto): Promise<AuthResponse> {
		const response = await api.post("/auth/login", credentials);
		return response.data;
	},

	async register(userData: RegisterDto): Promise<AuthResponse> {
		const response = await api.post("/auth/register", userData);
		return response.data;
	},

	logout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},

	getCurrentUser() {
		const userStr = localStorage.getItem("user");
		return userStr ? JSON.parse(userStr) : null;
	},

	getToken() {
		return localStorage.getItem("token");
	},

	setAuthData(authResponse: AuthResponse) {
		localStorage.setItem("token", authResponse.token);
		localStorage.setItem("user", JSON.stringify(authResponse.user));
	},
};
