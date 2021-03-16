import { Injectable } from '@nestjs/common';
import { ZipService } from './zip.service';
import { Readable } from 'stream';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
    constructor(
        private zipService: ZipService
    ) {}

    async verifyGamePackage( packageName: string, getZipStream: () => Readable ): Promise<boolean> {
        const contents = ( await this.zipService.readZipFileContents( getZipStream() ) )
            .map( fname => fname.split( `${packageName}/` )[1] );

        
        //Validate the package by doing some quick checks
        //1. Make sure there is a manifest file
        //2. Make sure the manifest file can be read
        //3. Check and make sure there is an index
        //4. Scan each JS file for illegal `require` calls or `process` calls
        if( !contents.some( f => f.indexOf( 'manifest.json' ) !== -1 ) ) throw 'No manifest definition was found in the game package';
        
        let manifest: { name: string, description: string, iconUrl: string };
        try {
            manifest = JSON.parse( 
                await this.zipService.getZipEntryContent( 
                    getZipStream(), 
                    `${packageName}/manifest.json` 
                ) 
            );

            if( typeof( manifest.name ) === 'undefined' ) throw 'No name in manifest';
            if( typeof( manifest.description ) === 'undefined' ) throw 'No description in manifest';
            if( typeof( manifest.iconUrl ) === 'undefined' ) throw 'No icon found in manifest';
        } catch( ex ) {
            throw 'Failed to parse manifest from game package';
        }

        if( !contents.some( f => f.indexOf( 'index.js' ) !== -1 ) ) throw 'No index file was found in the game package';
        if( await this.hasPossibleVunerabilities( getZipStream, contents.filter( x => path.extname( x ) === '.js' ).map( x => `${packageName}/${x}` ) ) ) {
            throw 'Vunerabilities detected. Please do not attempt to break out of the sandbox.';
        } 
        
        //Extract the package to the game directory
        const gameDir = path.join( __dirname, path.join( '../', 'games', packageName ) );
        if( contents.some( f => f.indexOf( '.ts' ) !== -1 ) ) {
            //They uploaded a Typescript project, let's just do this for them.. check if a dist folder exists
            if( contents.some( f => f.indexOf( 'dist/' ) !== -1 ) ) {
                await this.zipService.extractZip( 
                    gameDir,
                    getZipStream(),
                    `${packageName}/dist`,
                    [ '.git' ] 
                );
            } else {
                throw 'Game package must be in compiled JavaScript (Typescript found)';
            }
        } else {
            //Hoorah, they sent us JS! Simply extract.
            await this.zipService.extractZip( 
                gameDir,
                getZipStream(),
                packageName, 
                [ '.git' ] 
            );
        }

        //Copy over the manifest
        fs.writeFileSync( path.join( gameDir, 'manifest.json' ), JSON.stringify( manifest, null, 4 ) );

        console.log( gameDir );
        console.log( `Game name: ${manifest.name}` );

        return true; 
    }

    private async hasPossibleVunerabilities( getZipStream: () => Readable, scriptFiles: string[] ) {
        for( const scriptFile of scriptFiles ) {
            if( scriptFile.indexOf( 'node_modules' ) !== -1 ) continue;
            console.log( `Scanning ${scriptFile}` );

            const script = await this.zipService.getZipEntryContent( getZipStream(), scriptFile );
            const requires = script.split( `require` ).slice( 1 ).filter( x => x );

            for( const require of requires ) {
                if( !require || !require['split'] ) continue;

                if( require?.split( '(' ).length > 1 ) {
                    if( require?.split(' (' )[1]?.split( ')' )[0].indexOf( '@cambox/common' ) === -1 && require?.split( '(' )[1]?.split( ')' )[0]?.indexOf( './' ) === -1 ) {
                        console.log( 'Scan failed (Bad requires)' );
                        return true;
                    }
                }
            }

            if( script.indexOf( 'process.' ) !== -1 ) {
                console.log( 'Scan failed (Process call)' );
                return true;
            }
        }

        console.log( 'Scan cleared' );
        return false;
    }
}
