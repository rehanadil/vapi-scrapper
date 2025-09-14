import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAssistantDto } from "./dto/create-assistant.dto";

@Injectable()
export class AssistantsService {
	constructor(private prisma: PrismaService) {}

	async create(userId: number, createAssistantDto: CreateAssistantDto) {
		return this.prisma.assistant.create({
			data: {
				...createAssistantDto,
				userId,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});
	}

	async findAll(userId?: number) {
		const where = userId ? { userId } : {};

		return this.prisma.assistant.findMany({
			where,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				_count: {
					select: {
						metrics: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async findOne(id: number) {
		const assistant = await this.prisma.assistant.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				_count: {
					select: {
						metrics: true,
					},
				},
			},
		});

		if (!assistant) {
			throw new NotFoundException("Assistant not found");
		}

		return assistant;
	}

	async remove(id: number) {
		return this.prisma.assistant.delete({
			where: { id },
		});
	}
}
