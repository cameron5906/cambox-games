#!/usr/bin/env node

import bootstrapper from '../index';

const operations = {
    help: '',
    create: 'Create a new game package',
    publish: 'Publish a game package to Cambox Games'
}

let cmdOptions: {[op: string]: string} = {};

if( process.argv.length < 2 || !Object.keys( operations ).includes( process.argv[2] ) ) {
    console.error(`
Invalid command. 

Available operations are:
cambox create - Creates a new game package
cambox publish - Publishes a game package to Cambox Games
`);
}

for( let i = 2; i < process.argv.length; i++ ) {
    const arg = process.argv[i];

    if( arg.indexOf( '--' ) === 0 ) {
        const op = arg.split( '--' )[1];

        if( i < process.argv.length - 1 ) {
            const val = process.argv[i + 1];
            if( val.indexOf( '--' ) === 0 ) {

            } else {
                cmdOptions[ op ] = val;
                i++;
            }
        } else {

        }
    }
}

bootstrapper( process.argv[2], cmdOptions );