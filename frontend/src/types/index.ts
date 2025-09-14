export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	createdAt: string;
}

export interface Assistant {
	id: number;
	name: string;
	modelType: string;
	vapiId?: string;
	userId: number;
	user?: User;
	createdAt: string;
	updatedAt: string;
	_count?: {
		metrics: number;
	};
}

export interface Metric {
	id: number;
	assistantId: number;
	assistant?: Assistant;
	date: string;
	callCount: number;
	totalMinutes: number;
	avgCallCost: number;
	totalCost: number;
	createdAt: string;
}

export interface CreateAssistantDto {
	name: string;
	modelType: string;
	vapiId?: string;
}

export interface CreateMetricDto {
	date: string;
	callCount: number;
	totalMinutes: number;
	avgCallCost: number;
	totalCost: number;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface RegisterDto {
	name: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	token: string;
}

export interface RollingAverage {
	date: string;
	call_count: number;
	total_minutes: number;
	avg_call_cost: number;
	total_cost: number;
	rolling_avg_calls: number;
	rolling_avg_minutes: number;
	rolling_avg_call_cost: number;
	rolling_avg_total_cost: number;
}

export interface AggregatedMetrics {
	_sum: {
		callCount: number;
		totalMinutes: number;
		totalCost: number;
	};
	_avg: {
		avgCallCost: number;
		callCount: number;
		totalMinutes: number;
		totalCost: number;
	};
	_count: {
		id: number;
	};
}

export enum TimeRange {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	YEARLY = 'yearly'
}

export interface AnalyticsDto {
	assistantId?: string;
	startDate?: string;
	endDate?: string;
	timeRange?: TimeRange;
}

export interface AnalyticsDataPoint {
	period: string;
	total_call_duration: number;
	total_outbound_calls: number;
	total_web_calls: number;
	total_calls: number;
	total_failed_customer_ended: number;
	total_failed_assistant_ended: number;
	total_failed_customer_no_answer: number;
	total_failed_exceed_duration: number;
	total_failed_customer_busy: number;
	total_failed_silence_timeout: number;
	total_failed_other: number;
	total_failed_calls: number;
	total_minutes: number;
	avg_call_cost: number;
	total_cost: number;
	total_spent: number;
	total_success_true: number;
	total_success_false: number;
	total_success_null: number;
	unique_assistants: number;
}

export interface AnalyticsResponse {
	assistants: Assistant[];
	data: AnalyticsDataPoint[];
	summary: {
		totalAssistants: number;
		dateRange: {
			start: string | null;
			end: string | null;
		};
		timeRange: TimeRange;
		totals: {
			total_call_duration: number;
			total_calls: number;
			total_failed_calls: number;
			total_minutes: number;
			total_cost: number;
			total_spent: number;
			earliest_date: string;
			latest_date: string;
		};
	};
}
