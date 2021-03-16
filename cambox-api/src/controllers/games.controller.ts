import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Token } from 'src/decorators/token.decorator';
import { AuthToken } from 'src/types/interfaces/AuthToken';
import { UploadService } from 'src/services/upload.service';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { Readable } from 'stream';
import * as path from 'path';

@Controller('games')
export class GamesController {
    constructor(
        private uploadService: UploadService
    ) {}
    
    @Post( 'upload' )
    @UseInterceptors( FileInterceptor( 'file' ) ) 
    async uploadGame( @UploadedFile() file: Express.Multer.File, @Token() userToken: AuthToken ) {
        //Our consumers use streams and we have a buffer, so... add a resolver to pass around since streams can be read once
        const getStream = () => {
            const readable = new Readable();
            readable._read = () => {};
            readable.push( file.buffer );
            readable.push( null );
            return readable;
        }

        try {
            await this.uploadService.verifyGamePackage( path.basename( file.originalname, '.zip' ), getStream );
        } catch( uploadException ) {
            return {
                ok: false,
                error: uploadException
            }
        }
        
        return { ok: true };
    }
}
