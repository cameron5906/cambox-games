import { Injectable } from '@nestjs/common';
import * as unzip from 'unzipper';
import { Readable } from 'stream';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

@Injectable()
export class ZipService {
    async extractZip( extractionPath: string, zipStream: Readable, basePath: string, exclude: string[] = [] ): Promise<string> {
        return new Promise( ( resolve, reject ) => {
            const entries: unzip.Entry[] = [];

            //const extractionPath = path.join( os.tmpdir(), Date.now().toString() );
            try {
                fs.mkdirSync( extractionPath );
            } catch( ex ) {
                
            }

            zipStream
                .pipe( unzip.Parse() )
                .on( 'entry', ( entry: unzip.Entry ) => {
                    if( entry.type === 'File' && entry.path.indexOf( `${basePath}/` ) === 0 ) {
                        if( !exclude.some( e => entry.path.includes( e ) ) ) {
                            let entryPath = path.join( extractionPath, entry.path.substr( basePath.length + 1 ) );
                        
                            console.log( `Extracting ${entryPath}` );
                            
                            const relDir = path.join( entryPath, '../' );
                            
                            mkdirp( relDir ).then( () => {
                                entry.pipe( fs.createWriteStream( entryPath ) );
                            } );
                        }
                    } else {
                        entry.autodrain();
                    }
                } )
                .on( 'error', reject )
                .on( 'close', async() => {
                    resolve( extractionPath );
                } );
        } );
    }

    async readZipFileContents( zipStream: Readable ): Promise<string[]> {
        const files = [];

        return new Promise( ( resolve, reject ) => {
            zipStream
                .pipe( unzip.Parse() )
                .on( 'entry', ( entry: unzip.Entry ) => {
                    files.push( entry.path );
                    entry.autodrain();
                } )
                .on( 'close', () => {
                    resolve( files );
                } );
        } );
    }

    async getZipEntryContent( zipStream: Readable, entryPath: string ): Promise<string> {
        return new Promise( ( resolve, reject ) => {
            zipStream
                .pipe( unzip.Parse() )
                .on( 'entry', ( entry: unzip.Entry ) => {
                    if( entry.path === entryPath ) {
                        this.readZipFileEntry( entry ).then( ({ data }) => {
                            resolve( data );
                        });
                    } else {
                        entry.autodrain();
                    }
                } )
                .on( 'close', () => {
                    reject( 'Entry not found' );
                } );
        } );
    }

    async readZipFileEntry( entry: unzip.Entry ): Promise<{ name: string, path: string, data: string}> {
        return {
            name: path.basename( entry.path ),
            path: entry.path,
            data: await this.getStreamString( entry )
        }
    }

    private async getStreamString( stream: Readable ): Promise<string> {
        return new Promise( ( resolve, reject ) => {
            const chunks = [];
            stream.on( 'data', data => chunks.push( data ) );
            stream.on( 'error', reject );
            stream.on( 'end', () => { resolve( Buffer.concat( chunks ).toString( 'utf8' ) ) });
        } );
    }
}
