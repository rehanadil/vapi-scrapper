import { IsArray, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BulkUpdateMetricsDto {
	@ApiProperty({ default: false })
	@IsBoolean()
	@IsOptional()
	updateAll?: boolean = false;

	@ApiProperty({ type: [Object] })
	@IsArray()
	metrics: any[];
}