import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AssistantsService } from "./assistants.service";
import { AssistantsController } from "./assistants.controller";

@Module({
	imports: [PrismaModule],
	controllers: [AssistantsController],
	providers: [AssistantsService],
	exports: [AssistantsService],
})
export class AssistantsModule {}
