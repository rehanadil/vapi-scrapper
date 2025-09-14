import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMetricDto } from "./dto/create-metric.dto";
import { AnalyticsDto, TimeRange } from "./dto/analytics.dto";

@Injectable()
export class MetricsService {
	constructor(private prisma: PrismaService) {}

	async create(assistantId: number, createMetricDto: CreateMetricDto) {
		const updateData = {
			...(createMetricDto.totalCallDuration !== undefined && { totalCallDuration: createMetricDto.totalCallDuration }),
			...(createMetricDto.outboundCallCount !== undefined && { outboundCallCount: createMetricDto.outboundCallCount }),
			...(createMetricDto.webCallCount !== undefined && { webCallCount: createMetricDto.webCallCount }),
			...(createMetricDto.failedCustomerEndedCallCount !== undefined && { failedCustomerEndedCallCount: createMetricDto.failedCustomerEndedCallCount }),
			...(createMetricDto.failedAssistantEndedCallCount !== undefined && { failedAssistantEndedCallCount: createMetricDto.failedAssistantEndedCallCount }),
			...(createMetricDto.failedCustomerNoAnswerCallCount !== undefined && { failedCustomerNoAnswerCallCount: createMetricDto.failedCustomerNoAnswerCallCount }),
			...(createMetricDto.failedExceedDurationCallCount !== undefined && { failedExceedDurationCallCount: createMetricDto.failedExceedDurationCallCount }),
			...(createMetricDto.failedCustomerBusyCallCount !== undefined && { failedCustomerBusyCallCount: createMetricDto.failedCustomerBusyCallCount }),
			...(createMetricDto.failedSilenceTimeoutCallCount !== undefined && { failedSilenceTimeoutCallCount: createMetricDto.failedSilenceTimeoutCallCount }),
			...(createMetricDto.failedOtherCallCount !== undefined && { failedOtherCallCount: createMetricDto.failedOtherCallCount }),
			...(createMetricDto.totalMinutes !== undefined && { totalMinutes: createMetricDto.totalMinutes }),
			...(createMetricDto.avgCallCost !== undefined && { avgCallCost: createMetricDto.avgCallCost }),
			...(createMetricDto.totalCost !== undefined && { totalCost: createMetricDto.totalCost }),
			...(createMetricDto.totalSpent !== undefined && { totalSpent: createMetricDto.totalSpent }),
			...(createMetricDto.successEvaluationTrue !== undefined && { successEvaluationTrue: createMetricDto.successEvaluationTrue }),
			...(createMetricDto.successEvaluationFalse !== undefined && { successEvaluationFalse: createMetricDto.successEvaluationFalse }),
			...(createMetricDto.successEvaluationNull !== undefined && { successEvaluationNull: createMetricDto.successEvaluationNull }),
		};

		return this.prisma.metric.upsert({
			where: {
				assistantId_date: {
					assistantId,
					date: new Date(createMetricDto.date),
				},
			},
			update: updateData,
			create: {
				...updateData,
				assistantId,
				date: new Date(createMetricDto.date),
			},
			include: {
				assistant: {
					select: {
						id: true,
						name: true,
						modelType: true,
					},
				},
			},
		});
	}

	async findByAssistant(
		assistantId: number,
		startDate?: string,
		endDate?: string
	) {
		const where: any = { assistantId };

		if (startDate || endDate) {
			where.date = {};
			if (startDate) where.date.gte = new Date(startDate);
			if (endDate) where.date.lte = new Date(endDate);
		}

		return this.prisma.metric.findMany({
			where,
			orderBy: {
				date: "desc",
			},
			include: {
				assistant: {
					select: {
						id: true,
						name: true,
						modelType: true,
					},
				},
			},
		});
	}

	async getRollingAverage(assistantId: number, days: number = 7) {
		// Using raw SQL for TimescaleDB window functions
		const result = await this.prisma.$queryRaw`
      SELECT
        date,
        total_call_duration,
        outbound_call_count,
        web_call_count,
        "failedCustomerEndedCallCount",
        "failedAssistantEndedCallCount",
        "failedCustomerNoAnswerCallCount",
        "failedExceedDurationCallCount",
        "failedCustomerBusyCallCount",
        "failedSilenceTimeoutCallCount",
        "failedOtherCallCount",
        total_minutes,
        avg_call_cost,
        total_cost,
        total_spent,
        success_evaluation_true,
        success_evaluation_false,
        success_evaluation_null,
        AVG(total_call_duration) OVER (
          ORDER BY date
          ROWS BETWEEN ${days - 1} PRECEDING AND CURRENT ROW
        ) as rolling_avg_duration,
        AVG(outbound_call_count + web_call_count) OVER (
          ORDER BY date
          ROWS BETWEEN ${days - 1} PRECEDING AND CURRENT ROW
        ) as rolling_avg_total_calls,
        AVG(total_minutes) OVER (
          ORDER BY date
          ROWS BETWEEN ${days - 1} PRECEDING AND CURRENT ROW
        ) as rolling_avg_minutes,
        AVG(avg_call_cost) OVER (
          ORDER BY date
          ROWS BETWEEN ${days - 1} PRECEDING AND CURRENT ROW
        ) as rolling_avg_call_cost,
        AVG(total_cost) OVER (
          ORDER BY date
          ROWS BETWEEN ${days - 1} PRECEDING AND CURRENT ROW
        ) as rolling_avg_total_cost
      FROM metrics
      WHERE assistant_id = ${assistantId}
      ORDER BY date DESC
      LIMIT 30
    `;

		return result;
	}

	async getAggregatedMetrics(assistantId: number) {
		const result = await this.prisma.metric.aggregate({
			where: { assistantId },
			_sum: {
				totalCallDuration: true,
				outboundCallCount: true,
				webCallCount: true,
				failedCustomerEndedCallCount: true,
				failedAssistantEndedCallCount: true,
				failedCustomerNoAnswerCallCount: true,
				failedExceedDurationCallCount: true,
				failedCustomerBusyCallCount: true,
				failedSilenceTimeoutCallCount: true,
				failedOtherCallCount: true,
				totalMinutes: true,
				totalCost: true,
				totalSpent: true,
				successEvaluationTrue: true,
				successEvaluationFalse: true,
				successEvaluationNull: true,
			},
			_avg: {
				avgCallCost: true,
				totalCallDuration: true,
				totalMinutes: true,
				totalCost: true,
				totalSpent: true,
			},
			_count: {
				assistantId: true,
			},
		});

		return result;
	}

	async getDailyAverages(assistantId: number, days: number = 30) {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		return this.prisma.metric.findMany({
			where: {
				assistantId,
				date: {
					gte: startDate,
				},
			},
			orderBy: {
				date: "asc",
			},
		});
	}

	async bulkUpdate(updateAll: boolean, metrics: any[]) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		// Process data by combining different metric types by assistantId and date
		const processedData = new Map<string, any>();
		
		for (const metricGroup of metrics) {
		// Skip processing if timeRange.step is not "minute"
		if (metricGroup.timeRange && metricGroup.timeRange.step !== 'minute') {
			continue;
		}

			for (const result of metricGroup.result) {
				if (!result.assistantId || !result.date) continue;
				
				const key = `${result.assistantId}_${result.date}`;
				const resultDate = new Date(result.date);
				resultDate.setHours(0, 0, 0, 0);
				
				// Skip if updateAll is false and date is not today
				if (!updateAll && resultDate.getTime() !== today.getTime()) {
					continue;
				}
				
				if (!processedData.has(key)) {
					processedData.set(key, {
						vapiId: result.assistantId,
						date: result.date,
						totalCallDuration: 0,
						outboundCallCount: 0,
						webCallCount: 0,
						failedCustomerEndedCallCount: 0,
						failedAssistantEndedCallCount: 0,
						failedCustomerNoAnswerCallCount: 0,
						failedExceedDurationCallCount: 0,
						failedCustomerBusyCallCount: 0,
						failedSilenceTimeoutCallCount: 0,
						failedOtherCallCount: 0,
						totalMinutes: 0,
						avgCallCost: 0,
						totalCost: 0,
						totalSpent: 0,
						successEvaluationTrue: 0,
						successEvaluationFalse: 0,
						successEvaluationNull: 0,
					});
				}
				
				const data = processedData.get(key);
				
				// Map different metric types to our schema
				if (metricGroup.name === "Total Call Duration") {
					data.totalCallDuration = result.sumDuration || 0;
				} else if (metricGroup.name === "Number of Calls by Type") {
					if (result.type === "outboundPhoneCall") {
						data.outboundCallCount += parseInt(result.countId) || 0;
					} else if (result.type === "webCall") {
						data.webCallCount += parseInt(result.countId) || 0;
					}
				} else if (metricGroup.name === "Number of Failed Calls") {
					const count = parseInt(result.countId) || 0;
					// Map endedReason to specific failed call count columns
					switch (result.endedReason) {
						case "customer-ended-call":
							data.failedCustomerEndedCallCount += count;
							break;
						case "assistant-ended-call":
							data.failedAssistantEndedCallCount += count;
							break;
						case "customer-did-not-answer":
							data.failedCustomerNoAnswerCallCount += count;
							break;
						case "exceeded-max-duration":
							data.failedExceedDurationCallCount += count;
							break;
						case "customer-busy":
							data.failedCustomerBusyCallCount += count;
							break;
						case "silence-timed-out":
							data.failedSilenceTimeoutCallCount += count;
							break;
						default:
							// If endedReason is not recognized, add to other category
							data.failedOtherCallCount += count;
							break;
					}
				} else if (metricGroup.name === "Total Minutes") {
					data.totalMinutes = result.sumDuration || 0;
				} else if (metricGroup.name === "Average Call Cost") {
					data.avgCallCost = result.avgCost || 0;
				} else if (metricGroup.name === "Total Spent") {
					data.totalCost = result.sumCost || 0;
					data.totalSpent = result.sumCost || 0;
				} else if (metricGroup.name === "LLM, STT, TTS, VAPI Costs") {
					const totalCostBreakdown = (result.sumCostBreakdownLlm || 0) + 
											(result.sumCostBreakdownStt || 0) + 
											(result.sumCostBreakdownTts || 0) + 
											(result.sumCostBreakdownVapi || 0);
					data.totalCost = totalCostBreakdown;
					data.totalSpent = totalCostBreakdown;
				} else if (metricGroup.name === "Success Evaluation") {
					if (result["analysis.successEvaluation"] === "true") {
						data.successEvaluationTrue += parseInt(result.countId) || 0;
					} else if (result["analysis.successEvaluation"] === "false") {
						data.successEvaluationFalse += parseInt(result.countId) || 0;
					} else if (result["analysis.successEvaluation"] === "" || result["analysis.successEvaluation"] === null) {
						data.successEvaluationNull += parseInt(result.countId) || 0;
					}
				}
			}
		}
		
		// Get VAPI ID to assistant ID mappings
		const vapiIds = Array.from(new Set(Array.from(processedData.values()).map(d => d.vapiId)));
		const assistants = await this.prisma.assistant.findMany({
			where: { vapiId: { in: vapiIds } },
			select: { id: true, vapiId: true },
		});
		
		const vapiIdToAssistantId = new Map();
		assistants.forEach(assistant => {
			if (assistant.vapiId) {
				vapiIdToAssistantId.set(assistant.vapiId, assistant.id);
			}
		});
		
		// Process and upsert metrics
		const results = [];
		for (const data of processedData.values()) {
			const assistantId = vapiIdToAssistantId.get(data.vapiId);
			if (!assistantId) {
				console.warn(`Assistant not found for VAPI ID: ${data.vapiId}`);
				continue;
			}
			
			const result = await this.prisma.metric.upsert({
				where: {
					assistantId_date: {
						assistantId,
						date: new Date(data.date),
					},
				},
				update: {
					totalCallDuration: data.totalCallDuration,
					outboundCallCount: data.outboundCallCount,
					webCallCount: data.webCallCount,
					failedCustomerEndedCallCount: data.failedCustomerEndedCallCount,
					failedAssistantEndedCallCount: data.failedAssistantEndedCallCount,
					failedCustomerNoAnswerCallCount: data.failedCustomerNoAnswerCallCount,
					failedExceedDurationCallCount: data.failedExceedDurationCallCount,
					failedCustomerBusyCallCount: data.failedCustomerBusyCallCount,
					failedSilenceTimeoutCallCount: data.failedSilenceTimeoutCallCount,
					failedOtherCallCount: data.failedOtherCallCount,
					totalMinutes: data.totalMinutes,
					avgCallCost: data.avgCallCost,
					totalCost: data.totalCost,
					totalSpent: data.totalSpent,
					successEvaluationTrue: data.successEvaluationTrue,
					successEvaluationFalse: data.successEvaluationFalse,
					successEvaluationNull: data.successEvaluationNull,
				},
				create: {
					assistantId,
					date: new Date(data.date),
					totalCallDuration: data.totalCallDuration,
					outboundCallCount: data.outboundCallCount,
					webCallCount: data.webCallCount,
					failedCustomerEndedCallCount: data.failedCustomerEndedCallCount,
					failedAssistantEndedCallCount: data.failedAssistantEndedCallCount,
					failedCustomerNoAnswerCallCount: data.failedCustomerNoAnswerCallCount,
					failedExceedDurationCallCount: data.failedExceedDurationCallCount,
					failedCustomerBusyCallCount: data.failedCustomerBusyCallCount,
					failedSilenceTimeoutCallCount: data.failedSilenceTimeoutCallCount,
					failedOtherCallCount: data.failedOtherCallCount,
					totalMinutes: data.totalMinutes,
					avgCallCost: data.avgCallCost,
					totalCost: data.totalCost,
					totalSpent: data.totalSpent,
					successEvaluationTrue: data.successEvaluationTrue,
					successEvaluationFalse: data.successEvaluationFalse,
					successEvaluationNull: data.successEvaluationNull,
				},
				include: {
					assistant: {
						select: {
							id: true,
							name: true,
							modelType: true,
						},
					},
				},
			});
			results.push(result);
		}
		
		return {
			message: `Successfully processed ${results.length} metrics`,
			processed: results.length,
			results,
		};
	}

	async getAnalytics(userId: number, analyticsDto: AnalyticsDto) {
		// Build assistant filter - either specific assistant or all user's assistants
		let assistantWhere: any = { userId };
		if (analyticsDto.assistantId) {
			assistantWhere.id = parseInt(analyticsDto.assistantId);
		}

		// Get user's assistants
		const assistants = await this.prisma.assistant.findMany({
			where: assistantWhere,
			select: { id: true, name: true, modelType: true },
		});

		if (assistants.length === 0) {
			return {
				assistants: [],
				data: [],
				summary: {
					totalAssistants: 0,
					dateRange: { start: null, end: null },
					timeRange: analyticsDto.timeRange || TimeRange.DAILY,
				},
			};
		}

		const assistantIds = assistants.map(a => a.id);

		// Build date filter
		const dateWhere: any = {};
		if (analyticsDto.startDate || analyticsDto.endDate) {
			if (analyticsDto.startDate) dateWhere.gte = new Date(analyticsDto.startDate);
			if (analyticsDto.endDate) {
				const endDate = new Date(analyticsDto.endDate);
				endDate.setHours(23, 59, 59, 999); // End of day
				dateWhere.lte = endDate;
			}
		}

		// Build the SQL query based on time range
		const timeRange = analyticsDto.timeRange || TimeRange.DAILY;
		let dateGroupBy: string;
		let dateSelect: string;
		let orderBy: string;

		switch (timeRange) {
			case TimeRange.WEEKLY:
				dateGroupBy = "DATE_TRUNC('week', \"date\")";
				dateSelect = "DATE_TRUNC('week', \"date\") as period";
				orderBy = "DATE_TRUNC('week', \"date\") DESC";
				break;
			case TimeRange.MONTHLY:
				dateGroupBy = "DATE_TRUNC('month', \"date\")";
				dateSelect = "DATE_TRUNC('month', \"date\") as period";
				orderBy = "DATE_TRUNC('month', \"date\") DESC";
				break;
			case TimeRange.YEARLY:
				dateGroupBy = "DATE_TRUNC('year', \"date\")";
				dateSelect = "DATE_TRUNC('year', \"date\") as period";
				orderBy = "DATE_TRUNC('year', \"date\") DESC";
				break;
			case TimeRange.DAILY:
			default:
				dateGroupBy = "\"date\"";
				dateSelect = "\"date\" as period";
				orderBy = "\"date\" DESC";
				break;
		}

		// Build the where clause for raw SQL
		let sqlWhere = `"assistantId" = ANY($1::int[])`;
		const queryParams: any[] = [assistantIds];
		let paramIndex = 2;

		if (analyticsDto.startDate) {
			sqlWhere += ` AND "date" >= $${paramIndex}`;
			queryParams.push(new Date(analyticsDto.startDate));
			paramIndex++;
		}

		if (analyticsDto.endDate) {
			const endDate = new Date(analyticsDto.endDate);
			endDate.setHours(23, 59, 59, 999);
			sqlWhere += ` AND "date" <= $${paramIndex}`;
			queryParams.push(endDate);
			paramIndex++;
		}

		// Execute the aggregation query
		const aggregatedData = await this.prisma.$queryRawUnsafe(`
			SELECT
				${dateSelect},
				COALESCE(SUM("totalCallDuration"), 0)::FLOAT as total_call_duration,
				COALESCE(SUM("outboundCallCount"), 0)::INTEGER as total_outbound_calls,
				COALESCE(SUM("webCallCount"), 0)::INTEGER as total_web_calls,
				COALESCE(SUM("outboundCallCount" + "webCallCount"), 0)::INTEGER as total_calls,
				COALESCE(SUM("failedCustomerEndedCallCount"), 0)::INTEGER as total_failed_customer_ended,
				COALESCE(SUM("failedAssistantEndedCallCount"), 0)::INTEGER as total_failed_assistant_ended,
				COALESCE(SUM("failedCustomerNoAnswerCallCount"), 0)::INTEGER as total_failed_customer_no_answer,
				COALESCE(SUM("failedExceedDurationCallCount"), 0)::INTEGER as total_failed_exceed_duration,
				COALESCE(SUM("failedCustomerBusyCallCount"), 0)::INTEGER as total_failed_customer_busy,
				COALESCE(SUM("failedSilenceTimeoutCallCount"), 0)::INTEGER as total_failed_silence_timeout,
				COALESCE(SUM("failedOtherCallCount"), 0)::INTEGER as total_failed_other,
				COALESCE(SUM(
					"failedCustomerEndedCallCount" +
					"failedAssistantEndedCallCount" +
					"failedCustomerNoAnswerCallCount" +
					"failedExceedDurationCallCount" +
					"failedCustomerBusyCallCount" +
					"failedSilenceTimeoutCallCount" +
					"failedOtherCallCount"
				), 0)::INTEGER as total_failed_calls,
				COALESCE(SUM("totalMinutes"), 0)::FLOAT as total_minutes,
				COALESCE(AVG("avgCallCost"), 0)::FLOAT as avg_call_cost,
				COALESCE(SUM("totalCost"), 0)::FLOAT as total_cost,
				COALESCE(SUM("totalSpent"), 0)::FLOAT as total_spent,
				COALESCE(SUM("successEvaluationTrue"), 0)::INTEGER as total_success_true,
				COALESCE(SUM("successEvaluationFalse"), 0)::INTEGER as total_success_false,
				COALESCE(SUM("successEvaluationNull"), 0)::INTEGER as total_success_null,
				COUNT(DISTINCT "assistantId")::INTEGER as unique_assistants
			FROM metrics
			WHERE ${sqlWhere}
			GROUP BY ${dateGroupBy}
			ORDER BY ${orderBy}
		`, ...queryParams);

		// Calculate overall summary stats
		const summaryData = await this.prisma.$queryRawUnsafe(`
			SELECT
				COALESCE(SUM("totalCallDuration"), 0)::FLOAT as total_call_duration,
				COALESCE(SUM("outboundCallCount" + "webCallCount"), 0)::INTEGER as total_calls,
				COALESCE(SUM(
					"failedCustomerEndedCallCount" +
					"failedAssistantEndedCallCount" +
					"failedCustomerNoAnswerCallCount" +
					"failedExceedDurationCallCount" +
					"failedCustomerBusyCallCount" +
					"failedSilenceTimeoutCallCount" +
					"failedOtherCallCount"
				), 0)::INTEGER as total_failed_calls,
				COALESCE(SUM("totalMinutes"), 0)::FLOAT as total_minutes,
				COALESCE(SUM("totalCost"), 0)::FLOAT as total_cost,
				COALESCE(SUM("totalSpent"), 0)::FLOAT as total_spent,
				MIN("date") as earliest_date,
				MAX("date") as latest_date
			FROM metrics
			WHERE ${sqlWhere}
		`, ...queryParams);

		return {
			assistants: assistants,
			data: aggregatedData,
			summary: {
				totalAssistants: assistants.length,
				dateRange: {
					start: summaryData[0]?.earliest_date || null,
					end: summaryData[0]?.latest_date || null,
				},
				timeRange: timeRange,
				totals: summaryData[0] || {},
			},
		};
	}
}
