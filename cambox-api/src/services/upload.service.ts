import { Injectable } from '@nestjs/common';
import { ZipService } from './zip.service';
import { Readable } from 'stream';
import * as path from 'path';
import * as fs from 'fs';
import { glob } from 'glob';
import { GameDetails } from '@cambox/common/types/models/GameDetails';

@Injectable()
export class UploadService {
    constructor(
        private zipService: ZipService
    ) {}

    async verifyGamePackage( packageName: string, getZipStream: () => Readable ): Promise<GameDetails> {
        const contents = ( await this.zipService.readZipFileContents( getZipStream() ) )
            .map( fname => fname.split( `${packageName}/` )[1] );

        //Validate the package by doing some quick checks
        //1. Make sure there is a manifest file
        //2. Make sure the manifest file can be read
        //3. Check and make sure there is an index
        //4. Scan each JS file for illegal `require` calls or `process` calls
        if( !contents.some( f => f.indexOf( 'manifest.json' ) !== -1 ) ) throw 'No manifest definition was found in the game package';
        if( !contents.some( f => f === 'icon.png' ) ) throw 'No icon.png file found';
        
        let manifest: GameDetails;
        try {
            manifest = JSON.parse( 
                await this.zipService.getZipEntryContent( 
                    getZipStream(), 
                    `${packageName}/manifest.json` 
                ) 
            );

            if( typeof( manifest.id ) === 'undefined' ) throw 'No ID found in manifest';
            if( typeof( manifest.name ) === 'undefined' ) throw 'No name found in manifest';
            if( typeof( manifest.description ) === 'undefined' ) throw 'No description in manifest';
        } catch( ex ) {
            throw 'Failed to parse manifest from game package';
        }

        if( !contents.some( f => f.indexOf( 'index.js' ) !== -1 ) ) throw 'No index file was found in the game package';
        
        try {
            await this.hasPossibleVunerabilities( getZipStream, contents.filter( x => path.extname( x ) === '.js' ).map( x => `${packageName}/${x}` ) );
        } catch( remedy ) {
            throw `Threat scan failed. ${remedy}`;
        }

        return manifest; 
    }

    async deployPackage( manifest: GameDetails, getZipStream: () => Readable ) {
        //Extract the package to the game directory
        const gameDir = path.join( __dirname, path.join( '../', 'games', manifest.id ) );

        await this.zipService.extractZip( 
            gameDir,
            getZipStream(),
            manifest.id
        );

        //Copy over the manifest
        fs.writeFileSync( path.join( gameDir, 'manifest.json' ), JSON.stringify( manifest, null, 4 ) );

        console.log( gameDir );
        console.log( `Game name: ${manifest.name}` );
    }

    private async hasPossibleVunerabilities( getZipStream: () => Readable, scriptFiles: string[] ) {
        for( const scriptFile of scriptFiles ) {
            if( scriptFile.indexOf( 'node_modules' ) !== -1 ) continue;
            console.log( `Scanning ${scriptFile}` );

            const script = await this.zipService.getZipEntryContent( getZipStream(), scriptFile );
            
            const requireCalls = script.split( 'require' );
            for( let i = 0; i < requireCalls.length; i++ ) {
                if( i === 0 ) continue;
                
                const required = requireCalls[i].split( '(' )[1].split( ')' )[0];

                if( required.indexOf( './' ) === -1 && required.indexOf( '@cambox/common' ) === -1 ) {
                    throw '3rd party modules are not allowed';
                }
            }

            if( script.indexOf( 'setTimeout' ) !== -1 ) throw  'Please use room.registerDelayedTask instead of setTimeout';
            if( script.indexOf( 'setInterval' ) !== -1 ) throw 'Please use room.registerRecurringTask instead of setInterval';
            if( script.indexOf( 'process.' ) !== -1 ) throw 'You may not use the process object';
        }

        console.log( 'Scan cleared' );
    }

    private async replaceCommonImports( gameDir: string ): Promise<void> {
        return new Promise(( resolve, reject ) => {
            glob( path.join( gameDir, '**/*.js' ), ( err, files ) => {
                for( const jsFile of files ) {
                    console.log( jsFile );
                    let content = fs.readFileSync( jsFile ).toString();
                    content = content.replace( /\@cambox\/common\/dist/g, '../../../../cambox-common' );
                    fs.writeFileSync( jsFile, content );
                }
                resolve();
            } );
        });
    }
}
