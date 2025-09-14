import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	UseGuards,
	BadRequestException,
	ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '@prisma/client';
import { AdminService } from './admin.service';
import * as bcrypt from 'bcryptjs';

interface CreateUserDto {
	name: string;
	email: string;
	password: string;
	role: string;
}

interface UpdateUserDto {
	name?: string;
	email?: string;
	role?: string;
}

interface CreateAssistantDto {
	name: string;
	modelType: string;
	vapiId?: string;
	userId?: number;
}

interface UpdateAssistantDto {
	name?: string;
	modelType?: string;
	vapiId?: string;
	userId?: number;
}

interface LinkAssistantDto {
	userId: number;
}

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	private checkAdminRole(user: User) {
		if (user.role !== 'admin') {
			throw new ForbiddenException('Admin access required');
		}
	}

	// User Management Routes
	@Get('users')
	async getAllUsers(@GetUser() user: User) {
		this.checkAdminRole(user);
		return this.adminService.getAllUsers();
	}

	@Post('users')
	async createUser(@GetUser() user: User, @Body() createUserDto: CreateUserDto) {
		this.checkAdminRole(user);
		
		const { name, email, password, role } = createUserDto;
		
		if (!name || !email || !password) {
			throw new BadRequestException('Name, email, and password are required');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		
		return this.adminService.createUser({
			name,
			email,
			password: hashedPassword,
			role: role || 'customer',
		});
	}

	@Put('users/:id')
	async updateUser(
		@GetUser() user: User,
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto
	) {
		this.checkAdminRole(user);
		return this.adminService.updateUser(parseInt(id), updateUserDto);
	}

	@Delete('users/:id')
	async deleteUser(@GetUser() user: User, @Param('id') id: string) {
		this.checkAdminRole(user);
		return this.adminService.deleteUser(parseInt(id));
	}

	// Assistant Management Routes
	@Get('assistants')
	async getAllAssistants(@GetUser() user: User) {
		this.checkAdminRole(user);
		return this.adminService.getAllAssistants();
	}

	@Post('assistants')
	async createAssistant(
		@GetUser() user: User,
		@Body() createAssistantDto: CreateAssistantDto
	) {
		this.checkAdminRole(user);
		
		const { name, modelType, vapiId, userId } = createAssistantDto;
		
		if (!name || !modelType) {
			throw new BadRequestException('Name and modelType are required');
		}
		
		return this.adminService.createAssistant({
			name,
			modelType,
			vapiId,
			userId,
		});
	}

	@Put('assistants/:id')
	async updateAssistant(
		@GetUser() user: User,
		@Param('id') id: string,
		@Body() updateAssistantDto: UpdateAssistantDto
	) {
		this.checkAdminRole(user);
		return this.adminService.updateAssistant(parseInt(id), updateAssistantDto);
	}

	@Delete('assistants/:id')
	async deleteAssistant(@GetUser() user: User, @Param('id') id: string) {
		this.checkAdminRole(user);
		return this.adminService.deleteAssistant(parseInt(id));
	}

	@Post('assistants/:id/link')
	async linkAssistantToUser(
		@GetUser() user: User,
		@Param('id') id: string,
		@Body() linkAssistantDto: LinkAssistantDto
	) {
		this.checkAdminRole(user);
		
		const { userId } = linkAssistantDto;
		
		if (!userId) {
			throw new BadRequestException('userId is required');
		}
		
		return this.adminService.linkAssistantToUser(parseInt(id), userId);
	}
}