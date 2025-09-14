import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AssistantsModule } from "./assistants/assistants.module";
import { MetricsModule } from "./metrics/metrics.module";
import { AdminModule } from "./admin/admin.module";

@Module({
	imports: [
		PrismaModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || "your-secret-key",
			signOptions: { expiresIn: "24h" },
		}),
		AuthModule,
		UsersModule,
		AssistantsModule,
		MetricsModule,
		AdminModule,
	],
})
export class AppModule {}
