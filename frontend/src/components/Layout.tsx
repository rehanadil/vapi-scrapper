import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Menu } from "lucide-react";
import { Button, ConfigProvider, theme } from "antd";
import Sidebar from "./Sidebar";

interface LayoutProps {
	children: React.ReactNode;
}

// Dark theme configuration for Ant Design
const darkTheme = {
	algorithm: theme.darkAlgorithm,
	token: {
		colorBgBase: "#111827", // gray-900
		colorBgContainer: "#27272A", // gray-800
		colorBorder: "#3F3F46", // gray-700
		colorText: "#F9FAFB", // gray-50
		colorTextSecondary: "#9CA3AF", // gray-400
		colorPrimary: "#10B981", // blue-500
		colorBgElevated: "#27272A",
		controlItemBgHover: "#3F3F46",
		controlOutline: "rgba(16, 185, 129, 0.1)",
	},
	components: {
		Select: {
			colorBgContainer: "#27272A",
			colorBorder: "#3F3F46",
			colorText: "#F9FAFB",
			colorTextPlaceholder: "#9CA3AF",
			controlItemBgHover: "#3F3F46",
			optionSelectedBg: "#10B981",
		},
		DatePicker: {
			colorBgContainer: "#27272A",
			colorBorder: "#3F3F46",
			colorText: "#F9FAFB",
			colorTextPlaceholder: "#9CA3AF",
			colorIcon: "#9CA3AF",
		},
		Input: {
			colorBgContainer: "#27272A",
			colorBorder: "#3F3F46",
			colorText: "#F9FAFB",
			colorTextPlaceholder: "#9CA3AF",
			colorIcon: "#9CA3AF",
		},
		Button: {
			colorText: "#F9FAFB",
			colorBgContainer: "#27272A",
			colorBorder: "#3F3F46",
		},
	},
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { isAuthenticated } = useAuth();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	if (!isAuthenticated) {
		return <ConfigProvider theme={darkTheme}>{children}</ConfigProvider>;
	}

	return (
		<ConfigProvider theme={darkTheme}>
			<div className="min-h-screen bg-neutral-900 text-white flex">
				<Sidebar />

				<div className="flex-1 overflow-hidden">
					{/* Page content */}
					<div className="flex-1 overflow-y-auto">{children}</div>
				</div>
			</div>
		</ConfigProvider>
	);
};

export default Layout;
