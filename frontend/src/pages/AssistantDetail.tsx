import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { format } from "date-fns";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
} from "recharts";
import { assistantService } from "../services/assistantService";
import { metricService } from "../services/metricService";
import { Assistant, Metric, CreateMetricDto } from "../types";
import Navbar from "../components/Navbar";

const AssistantDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [showModal, setShowModal] = useState(false);
	const [metricData, setMetricData] = useState<CreateMetricDto>({
		date: format(new Date(), "yyyy-MM-dd"),
		callCount: 0,
		totalMinutes: 0,
		avgCallCost: 0,
		totalCost: 0,
	});
	const [selectedTab, setSelectedTab] = useState("overview");
	const queryClient = useQueryClient();

	const assistantId = parseInt(id || "0", 10);

	const { data: assistant } = useQuery<Assistant>(
		["assistant", assistantId],
		() => assistantService.getAssistant(assistantId)
	);

	const { data: metrics } = useQuery<Metric[]>(["metrics", assistantId], () =>
		metricService.getMetrics(assistantId)
	);

	const { data: rollingAverages } = useQuery(
		["rollingAverages", assistantId],
		() => metricService.getRollingAverages(assistantId, 7)
	);

	const { data: aggregatedMetrics } = useQuery(
		["aggregatedMetrics", assistantId],
		() => metricService.getAggregatedMetrics(assistantId)
	);

	const createMetricMutation = useMutation(
		(data: CreateMetricDto) =>
			metricService.createMetric(assistantId, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["metrics", assistantId]);
				queryClient.invalidateQueries(["rollingAverages", assistantId]);
				queryClient.invalidateQueries([
					"aggregatedMetrics",
					assistantId,
				]);
				setShowModal(false);
				setMetricData({
					date: format(new Date(), "yyyy-MM-dd"),
					callCount: 0,
					totalMinutes: 0,
					avgCallCost: 0,
					totalCost: 0,
				});
			},
		}
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMetricMutation.mutate(metricData);
	};

	const chartData = metrics?.map((metric) => ({
		date: format(new Date(metric.date), "MMM dd"),
		callCount: metric.callCount,
		totalMinutes: metric.totalMinutes,
		avgCallCost: metric.avgCallCost,
		totalCost: metric.totalCost,
	}));

	const rollingData = rollingAverages?.map((avg: any) => ({
		date: format(new Date(avg.date), "MMM dd"),
		avgCalls: parseFloat(avg.rolling_avg_calls.toFixed(2)),
		avgMinutes: parseFloat(avg.rolling_avg_minutes.toFixed(2)),
		avgCost: parseFloat(avg.rolling_avg_total_cost.toFixed(2)),
	}));

	return (
		<div>
			<Navbar />
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold">
							{assistant?.name}
						</h1>
						<p className="text-gray-600">
							Model: {assistant?.modelType}
						</p>
					</div>
					<button
						onClick={() => setShowModal(true)}
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
					>
						Log Metrics
					</button>
				</div>

				{/* Tabs */}
				<div className="border-b border-gray-200 mb-6">
					<nav className="-mb-px flex space-x-8">
						{["overview", "daily", "rolling"].map((tab) => (
							<button
								key={tab}
								onClick={() => setSelectedTab(tab)}
								className={`py-2 px-1 border-b-2 font-medium text-sm ${
									selectedTab === tab
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						))}
					</nav>
				</div>

				{/* Overview Tab */}
				{selectedTab === "overview" && (
					<div className="space-y-6">
						{/* Summary Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<div className="bg-white rounded-lg shadow p-6">
								<h3 className="text-lg font-medium text-gray-900">
									Total Calls
								</h3>
								<p className="text-3xl font-bold text-blue-600">
									{aggregatedMetrics?._sum.callCount || 0}
								</p>
							</div>
							<div className="bg-white rounded-lg shadow p-6">
								<h3 className="text-lg font-medium text-gray-900">
									Total Minutes
								</h3>
								<p className="text-3xl font-bold text-green-600">
									{aggregatedMetrics?._sum.totalMinutes || 0}
								</p>
							</div>
							<div className="bg-white rounded-lg shadow p-6">
								<h3 className="text-lg font-medium text-gray-900">
									Total Cost
								</h3>
								<p className="text-3xl font-bold text-red-600">
									$
									{aggregatedMetrics?._sum.totalCost?.toFixed(
										2
									) || "0.00"}
								</p>
							</div>
							<div className="bg-white rounded-lg shadow p-6">
								<h3 className="text-lg font-medium text-gray-900">
									Avg Call Cost
								</h3>
								<p className="text-3xl font-bold text-purple-600">
									$
									{aggregatedMetrics?._avg.avgCallCost?.toFixed(
										3
									) || "0.000"}
								</p>
							</div>
						</div>

						{/* Recent Metrics */}
						<div className="bg-white rounded-lg shadow p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Recent Metrics
							</h3>
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Date
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Calls
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Minutes
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Avg Cost
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Total Cost
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{metrics?.slice(0, 10).map((metric) => (
											<tr key={metric.id}>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{format(
														new Date(metric.date),
														"MMM dd, yyyy"
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{metric.callCount}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{metric.totalMinutes}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													$
													{metric.avgCallCost.toFixed(
														3
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													$
													{metric.totalCost.toFixed(
														2
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}

				{/* Daily Charts Tab */}
				{selectedTab === "daily" && chartData && (
					<div className="space-y-6">
						<div className="bg-white rounded-lg shadow p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Daily Call Count
							</h3>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="callCount"
										stroke="#3B82F6"
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Daily Total Cost
							</h3>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="totalCost" fill="#EF4444" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				)}

				{/* Rolling Averages Tab */}
				{selectedTab === "rolling" && rollingData && (
					<div className="space-y-6">
						<div className="bg-white rounded-lg shadow p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								7-Day Rolling Averages
							</h3>
							<ResponsiveContainer width="100%" height={400}>
								<LineChart data={rollingData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="avgCalls"
										stroke="#3B82F6"
										name="Avg Calls"
									/>
									<Line
										type="monotone"
										dataKey="avgMinutes"
										stroke="#10B981"
										name="Avg Minutes"
									/>
									<Line
										type="monotone"
										dataKey="avgCost"
										stroke="#EF4444"
										name="Avg Cost"
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				)}

				{/* Modal */}
				{showModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="bg-white rounded-lg p-6 w-full max-w-md">
							<h2 className="text-xl font-bold mb-4">
								Log Daily Metrics
							</h2>
							<form onSubmit={handleSubmit}>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Date
										</label>
										<input
											type="date"
											required
											value={metricData.date}
											onChange={(e) =>
												setMetricData({
													...metricData,
													date: e.target.value,
												})
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="Enter date"
											title="Date"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Call Count
										</label>
										<input
											type="number"
											required
											min="0"
											value={metricData.callCount}
											onChange={(e) =>
												setMetricData({
													...metricData,
													callCount:
														parseInt(
															e.target.value
														) || 0,
												})
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="Enter call count"
											title="Call Count"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Total Minutes
										</label>
										<input
											type="number"
											required
											min="0"
											value={metricData.totalMinutes}
											onChange={(e) =>
												setMetricData({
													...metricData,
													totalMinutes:
														parseInt(
															e.target.value
														) || 0,
												})
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="Enter total minutes"
											title="Total Minutes"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Average Call Cost
										</label>
										<input
											type="number"
											required
											min="0"
											step="0.001"
											value={metricData.avgCallCost}
											onChange={(e) =>
												setMetricData({
													...metricData,
													avgCallCost:
														parseFloat(
															e.target.value
														) || 0,
												})
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="Enter average call cost"
											title="Average Call Cost"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Total Cost
										</label>
										<input
											type="number"
											required
											min="0"
											step="0.01"
											value={metricData.totalCost}
											onChange={(e) =>
												setMetricData({
													...metricData,
													totalCost:
														parseFloat(
															e.target.value
														) || 0,
												})
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="Enter total cost"
											title="Total Cost"
										/>
									</div>
								</div>
								<div className="flex space-x-4 mt-6">
									<button
										type="submit"
										disabled={
											createMetricMutation.isLoading
										}
										className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
									>
										{createMetricMutation.isLoading
											? "Saving..."
											: "Save Metrics"}
									</button>
									<button
										type="button"
										onClick={() => setShowModal(false)}
										className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AssistantDetail;
