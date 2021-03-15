import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthToken } from "src/types/interfaces/AuthToken";

export const Token = createParamDecorator(
    ( data: unknown, context: ExecutionContext ): AuthToken | null => {
        const request = context.switchToHttp().getRequest();

        return request.token ? request.token : null;
    }
);