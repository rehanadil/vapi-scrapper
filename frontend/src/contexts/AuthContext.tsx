import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (user: User, token: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const savedUser = authService.getCurrentUser();
		const savedToken = authService.getToken();

		if (savedUser && savedToken) {
			setUser(savedUser);
			setToken(savedToken);
		}
	}, []);

	const login = (userData: User, authToken: string) => {
		setUser(userData);
		setToken(authToken);
		authService.setAuthData({ user: userData, token: authToken });
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		authService.logout();
	};

	const value = {
		user,
		token,
		login,
		logout,
		isAuthenticated: !!user && !!token,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
