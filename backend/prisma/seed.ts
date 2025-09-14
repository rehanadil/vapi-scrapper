import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	// Create or find sample users
	const hashedPassword = await bcrypt.hash("1234", 10);

	const user1 = await prisma.user.upsert({
		where: { email: "rehanadil.dev@gmail.com" },
		update: {},
		create: {
			name: "Rehan Adil",
			email: "rehanadil.dev@gmail.com",
			password: hashedPassword,
			role: "admin",
		},
	});

	const user2 = await prisma.user.upsert({
		where: { email: "jane@example.com" },
		update: {},
		create: {
			name: "Jane Smith",
			email: "jane@example.com",
			password: hashedPassword,
		},
	});

	// Create sample assistants
	const assistant1 = await prisma.assistant.create({
		data: {
			name: "GPT-4 Assistant",
			modelType: "GPT-4",
			userId: user1.id,
		},
	});

	const assistant2 = await prisma.assistant.create({
		data: {
			name: "Claude Assistant",
			modelType: "Claude-3",
			userId: user1.id,
		},
	});

	const assistant3 = await prisma.assistant.create({
		data: {
			name: "Gemini Assistant",
			modelType: "Gemini-Pro",
			userId: user2.id,
		},
	});

	// Create sample metrics for the last 30 days
	const now = new Date();
	const metricsData = [];

	for (let i = 0; i < 30; i++) {
		const date = new Date(now);
		date.setDate(date.getDate() - i);
		date.setHours(0, 0, 0, 0);

		// Assistant 1 metrics
		const outbound1 = Math.floor(Math.random() * 40) + 5;
		const web1 = Math.floor(Math.random() * 10) + 2;
		const failed1 = Math.floor(Math.random() * 8) + 1;
		const totalCalls1 = outbound1 + web1;
		
		metricsData.push({
			assistantId: assistant1.id,
			date,
			totalCallDuration: parseFloat((Math.random() * 500 + 100).toFixed(2)),
			outboundCallCount: outbound1,
			webCallCount: web1,
			failedCallCount: failed1,
			totalMinutes: parseFloat((Math.random() * 300 + 60).toFixed(2)),
			avgCallCost: parseFloat((Math.random() * 0.5 + 0.1).toFixed(3)),
			totalCost: parseFloat((Math.random() * 25 + 5).toFixed(2)),
			totalSpent: parseFloat((Math.random() * 25 + 5).toFixed(2)),
			successEvaluationTrue: Math.floor(totalCalls1 * 0.4),
			successEvaluationFalse: Math.floor(totalCalls1 * 0.3),
			successEvaluationNull: Math.floor(totalCalls1 * 0.3),
		});

		// Assistant 2 metrics
		const outbound2 = Math.floor(Math.random() * 35) + 3;
		const web2 = Math.floor(Math.random() * 8) + 1;
		const failed2 = Math.floor(Math.random() * 6) + 1;
		const totalCalls2 = outbound2 + web2;
		
		metricsData.push({
			assistantId: assistant2.id,
			date,
			totalCallDuration: parseFloat((Math.random() * 400 + 80).toFixed(2)),
			outboundCallCount: outbound2,
			webCallCount: web2,
			failedCallCount: failed2,
			totalMinutes: parseFloat((Math.random() * 250 + 30).toFixed(2)),
			avgCallCost: parseFloat((Math.random() * 0.4 + 0.08).toFixed(3)),
			totalCost: parseFloat((Math.random() * 20 + 3).toFixed(2)),
			totalSpent: parseFloat((Math.random() * 20 + 3).toFixed(2)),
			successEvaluationTrue: Math.floor(totalCalls2 * 0.5),
			successEvaluationFalse: Math.floor(totalCalls2 * 0.25),
			successEvaluationNull: Math.floor(totalCalls2 * 0.25),
		});

		// Assistant 3 metrics
		const outbound3 = Math.floor(Math.random() * 30) + 5;
		const web3 = Math.floor(Math.random() * 6) + 1;
		const failed3 = Math.floor(Math.random() * 5) + 1;
		const totalCalls3 = outbound3 + web3;
		
		metricsData.push({
			assistantId: assistant3.id,
			date,
			totalCallDuration: parseFloat((Math.random() * 350 + 60).toFixed(2)),
			outboundCallCount: outbound3,
			webCallCount: web3,
			failedCallCount: failed3,
			totalMinutes: parseFloat((Math.random() * 200 + 40).toFixed(2)),
			avgCallCost: parseFloat((Math.random() * 0.3 + 0.05).toFixed(3)),
			totalCost: parseFloat((Math.random() * 15 + 2).toFixed(2)),
			totalSpent: parseFloat((Math.random() * 15 + 2).toFixed(2)),
			successEvaluationTrue: Math.floor(totalCalls3 * 0.45),
			successEvaluationFalse: Math.floor(totalCalls3 * 0.35),
			successEvaluationNull: Math.floor(totalCalls3 * 0.2),
		});
	}

	// Insert all metrics
	await prisma.metric.createMany({
		data: metricsData,
	});

	console.log("Seed data created successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
