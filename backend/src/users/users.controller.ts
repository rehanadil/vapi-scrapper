import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	@ApiOperation({ summary: "Get all users" })
	@ApiResponse({ status: 200, description: "Users retrieved successfully" })
	async findAll() {
		return this.usersService.findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "Get user by ID" })
	@ApiResponse({ status: 200, description: "User retrieved successfully" })
	@ApiResponse({ status: 404, description: "User not found" })
	async findOne(@Param("id") id: string) {
		return this.usersService.findOne(+id);
	}
}
