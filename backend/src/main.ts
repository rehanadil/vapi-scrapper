import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Increase body size limit for bulk data uploads
	app.use(require('express').json({ limit: '50mb' }));
	app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

	// Enable CORS
	app.enableCors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or Postman)
			if (!origin) return callback(null, true);

			const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

			// Allow frontend URL
			if (origin === frontendUrl) {
				return callback(null, true);
			}

			// Allow any vapi.ai subdomain for bulk metrics
			if (origin.includes('vapi.ai') || origin.includes('dashboard.vapi.ai')) {
				return callback(null, true);
			}

			// Deny other origins
			callback(new Error('Not allowed by CORS'));
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});

	// Global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		})
	);

	// Swagger documentation
	const config = new DocumentBuilder()
		.setTitle("Assistant Metrics API")
		.setDescription("API for managing assistants and their metrics")
		.setVersion("1.0")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	await app.listen(process.env.PORT || 3001);
}
bootstrap();
