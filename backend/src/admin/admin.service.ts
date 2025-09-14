import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
	constructor(private prisma: PrismaService) {}

	// User Management
	async getAllUsers() {
		return this.prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
				_count: {
					select: {
						assistants: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async createUser(data: { name: string; email: string; password: string; role: string }) {
		return this.prisma.user.create({
			data,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});
	}

	async updateUser(id: number, data: { name?: string; email?: string; role?: string }) {
		return this.prisma.user.update({
			where: { id },
			data,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});
	}

	async deleteUser(id: number) {
		return this.prisma.user.delete({
			where: { id },
		});
	}

	// Assistant Management
	async getAllAssistants() {
		return this.prisma.assistant.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
				_count: {
					select: {
						metrics: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async createAssistant(data: { name: string; modelType: string; vapiId?: string; userId?: number }) {
		const createData: any = {
			name: data.name,
			modelType: data.modelType,
		};

		if (data.vapiId) {
			createData.vapiId = data.vapiId;
		}

		if (data.userId) {
			createData.userId = data.userId;
		}

		return this.prisma.assistant.create({
			data: createData,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
		});
	}

	async updateAssistant(id: number, data: { name?: string; modelType?: string; vapiId?: string; userId?: number }) {
		const updateData: any = {};

		if (data.name !== undefined) {
			updateData.name = data.name;
		}

		if (data.modelType !== undefined) {
			updateData.modelType = data.modelType;
		}

		if (data.vapiId !== undefined) {
			updateData.vapiId = data.vapiId;
		}

		if (data.userId !== undefined) {
			updateData.userId = data.userId;
		}

		return this.prisma.assistant.update({
			where: { id },
			data: updateData,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
		});
	}

	async deleteAssistant(id: number) {
		return this.prisma.assistant.delete({
			where: { id },
		});
	}

	async linkAssistantToUser(assistantId: number, userId: number) {
		return this.prisma.assistant.update({
			where: { id: assistantId },
			data: { userId },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
		});
	}
}