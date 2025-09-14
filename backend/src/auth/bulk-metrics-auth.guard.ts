import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class BulkMetricsAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();

		// Skip auth for OPTIONS preflight requests
		if (request.method === 'OPTIONS') {
			return true;
		}

		const authHeader = request.headers.authorization;

		if (!authHeader) {
			throw new UnauthorizedException("Authorization header is required");
		}

		const bulkMetricsSecret = process.env.BULK_METRICS_SECRET_KEY;

		if (!bulkMetricsSecret) {
			throw new UnauthorizedException("Bulk metrics secret key not configured");
		}

		// Support both "Bearer token" and "token" formats
		const token = authHeader.startsWith("Bearer ")
			? authHeader.substring(7)
			: authHeader;

		if (token !== bulkMetricsSecret) {
			throw new UnauthorizedException("Invalid secret key");
		}

		return true;
	}
}