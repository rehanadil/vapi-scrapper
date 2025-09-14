import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAssistantDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	modelType: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	vapiId?: string;
}
