import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { SecurityService } from "src/services/security.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly securityService: SecurityService
    ) {}

    canActivate(
        context: ExecutionContext
    ): boolean {
        const request = context.switchToHttp().getRequest() as Request;
        const authHeader = request.header('Authorization');
        if( !authHeader ) return false;

        const token = authHeader.split('Bearer ')[1];

        (request as any).token = this.securityService.getTokenData( token );
        return this.securityService.validateToken( token );
    }
}