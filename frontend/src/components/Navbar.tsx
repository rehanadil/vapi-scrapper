import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
	const { user, logout } = useAuth();

	return (
		<nav className="bg-blue-600 text-white p-4">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-xl font-bold">
					Assistant Metrics Dashboard
				</h1>
				<div className="flex items-center space-x-4">
					<span>Welcome, {user?.name}</span>
					<button
						onClick={logout}
						className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
					>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
