import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, LoginDto } from "./dto/auth.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async register(createUserDto: CreateUserDto) {
		const { name, email, password } = createUserDto;

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await this.prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		const token = this.jwtService.sign({
			userId: user.id,
			email: user.email,
		});

		return {
			user,
			token,
		};
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;

		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const token = this.jwtService.sign({
			userId: user.id,
			email: user.email,
		});

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
			},
			token,
		};
	}

	async validateUser(payload: any) {
		return this.prisma.user.findUnique({
			where: { id: payload.userId },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});
	}
}
