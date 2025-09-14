import React, { useState } from "react";
import {
	BarChart,
	Search,
	Users,
	Phone,
	MessageSquare,
	Clock,
	Settings,
	UserPlus,
	LogOut,
	Bot,
	Menu,
} from "lucide-react";
import { Input, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
	const [isOpen, setIsOpen] = useState(true);
	const { user, logout } = useAuth();
	const location = useLocation();
	const isAdmin = user?.role === "admin";
	const toggleSidebar = () => setIsOpen(!isOpen);

	const isActive = (path: string) => location.pathname === path;

	return (
		<div
			className={`${
				isOpen ? "w-64" : "w-20"
			} bg-zinc-900 border-r border-zinc-800 transition-all duration-300 flex flex-col h-screen sticky top-0`}
		>
			<div className="p-4 border-b border-zinc-800">
				<div
					className={`flex items-center ${
						isOpen ? "justify-between" : "justify-center"
					}`}
				>
					{isOpen && (
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">
									V
								</span>
							</div>
							{isOpen && (
								<span className="text-white font-semibold">
									VAPI
								</span>
							)}
						</div>
					)}

					<Button
						type="text"
						onClick={toggleSidebar}
						icon={<Menu className="w-5 h-5" />}
						className="text-zinc-400 hover:text-white border-none"
					/>
				</div>
			</div>

			<nav className="flex-1 mt-4 px-4 overflow-y-auto">
				<div className="space-y-2">
					<div className="text-zinc-400 text-xs uppercase tracking-wider mb-4">
						{isOpen ? "Metric" : ""}
					</div>

					<Link
						to="/dashboard"
						className={`flex items-center space-x-3 ${
							isActive("/dashboard")
								? "text-white bg-zinc-800"
								: "text-zinc-300 hover:text-white hover:bg-zinc-800"
						} rounded-lg px-3 py-2 transition-colors`}
					>
						<Users className="w-5 h-5" />
						{isOpen && <span>Dashboard</span>}
					</Link>

					<div className="text-zinc-400 text-xs uppercase tracking-wider mb-4 mt-8">
						{isOpen ? "Manage" : ""}
					</div>

					<Link
						to="/assistants"
						className={`flex items-center space-x-3 ${
							isActive("/assistants")
								? "text-white bg-zinc-800"
								: "text-zinc-300 hover:text-white hover:bg-zinc-800"
						} rounded-lg px-3 py-2 transition-colors`}
					>
						<Bot className="w-5 h-5" />
						{isOpen && <span>Assistants</span>}
					</Link>

					{isAdmin && (
						<>
							<div className="text-zinc-400 text-xs uppercase tracking-wider mb-4 mt-8">
								{isOpen ? "ADMIN" : ""}
							</div>

							<Link
								to="/admin/users"
								className={`flex items-center space-x-3 ${
									isActive("/admin/users")
										? "text-white bg-zinc-800"
										: "text-zinc-300 hover:text-white hover:bg-zinc-800"
								} rounded-lg px-3 py-2 transition-colors`}
							>
								<Settings className="w-5 h-5" />
								{isOpen && <span>Manage Users</span>}
							</Link>

							<Link
								to="/admin/assistants"
								className={`flex items-center space-x-3 ${
									isActive("/admin/assistants")
										? "text-white bg-zinc-800"
										: "text-zinc-300 hover:text-white hover:bg-zinc-800"
								} rounded-lg px-3 py-2 transition-colors`}
							>
								<UserPlus className="w-5 h-5" />
								{isOpen && <span>Manage Assistants</span>}
							</Link>
						</>
					)}
				</div>
			</nav>

			<div className="p-2 border-t border-zinc-800 mt-auto flex-shrink-0">
				<div className="flex items-center space-x-3">
					<button
						type="button"
						onClick={logout}
						className="flex items-center space-x-3 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg px-3 py-2 transition-colors w-full"
					>
						<LogOut className="w-5 h-5" />
						{isOpen && <span>Logout</span>}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
