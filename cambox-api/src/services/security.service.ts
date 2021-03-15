import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

const SIGNING_KEY: string = process.env.CAMBOX_GAMES_SIGNING_KEY;

@Injectable()
export class SecurityService {
    /**
     * Generates a JWT token containing the provided data
     * @param payload The data to include into the security token
     */
    generateToken( payload: any ): string {
        return jwt.sign( payload, SIGNING_KEY );
    }

    /**
     * Checks whether a given token contains valid data and is still active
     * @param token The JWT string
     */
    validateToken( token: string ): boolean {
        try {
            jwt.verify( token, SIGNING_KEY );

            return true;
        } catch( ex ) {
            return false;
        }
    }

    /**
     * Retrieves the data contained within a JWT and casts to the specified return type
     * @param token The JWT string
     */
    getTokenData<T>( token: string ): T {
        return jwt.decode( token ) as T;
    }
}
