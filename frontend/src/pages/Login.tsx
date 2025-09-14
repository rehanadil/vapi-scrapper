import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";

// It's often cleaner to define SVG icons as separate components or constants
const MailIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5 text-gray-500"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
		/>
	</svg>
);

const LockIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5 text-gray-500"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
		/>
	</svg>
);

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const response = await authService.login({ email, password });
			login(response.user, response.token);
			navigate("/dashboard");
		} catch (err: any) {
			setError(
				err.response?.data?.message ||
					"Login failed. Please check your credentials."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		// Main container: full screen, centered content, true black background
		<div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black-90 p-4">
			{/* Animated Golden Aurora Background */}
			<div className="absolute -z-10 top-1/2 left-1/2 w-[60rem] h-[60rem] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-amber-800 via-yellow-700 to-black rounded-full opacity-20 animate-pulse" />

			{/* Form container with Glassmorphism effect and yellow accents */}
			<div className="relative z-10 w-full max-w-md space-y-7 rounded-2xl border border-yellow-900/50 bg-gray-950/80 p-8 shadow-2xl backdrop-blur-sm">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-extrabold text-gray-50">
						Welcome Back
					</h2>
					<p className="mt-2 text-sm text-gray-400">
						Sign in to continue
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{/* Animated error message container (remains red for standard UX) */}
					<div className="h-8">
						{error && (
							<div className="flex items-center justify-center bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-xs animate-fade-in-down">
								{error}
							</div>
						)}
					</div>

					{/* Input fields with floating labels and icons */}
					<div className="space-y-6 rounded-md">
						{/* Email Field */}
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2">
								<MailIcon />
							</span>
							<input
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="peer block w-full appearance-none rounded-md border border-gray-700 bg-transparent px-10 py-3 text-sm text-gray-50 placeholder-transparent focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
								placeholder="Email address"
							/>
							<label
								htmlFor="email-address"
								className="pointer-events-none absolute left-10 top-2 origin-[0] -translate-y-4 scale-75 text-sm text-gray-400 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-yellow-400"
							>
								Email address
							</label>
						</div>

						{/* Password Field */}
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2">
								<LockIcon />
							</span>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="peer block w-full appearance-none rounded-md border border-gray-700 bg-transparent px-10 py-3 text-sm text-gray-50 placeholder-transparent focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
								placeholder="Password"
							/>
							<label
								htmlFor="password"
								className="pointer-events-none absolute left-10 top-2 origin-[0] -translate-y-4 scale-75 text-sm text-gray-400 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-yellow-400"
							>
								Password
							</label>
						</div>
					</div>

					<div>
						{/* Interactive Submit Button with Yellow theme */}
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 disabled:bg-yellow-500/50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50 active:scale-95"
						>
							{loading ? "Signing in..." : "Sign in"}
						</button>
					</div>

					<div className="text-center text-sm">
						<Link
							to="/register"
							className="font-medium text-yellow-400 transition-colors duration-300 hover:text-yellow-300 hover:underline"
						>
							Don't have an account? Sign up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
