import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promptInput } from '.';

export async function create( opts: {[key: string]: string} ) {
    const requiredVariables: {[key: string]: string} = {
        name: 'Game name',
        description: 'Description',
        'minPlayers': 'Minimum players',
        'maxPlayers': 'Max players'
    }

    let manifest: {[key: string]: string} = {};

    for( const key of Object.keys( requiredVariables ) ) {
        manifest[ key ] = opts[ key ] || await promptInput( requiredVariables[ key ] );
    }

    manifest.id = toPascalName( manifest.name );

    let dirPath = path.join( opts['path'] || process.cwd(), manifest.id );

    writeManifest( dirPath, manifest );

    console.log( 'Manifest created' );
    console.log( 'Running npm install @cambox/common' );
    
    await run( dirPath, `npm i -g typescript` );
    await run( dirPath, 'npm init -y' );
    await npmInstall( dirPath, '@cambox/common', false );
    await npmInstall( dirPath, 'typescript', true );
    
    console.log( 'Initializing Typescript' );
    await run( dirPath, `tsc --init` );

    console.log( 'Generating files' );
    fs.writeFileSync( path.join( dirPath, 'index.ts' ), getIndexFile( manifest.id ) );
    fs.writeFileSync( path.join( dirPath, 'commands.ts' ), '' );
    fs.writeFileSync( path.join( dirPath, 'host-ui.ts' ), '' );
    fs.writeFileSync( path.join( dirPath, 'player-ui.ts' ), '' );
    fs.writeFileSync( path.join( dirPath, 'logic.ts' ), '' );
    fs.writeFileSync( path.join( dirPath, 'state.ts' ), '' );

    await run( dirPath, 'tsc' );

    console.log( `New game package created at ${dirPath}` );
}

async function npmInstall( dirPath: string, name: string, isDev: boolean ) {
    console.log( `Running npm i --save${isDev ? '-dev' : ''} ${name}` );
    await run( dirPath, `npm i --save${isDev ? '-dev': ''} ${name}` );
}

function writeManifest( dirPath: string, manifest: {[key: string]: string} ) {
    try {
        fs.mkdirSync( dirPath );
    } catch( ex ) {
        console.error( 'Error bootstrapping: failed to create game directory' );
        process.exit( 1 );
    }

    fs.writeFileSync( path.join( dirPath, 'manifest.json' ), JSON.stringify( manifest, null, 4) );
}

function getIndexFile( name: string ) {
    let indexScaffold = fs.readFileSync( path.join( __dirname, 'scaffold', 'index.ts') ).toString();
    indexScaffold = indexScaffold.replace( /TemplateGame/g, `${name}Game` );
    return indexScaffold;
}

function toPascalName( name: string ) {
    return name
        .split(' ')
        .map( x => 
            `${x.substr( 0, 1 ).toUpperCase()}${x.substr( 1 ).toLowerCase()}` 
        )
        .join( '' );
}

async function run( dirPath: string, cmd: string ): Promise<void> {
    return new Promise(( resolve, reject ) => {
        exec( cmd, { cwd: dirPath }, () => {
            resolve();
        } );
    } );
}