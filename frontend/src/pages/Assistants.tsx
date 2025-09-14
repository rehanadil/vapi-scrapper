import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Bot, Calendar, BarChart3 } from "lucide-react";
import { assistantService } from "../services/assistantService";
import { Assistant } from "../types";

const Assistants: React.FC = () => {
	const [assistants, setAssistants] = useState<Assistant[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAssistants = async () => {
			try {
				setLoading(true);
				const data = await assistantService.getAssistants();
				setAssistants(data);
				setError(null);
			} catch (err) {
				setError("Failed to load assistants");
				console.error("Error fetching assistants:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchAssistants();
	}, []);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen">
				<div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
					<h1 className="text-xl font-semibold">Assistants</h1>
				</div>
				<div className="p-6">
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen">
				<div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
					<h1 className="text-xl font-semibold">Assistants</h1>
				</div>
				<div className="p-6">
					<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
						<p className="text-red-400">{error}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			{/* Header */}
			<div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold">Assistants</h1>
					<div className="text-zinc-400 text-sm">
						{assistants.length} assistant
						{assistants.length !== 1 ? "s" : ""}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="p-6">
				{assistants.length === 0 ? (
					<div className="text-center py-12">
						<Bot className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
						<h3 className="text-xl font-medium text-zinc-300 mb-2">
							No assistants found
						</h3>
						<p className="text-zinc-500">
							You don't have any assistants yet.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{assistants.map((assistant) => (
							<div
								key={assistant.id}
								className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-xl p-6 border border-zinc-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-zinc-600 group"
							>
								{/* Assistant Header */}
								<div className="flex items-start justify-between mb-4">
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
											<Bot className="w-5 h-5 text-white" />
										</div>
										<div>
											<h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
												{assistant.name}
											</h3>
											<p className="text-zinc-400 text-sm">
												{assistant.modelType}
											</p>
										</div>
									</div>
									<Link
										to={`/assistant/${assistant.id}`}
										className="p-2 rounded-lg bg-zinc-800 bg-opacity-50 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
										title="Assistant Settings"
									>
										<Settings className="w-4 h-4" />
									</Link>
								</div>

								{/* Assistant Stats */}
								<div className="space-y-3 mb-4">
									<div className="flex items-center justify-between text-sm">
										<span className="text-zinc-400 flex items-center space-x-2">
											<BarChart3 className="w-4 h-4" />
											<span>Metrics</span>
										</span>
										<span className="text-white font-medium">
											{assistant._count?.metrics || 0}
										</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-zinc-400 flex items-center space-x-2">
											<Calendar className="w-4 h-4" />
											<span>Created</span>
										</span>
										<span className="text-white">
											{formatDate(assistant.createdAt)}
										</span>
									</div>
								</div>

								{/* Assistant Footer */}
								<div className="pt-4 border-t border-zinc-700">
									<div className="flex items-center space-x-2 text-xs text-zinc-400">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<span>Active</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Assistants;
