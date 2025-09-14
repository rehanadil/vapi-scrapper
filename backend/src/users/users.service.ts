import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findOne(id: number) {
		return this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
				assistants: {
					select: {
						id: true,
						name: true,
						modelType: true,
						createdAt: true,
					},
				},
			},
		});
	}

	async findAll() {
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
		});
	}

	async create(data: { name: string; email: string; password: string; role?: string }) {
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

	async update(id: number, data: { name?: string; email?: string; role?: string }) {
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

	async delete(id: number) {
		return this.prisma.user.delete({
			where: { id },
		});
	}
}
