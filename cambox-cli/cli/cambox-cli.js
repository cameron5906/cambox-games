#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../index"));
var operations = {
    help: '',
    create: 'Create a new game package',
    publish: 'Publish a game package to Cambox Games'
};
var cmdOptions = {};
if (process.argv.length < 2 || !Object.keys(operations).includes(process.argv[2])) {
    console.error("\nInvalid command. \n\nAvailable operations are:\ncambox create - Creates a new game package\ncambox publish - Publishes a game package to Cambox Games\n");
}
for (var i = 2; i < process.argv.length; i++) {
    var arg = process.argv[i];
    if (arg.indexOf('--') === 0) {
        var op = arg.split('--')[1];
        if (i < process.argv.length - 1) {
            var val = process.argv[i + 1];
            if (val.indexOf('--') === 0) {
            }
            else {
                cmdOptions[op] = val;
                i++;
            }
        }
        else {
        }
    }
}
index_1.default(process.argv[2], cmdOptions);
