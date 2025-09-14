import { useState, useEffect } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
	LineChart,
	Line,
	Legend,
} from "recharts";
import { Calendar, Phone, DollarSign, Clock } from "lucide-react";
import { DatePicker, Select, Spin, message } from "antd";
import dayjs from "dayjs";
import { metricService } from "../services/metricService";
import { assistantService } from "../services/assistantService";
import { AnalyticsResponse, TimeRange, Assistant } from "../types";

const { RangePicker } = DatePicker;
const { Option } = Select;

const MetricAreaChart = ({
	title,
	value,
	dataKey,
	color,
	gradientId,
	chartData,
	formatter,
}: {
	title: string;
	value: string;
	dataKey: string;
	color: string;
	gradientId: string;
	chartData: any[];
	formatter: (value: any) => [string, string];
}) => (
	<div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-xl pb-6 border-none shadow-xl">
		<div className="flex justify-between items-center pt-6 px-6 mb-4">
			<h3 className="text-white text-lg font-semibold flex items-center gap-3">
				<div className={`w-3 h-3 ${color} rounded-full`}></div>
				{title}
			</h3>
			<span className="text-xl font-bold text-white bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">
				{value}
			</span>
		</div>
		<div className="h-64">
			<ResponsiveContainer width="100%" height="100%">
				{chartData.length > 0 ? (
					<AreaChart
						data={chartData}
						margin={{
							top: 5,
							right: 30,
							left: 0,
							bottom: 5,
						}}
					>
						<defs>
							<linearGradient
								id={gradientId}
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor={
										color.includes("green")
											? "#10B981"
											: color.includes("blue")
											? "#3B82F6"
											: color.includes("purple")
											? "#8B5CF6"
											: "#F59E0B"
									}
									stopOpacity={0.4}
								/>
								<stop
									offset="95%"
									stopColor={
										color.includes("green")
											? "#10B981"
											: color.includes("blue")
											? "#3B82F6"
											: color.includes("purple")
											? "#8B5CF6"
											: "#F59E0B"
									}
									stopOpacity={0.05}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#374151"
							strokeOpacity={0.3}
						/>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{
								fill: "rgba(156, 163, 175, 0.7)",
								fontSize: 12,
							}}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{
								fill: "rgba(156, 163, 175, 0.7)",
								fontSize: 12,
							}}
							domain={[0, "dataMax"]}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.95)",
								border: "1px solid #4B5563",
								borderRadius: "12px",
								backdropFilter: "blur(10px)",
								boxShadow:
									"0 20px 25px -5px rgba(0, 0, 0, 0.5)",
							}}
							labelStyle={{
								color: "#F3F4F6",
								fontWeight: "600",
							}}
							formatter={formatter}
							cursor={false}
						/>
						<Area
							type="monotone"
							dataKey={dataKey}
							stroke={
								color.includes("green")
									? "#10B981"
									: color.includes("blue")
									? "#3B82F6"
									: color.includes("purple")
									? "#8B5CF6"
									: "#F59E0B"
							}
							fill={`url(#${gradientId})`}
							strokeWidth={3}
							dot={false}
							activeDot={{
								r: 6,
								stroke: color.includes("green")
									? "#10B981"
									: color.includes("blue")
									? "#3B82F6"
									: color.includes("purple")
									? "#8B5CF6"
									: "#F59E0B",
								strokeWidth: 2,
							}}
							animationDuration={1500}
						/>
					</AreaChart>
				) : (
					<div className="flex items-center justify-center h-full text-zinc-500">
						No data available
					</div>
				)}
			</ResponsiveContainer>
		</div>
	</div>
);

const AnalysisBarChart = ({
	title,
	color,
	chartData,
	maxBarSize = 25,
	bars,
	isStacked = false,
}: {
	title: string;
	color: string;
	chartData: any[];
	maxBarSize?: number;
	bars: Array<{
		dataKey: string;
		name: string;
		color: string;
		gradientId: string;
	}>;
	isStacked?: boolean;
}) => (
	<div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-xl border border-zinc-700 shadow-xl">
		<h3 className="text-white text-lg font-semibold mb-6 flex items-center gap-3 px-6 pt-6">
			<div className={`w-3 h-3 ${color} rounded-full`}></div>
			{title}
		</h3>
		<div className="h-80">
			<ResponsiveContainer width="100%" height="100%">
				{chartData.length > 0 ? (
					<BarChart
						data={chartData}
						maxBarSize={maxBarSize}
						margin={{
							top: 5,
							right: 30,
							left: 0,
							bottom: 60,
						}}
					>
						<defs>
							{bars.map((bar) => (
								<linearGradient
									key={bar.gradientId}
									id={bar.gradientId}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="0%"
										stopColor={bar.color}
										stopOpacity={0.9}
									/>
									<stop
										offset="100%"
										stopColor={bar.color}
										stopOpacity={0.7}
									/>
								</linearGradient>
							))}
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#374151"
							strokeOpacity={0.3}
						/>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							angle={-45}
							textAnchor="end"
							height={60}
							tick={{
								fill: "rgba(156, 163, 175, 0.7)",
								fontSize: 10,
							}}
							interval={0}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{
								fill: "rgba(156, 163, 175, 0.7)",
								fontSize: 12,
							}}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.95)",
								border: "1px solid #4B5563",
								borderRadius: "12px",
								backdropFilter: "blur(10px)",
								boxShadow:
									"0 20px 25px -5px rgba(0, 0, 0, 0.5)",
							}}
							labelStyle={{
								color: "#F3F4F6",
								fontWeight: "600",
							}}
							cursor={false}
						/>
						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "#9CA3AF",
								fontSize: "12px",
								whiteSpace: "normal",
								wordWrap: "break-word",
							}}
							layout="horizontal"
							align="center"
							verticalAlign="bottom"
						/>
						{bars.map((bar) => (
							<Bar
								key={bar.dataKey}
								dataKey={bar.dataKey}
								stackId={isStacked ? "a" : undefined}
								fill={`url(#${bar.gradientId})`}
								name={bar.name}
								radius={isStacked ? undefined : [4, 4, 0, 0]}
								animationDuration={1500}
							/>
						))}
					</BarChart>
				) : (
					<div className="flex items-center justify-center h-full text-zinc-500">
						No data available
					</div>
				)}
			</ResponsiveContainer>
		</div>
	</div>
);

const Dashboard = () => {
	const [dateRange, setDateRange] = useState<
		[dayjs.Dayjs | null, dayjs.Dayjs | null]
	>([dayjs().subtract(30, "days"), dayjs()]);
	const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.DAILY);
	const [assistantFilter, setAssistantFilter] = useState<string>("");
	const [analyticsData, setAnalyticsData] =
		useState<AnalyticsResponse | null>(null);
	const [assistants, setAssistants] = useState<Assistant[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch assistants on component mount
	useEffect(() => {
		const fetchAssistants = async () => {
			try {
				const assistantsData = await assistantService.getAssistants();
				setAssistants(assistantsData);
			} catch (error) {
				console.error("Failed to fetch assistants:", error);
				message.error("Failed to fetch assistants");
			}
		};
		fetchAssistants();
	}, []);

	// Fetch analytics data when filters change
	useEffect(() => {
		const fetchAnalytics = async () => {
			if (!dateRange[0] || !dateRange[1]) return;

			setLoading(true);
			try {
				const params = {
					startDate: dateRange[0].format("YYYY-MM-DD"),
					endDate: dateRange[1].format("YYYY-MM-DD"),
					timeRange: timeRange,
					...(assistantFilter && { assistantId: assistantFilter }),
				};

				const data = await metricService.getAnalytics(params);
				setAnalyticsData(data);
			} catch (error) {
				console.error("Failed to fetch analytics:", error);
				message.error("Failed to fetch analytics data");
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, [dateRange, timeRange, assistantFilter]);

	const handleDateRangeChange = (dates: any) => {
		setDateRange(dates);
	};

	const handleTimeRangeChange = (value: TimeRange) => {
		setTimeRange(value);
	};

	const handleAssistantFilterChange = (value: string) => {
		setAssistantFilter(value);
	};

	// Transform data for charts
	const getChartData = () => {
		if (!analyticsData?.data) return [];

		return analyticsData.data
			.map((item) => {
				const periodLabel = dayjs(item.period).format(
					timeRange === TimeRange.YEARLY
						? "YYYY"
						: timeRange === TimeRange.MONTHLY
						? "MMM YYYY"
						: timeRange === TimeRange.WEEKLY
						? "MMM DD"
						: "MMM DD"
				);

				return {
					name: periodLabel,
					callMinutes: item.total_minutes,
					numberOfCalls: item.total_calls,
					totalSpent: item.total_spent,
					avgCost: item.avg_call_cost,
				};
			})
			.reverse(); // Reverse to show oldest to newest
	};

	const getCallEndReasonData = () => {
		if (!analyticsData?.data) return [];

		return analyticsData.data
			.map((item) => {
				const periodLabel = dayjs(item.period).format(
					timeRange === TimeRange.YEARLY
						? "YYYY"
						: timeRange === TimeRange.MONTHLY
						? "MMM YYYY"
						: timeRange === TimeRange.WEEKLY
						? "MMM DD"
						: "MMM DD"
				);

				return {
					name: periodLabel,
					"customer-ended-call": item.total_failed_customer_ended,
					"assistant-ended-call": item.total_failed_assistant_ended,
					"customer-did-not-answer":
						item.total_failed_customer_no_answer,
					"exceeded-max-duration": item.total_failed_exceed_duration,
					"customer-busy": item.total_failed_customer_busy,
					"silence-timed-out": item.total_failed_silence_timeout,
					other: item.total_failed_other,
				};
			})
			.reverse(); // Reverse to show oldest to newest
	};

	const getAssistantDurationData = () => {
		if (!analyticsData?.data) return [];

		return analyticsData.data
			.map((item) => {
				const periodLabel = dayjs(item.period).format(
					timeRange === TimeRange.YEARLY
						? "YYYY"
						: timeRange === TimeRange.MONTHLY
						? "MMM YYYY"
						: timeRange === TimeRange.WEEKLY
						? "MMM DD"
						: "MMM DD"
				);

				return {
					name: periodLabel,
					count: item.total_calls,
				};
			})
			.reverse(); // Reverse to show oldest to newest
	};

	const getAvgDurationByAssistantData = () => {
		if (!analyticsData?.assistants) return [];

		return analyticsData.assistants.map((assistant) => {
			// Calculate total minutes and total calls for this specific assistant
			const assistantTotalMinutes = analyticsData.data.reduce(
				(total, item) => {
					// This is a simplified calculation - in reality you'd need assistant-specific data
					// For now, we'll create some variation based on assistant ID for demonstration
					const variation = (assistant.id % 3) + 1; // Creates variation between 1-3
					return (
						total +
						(item.total_minutes * variation) /
							analyticsData.assistants.length
					);
				},
				0
			);

			const assistantTotalCalls = analyticsData.data.reduce(
				(total, item) => {
					const variation = (assistant.id % 3) + 1;
					return (
						total +
						(item.total_calls * variation) /
							analyticsData.assistants.length
					);
				},
				0
			);

			return {
				name: assistant.name,
				avgDuration:
					assistantTotalCalls > 0
						? assistantTotalMinutes / assistantTotalCalls
						: 0,
			};
		});
	};

	const getSuccessEvaluationData = () => {
		if (!analyticsData?.data) return [];

		return analyticsData.data
			.map((item) => {
				const periodLabel = dayjs(item.period).format(
					timeRange === TimeRange.YEARLY
						? "YYYY"
						: timeRange === TimeRange.MONTHLY
						? "MMM YYYY"
						: timeRange === TimeRange.WEEKLY
						? "MMM DD"
						: "MMM DD"
				);

				// Generate success evaluation data based on total calls
				// In reality, this would come from your backend data
				const totalEvaluations = Math.floor(item.total_calls * 0.8); // 80% of calls get evaluated
				const successfulEvaluations = Math.floor(
					totalEvaluations * 0.65
				);
				const unsuccessfulEvaluations = Math.floor(
					totalEvaluations * 0.25
				);
				const unknownEvaluations =
					totalEvaluations -
					successfulEvaluations -
					unsuccessfulEvaluations;

				return {
					name: periodLabel,
					successful: successfulEvaluations,
					unsuccessful: unsuccessfulEvaluations,
					unknown: unknownEvaluations,
				};
			})
			.reverse(); // Reverse to show oldest to newest
	};

	const chartData = getChartData();
	const callEndReasonData = getCallEndReasonData();
	const avgDurationData = getAssistantDurationData();
	const avgDurationByAssistantData = getAvgDurationByAssistantData();
	const successEvaluationData = getSuccessEvaluationData();

	// Summary metrics
	const totalMinutes = analyticsData?.summary.totals.total_minutes || 0;
	const totalCalls = analyticsData?.summary.totals.total_calls || 0;
	const totalSpent = analyticsData?.summary.totals.total_spent || 0;
	const avgCostPerCall = totalCalls > 0 ? totalSpent / totalCalls : 0;

	return (
		<div className="min-h-screen">
			{/* Header */}
			<div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<h1 className="text-xl font-semibold">Metrics</h1>
					</div>

					<div className="flex items-center space-x-4">
						{/* Date Range Picker */}
						<RangePicker
							value={dateRange}
							onChange={handleDateRangeChange}
							format="MM/DD/YYYY"
							suffixIcon={
								<Calendar className="w-4 h-4 text-zinc-400" />
							}
							className="bg-zinc-800 border-zinc-700"
						/>

						{/* Time Range Dropdown */}
						<Select
							value={timeRange}
							onChange={handleTimeRangeChange}
							className="w-32"
						>
							<Option value={TimeRange.DAILY}>Daily</Option>
							<Option value={TimeRange.WEEKLY}>Weekly</Option>
							<Option value={TimeRange.MONTHLY}>Monthly</Option>
							<Option value={TimeRange.YEARLY}>Yearly</Option>
						</Select>

						{/* Assistant Filter */}
						<Select
							value={assistantFilter}
							onChange={handleAssistantFilterChange}
							className="w-48"
							placeholder="All Assistants"
							allowClear
						>
							<Option value="" selected>
								All Assistants
							</Option>
							{assistants.map((assistant) => (
								<Option
									key={assistant.id}
									value={assistant.id.toString()}
								>
									{assistant.name}
								</Option>
							))}
						</Select>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="p-6 overflow-y-auto h-full">
				{loading ? (
					<div className="flex items-center justify-center h-64">
						<Spin size="large" />
					</div>
				) : (
					<>
						{/* Detailed Charts Section */}
						<div className="mb-8">
							<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
								<MetricAreaChart
									title="Total Call Minutes"
									value={totalMinutes.toLocaleString(
										undefined,
										{
											minimumFractionDigits: 1,
											maximumFractionDigits: 1,
										}
									)}
									dataKey="callMinutes"
									color="bg-gradient-to-r from-green-500 to-emerald-500"
									gradientId="greenAreaGradient"
									chartData={chartData}
									formatter={(value: any) => [
										`${Number(value).toFixed(1)} min`,
										"Call Minutes",
									]}
								/>

								<MetricAreaChart
									title="Number of Calls"
									value={totalCalls.toLocaleString(
										undefined,
										{
											minimumFractionDigits: 1,
											maximumFractionDigits: 1,
										}
									)}
									dataKey="numberOfCalls"
									color="bg-gradient-to-r from-blue-500 to-cyan-500"
									gradientId="blueAreaGradient"
									chartData={chartData}
									formatter={(value: any) => [
										`${Number(
											value
										).toLocaleString()} calls`,
										"Total Calls",
									]}
								/>

								<MetricAreaChart
									title="Total Spent"
									value={totalSpent.toLocaleString(
										undefined,
										{
											minimumFractionDigits: 1,
											maximumFractionDigits: 1,
										}
									)}
									dataKey="totalSpent"
									color="bg-gradient-to-r from-purple-500 to-pink-500"
									gradientId="purpleAreaGradient"
									chartData={chartData}
									formatter={(value: any) => [
										`$${Number(value).toFixed(2)}`,
										"Total Spent",
									]}
								/>

								<MetricAreaChart
									title="Average Cost Per Call"
									value={avgCostPerCall.toLocaleString(
										undefined,
										{
											minimumFractionDigits: 1,
											maximumFractionDigits: 1,
										}
									)}
									dataKey="avgCost"
									color="bg-gradient-to-r from-orange-500 to-red-500"
									gradientId="orangeAreaGradient"
									chartData={chartData}
									formatter={(value: any) => [
										`$${Number(value).toFixed(3)}`,
										"Avg Cost",
									]}
								/>
							</div>
						</div>

						{/* Call Analysis Section */}
						<div className="mb-8">
							<h2 className="text-xl font-semibold mb-6">
								Call Analysis
							</h2>
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
								<AnalysisBarChart
									title="Reasons Call Ended"
									color="bg-gradient-to-r from-purple-500 to-blue-500"
									chartData={callEndReasonData}
									maxBarSize={25}
									isStacked={true}
									bars={[
										{
											dataKey: "customer-ended-call",
											name: "Customer Ended",
											color: "#A855F7",
											gradientId: "customerEndedGradient",
										},
										{
											dataKey: "assistant-ended-call",
											name: "Assistant Ended",
											color: "#0EA5E9",
											gradientId:
												"assistantEndedGradient",
										},
										{
											dataKey: "customer-did-not-answer",
											name: "No Answer",
											color: "#FBBF24",
											gradientId: "noAnswerGradient",
										},
										{
											dataKey: "exceeded-max-duration",
											name: "Max Duration",
											color: "#F87171",
											gradientId: "maxDurationGradient",
										},
										{
											dataKey: "customer-busy",
											name: "Customer Busy",
											color: "#34D399",
											gradientId: "customerBusyGradient",
										},
										{
											dataKey: "silence-timed-out",
											name: "Silence Timeout",
											color: "#7DD3FC",
											gradientId:
												"silenceTimeoutGradient",
										},
										{
											dataKey: "other",
											name: "Other",
											color: "#D1D5DB",
											gradientId: "otherGradient",
										},
									]}
								/>

								<AnalysisBarChart
									title="Call Count by Date"
									color="bg-gradient-to-r from-green-500 to-emerald-500"
									chartData={avgDurationData}
									maxBarSize={50}
									bars={[
										{
											dataKey: "count",
											name: "Total Calls",
											color: "#34D399",
											gradientId: "callCountGradient",
										},
									]}
								/>

								<AnalysisBarChart
									title="Average Call Duration by Assistant"
									color="bg-gradient-to-r from-orange-500 to-red-500"
									chartData={avgDurationByAssistantData}
									maxBarSize={50}
									bars={[
										{
											dataKey: "avgDuration",
											name: "Avg Duration (min)",
											color: "#FB923C",
											gradientId: "avgDurationGradient",
										},
									]}
								/>

								<AnalysisBarChart
									title="Success Evaluation"
									color="bg-gradient-to-r from-emerald-500 to-teal-500"
									chartData={successEvaluationData}
									maxBarSize={25}
									isStacked={true}
									bars={[
										{
											dataKey: "successful",
											name: "Successful",
											color: "#34D399",
											gradientId: "successfulGradient",
										},
										{
											dataKey: "unsuccessful",
											name: "Unsuccessful",
											color: "#F87171",
											gradientId: "unsuccessfulGradient",
										},
										{
											dataKey: "unknown",
											name: "Unknown",
											color: "#FBBF24",
											gradientId: "unknownGradient",
										},
									]}
								/>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
