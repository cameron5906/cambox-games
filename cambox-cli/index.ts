import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { create } from './create';
import { publish } from './publish';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function bootstrap( operation: string, opts: {[op: string]: string} ) {
    switch( operation ) {
        case 'publish':
            await publish( opts );
            break;
        case 'create':
            await create( opts );
            break;
        case 'logout':
            fs.unlinkSync( path.join( getDataPath(), 'token' ) );
            console.log('Logged out successfully');
            break;
    }
    process.exit( 0 );
}

export async function promptInput( prompt: string ): Promise<string> {
    return new Promise( ( resolve, reject ) => {
        rl.question( `${prompt}: `, resolve );
    } );
}

export function getDataPath() {
    const dataFolder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
    return path.join( dataFolder, 'cambox' );
}

export default bootstrap;