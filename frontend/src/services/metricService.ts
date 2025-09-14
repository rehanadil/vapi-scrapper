import { api } from "../utils/api";
import {
	Metric,
	CreateMetricDto,
	RollingAverage,
	AggregatedMetrics,
	AnalyticsDto,
	AnalyticsResponse,
} from "../types";

export const metricService = {
	async getMetrics(
		assistantId: number,
		startDate?: string,
		endDate?: string
	): Promise<Metric[]> {
		const params = new URLSearchParams();
		if (startDate) params.append("start", startDate);
		if (endDate) params.append("end", endDate);

		const response = await api.get(
			`/assistants/${assistantId}/metrics?${params.toString()}`
		);
		return response.data;
	},

	async createMetric(
		assistantId: number,
		data: CreateMetricDto
	): Promise<Metric> {
		const response = await api.post(
			`/assistants/${assistantId}/metrics`,
			data
		);
		return response.data;
	},

	async getRollingAverages(
		assistantId: number,
		days: number = 7
	): Promise<RollingAverage[]> {
		const response = await api.get(
			`/assistants/${assistantId}/metrics/rolling-avg?days=${days}`
		);
		return response.data;
	},

	async getAggregatedMetrics(
		assistantId: number
	): Promise<AggregatedMetrics> {
		const response = await api.get(
			`/assistants/${assistantId}/metrics/aggregated`
		);
		return response.data;
	},

	async getDailyAverages(
		assistantId: number,
		days: number = 30
	): Promise<Metric[]> {
		const response = await api.get(
			`/assistants/${assistantId}/metrics/daily-averages?days=${days}`
		);
		return response.data;
	},

	async getAnalytics(params: AnalyticsDto): Promise<AnalyticsResponse> {
		const urlParams = new URLSearchParams();
		if (params.assistantId) urlParams.append("assistantId", params.assistantId);
		if (params.startDate) urlParams.append("startDate", params.startDate);
		if (params.endDate) urlParams.append("endDate", params.endDate);
		if (params.timeRange) urlParams.append("timeRange", params.timeRange);

		const response = await api.get(`/metrics/analytics?${urlParams.toString()}`);
		return response.data;
	},
};
