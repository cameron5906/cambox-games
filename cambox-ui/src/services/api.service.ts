import {
    ApiResponse,
    AuthenticateResponseData,
    CreateRoomResponseData,
    JoinResponseData
} from '@cambox/common/types/models/api';
import { GameDetails } from '@cambox/common/types/models/GameDetails';
import { apiBasePath } from '../settings.json';

class ApiService {
    async authenticate( email: string ): Promise<ApiResponse<AuthenticateResponseData>> {
        return await this.post( 'authenticate', {
            email
        } );
    }

    async createRoom(): Promise<ApiResponse<CreateRoomResponseData>> {
        return await this.post( 'create' );
    }

    async setRoomReady(): Promise<ApiResponse<any>> {
        return await this.post( 'ready' );
    }

    async joinRoom( roomCode: string ): Promise<ApiResponse<JoinResponseData>> {
        return await this.post( 'join', {
            roomCode
        })
    }

    async startGame( gameId: string ): Promise<ApiResponse<any>> {
        return await this.post( 'start', { gameId } );
    }

    async stopGame(): Promise<ApiResponse<any>> {
        return await this.post( 'stop' );
    }

    async getGames(): Promise<ApiResponse<GameDetails[]>> {
        return this.get( 'games' );
    }

    private async post<T>( endpoint: string, body?: any ): Promise<T> {
        const response = await fetch( `${apiBasePath}/${endpoint}`, { 
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify( body || {} )
        } );

        if( !response.ok ) throw `Error performing POST on ${endpoint}`;
        return await response.json();
    }

    private async get<T>( endpoint: string ): Promise<T> {
        const response = await fetch( `${apiBasePath}/${endpoint}`, {
            headers: this.getHeaders()
        } );

        if( !response.ok ) throw `Error performing GET on ${endpoint}`;
        return await response.json();
    }

    private getHeaders() {
        const token = localStorage.getItem( 'token' );

        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...( token ? {
                'Authorization': `Bearer ${token}`
            } : {})
        };
    }
}

export default new ApiService;