import { Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Token } from 'src/decorators/token.decorator';
import { AuthToken } from 'src/types/interfaces/AuthToken';
import { UploadService } from 'src/services/upload.service';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { Readable } from 'stream';
import * as path from 'path';
import { createReadStream, existsSync, readFileSync } from 'fs';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/services/user.service';
import { GamesService } from 'src/services/games.service';
import { ApiResponse } from '@cambox/common';

@Controller('games')
export class GamesController {
    constructor(
        private readonly userService: UserService,
        private readonly gamesService: GamesService,
        private readonly uploadService: UploadService
    ) {}
    
    @Post( 'upload' )
    @UseGuards( AuthGuard )
    @UseInterceptors( FileInterceptor( 'file', { limits: { files: 1 } } ) ) 
    async uploadGame( @UploadedFile() file: Express.Multer.File, @Token() userToken: { id } ): Promise<ApiResponse<any>> {
        const user = await this.userService.getUserById( userToken.id );
        
        if( !user ) return {
            ok: false,
            error: 'Invalid developer token'
        };

        if( path.extname( file.originalname ) !== '.zip' ) return {
            ok: false,
            error: 'Invalid game pack file type. Must be a ZIP file.'
        };

        //Our consumers use streams and we have a buffer, so... add a resolver to pass around since streams can be read once
        const getStream = () => {
            const readable = new Readable();
            readable._read = () => {};
            readable.push( file.buffer );
            readable.push( null );
            return readable;
        }

        try {
            const manifest = await this.uploadService.verifyGamePackage( path.basename( file.originalname, '.zip' ), getStream );

            if( !(await this.gamesService.isAllowedToUpload( manifest, user ) ) ) return {
                ok: false,
                error: 'You are not allowed to modify this game'
            };

            await this.gamesService.upsertGame( manifest, user );
            await this.uploadService.deployPackage( manifest, getStream );
        } catch( uploadException ) {
            console.log( uploadException );
            return {
                ok: false,
                error: typeof(uploadException) === 'object' ? 'Sever error' : uploadException
            }
        }
        
        return { ok: true };
    }

    @Get( ':id/icon' )
    @HttpCode( HttpStatus.OK )
    @Header( 'Content-Type', 'image/png' )
    async getGameIcon( @Param('id') gameId: string, @Response() response ) {
        const iconPath = path.join( __dirname, '../', 'games', gameId, 'icon.png' );

        if( existsSync( iconPath )) {
            createReadStream( iconPath ).pipe( response );
        } else {
            console.warn( `Icon not found for ${gameId}` );
            return null;
        }
    }
}
