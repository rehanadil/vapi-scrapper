import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
	Request,
} from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { AssistantsService } from "./assistants.service";
import { CreateAssistantDto } from "./dto/create-assistant.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("assistants")
@Controller("assistants")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssistantsController {
	constructor(private assistantsService: AssistantsService) {}

	@Post()
	@ApiOperation({ summary: "Create a new assistant" })
	@ApiResponse({ status: 201, description: "Assistant created successfully" })
	async create(
		@Request() req,
		@Body() createAssistantDto: CreateAssistantDto
	) {
		return this.assistantsService.create(req.user.id, createAssistantDto);
	}

	@Get()
	@ApiOperation({ summary: "Get all assistants for current user" })
	@ApiResponse({
		status: 200,
		description: "Assistants retrieved successfully",
	})
	async findAll(@Request() req) {
		return this.assistantsService.findAll(req.user.id);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get assistant by ID" })
	@ApiResponse({
		status: 200,
		description: "Assistant retrieved successfully",
	})
	@ApiResponse({ status: 404, description: "Assistant not found" })
	async findOne(@Param("id") id: string) {
		return this.assistantsService.findOne(+id);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete assistant" })
	@ApiResponse({ status: 200, description: "Assistant deleted successfully" })
	@ApiResponse({ status: 404, description: "Assistant not found" })
	async remove(@Param("id") id: string) {
		return this.assistantsService.remove(+id);
	}
}
