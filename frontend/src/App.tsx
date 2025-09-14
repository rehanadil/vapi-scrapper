import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Assistants from "./pages/Assistants";
import AssistantDetail from "./pages/AssistantDetail";
import UserManagement from "./pages/admin/UserManagement";
import AssistantManagement from "./pages/admin/AssistantManagement";
import "./index.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Router>
					<Layout>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route
								path="/dashboard"
								element={
									<PrivateRoute>
										<Dashboard />
									</PrivateRoute>
								}
							/>
							<Route
								path="/assistants"
								element={
									<PrivateRoute>
										<Assistants />
									</PrivateRoute>
								}
							/>
							<Route
								path="/assistant/:id"
								element={
									<PrivateRoute>
										<AssistantDetail />
									</PrivateRoute>
								}
							/>
							<Route
								path="/admin/users"
								element={
									<PrivateRoute>
										<UserManagement />
									</PrivateRoute>
								}
							/>
							<Route
								path="/admin/assistants"
								element={
									<PrivateRoute>
										<AssistantManagement />
									</PrivateRoute>
								}
							/>
							<Route
								path="/"
								element={<Navigate to="/dashboard" replace />}
							/>
						</Routes>
					</Layout>
				</Router>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
