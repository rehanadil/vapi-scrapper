import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider, theme } from "antd";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
				components: {
					Button: {
						colorPrimary: "#FADB14",
						colorPrimaryHover: "#FFE066",
						colorPrimaryActive: "#FFD700",
					},
				},
				token: {
					colorPrimary: "#FADB14",
					colorLink: "#FADB14",
					colorText: "#fff",
					colorBgBase: "#141414",
				},
			}}
		>
			<App />
		</ConfigProvider>
	</React.StrictMode>
);
