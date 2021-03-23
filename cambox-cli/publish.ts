import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import got from 'got';
import FormData from 'form-data';
import { getDataPath, promptInput } from '.';

export async function publish( opts: {[key: string]: string} ) {
    if( !fs.existsSync( './manifest.json' ) ) return console.error( 'You must be in the same directory as the game package to use this command' );
    if( !fs.existsSync( './icon.png' ) ) return console.error( 'Game package must contain an icon.png file' );

    if( !fs.existsSync( getDataPath() ) || !fs.existsSync( path.join( getDataPath(), 'token' ) ) ) {
        const devKey = await promptInput( 'Enter your developer key' );
        
        try {
            const token = await generateDevelopmentToken( devKey );
            fs.mkdirSync( getDataPath() );
            fs.writeFileSync( path.join( getDataPath(), 'token' ), token );
        } catch( ex ) {
            return console.error( `Failed to retrieve development token: ${ex}` );
        }
    }
    
    let manifest: {[key: string]: string} = {};
    try {
        manifest = JSON.parse( fs.readFileSync( path.join( process.cwd(), 'manifest.json' ) ).toString() );
    } catch( ex ) {
        return console.error( 'Failed to read manifest.json file' );
    }

    console.log( `Compressing ${manifest.name}...` );
    const zip = new AdmZip();
    zip.addLocalFolder( process.cwd(), manifest.id, /^((?!node_modules|\.git|\.vscode|\.ts|tsconfig\.json|package\.json).)*$/ );
    const zipBuffer = zip.toBuffer();
    
    console.log( 'Uploading...' );

    const form = new FormData();
    form.append( 'file', zipBuffer, {
        filename: `${manifest.id}.zip`
    } );
    
    const response = await got.post( `http://localhost:3001/games/upload`, {
        throwHttpErrors: false,
        headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${readDevelopmentToken()}`
        },
        body: form.getBuffer(),
    } );
    const body = JSON.parse( response.body );

    if( response.statusCode === 201 && !body.error ) {
        return console.log( `${manifest.name} is now live!` );
    } else {
        const message = (body as any).error || 'Server error'; 
        return console.error( `Upload failed: ${message}` );
    }
}

function readDevelopmentToken() {
    return fs.readFileSync( path.join( getDataPath(), 'token') ).toString();
}

async function generateDevelopmentToken( key: string ) {
    const response = await got.get( `http://localhost:3001/developer/token?key=${key}`, { responseType: 'json' } );
    if( response.statusCode !== 200 ) throw 'Failed to retrieve developer token';

    return (response.body as any).data.token; 
}