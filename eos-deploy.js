#!/usr/bin/env node

const Eos = require('eosjs');
const fs = require('fs');
const argparse = require("argparse");

let parser = new argparse.ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'EOS contract deploying tool'
});

parser.addArgument(['--url'], {
    defaultValue: 'http://127.0.0.1:8888', description: 'url to EOS node'
});
parser.addArgument(['--abi'], {
    required: true, description: 'path to abi file'
});
parser.addArgument(['--wast'], {
    required: true, description: 'path to wast file'
});
parser.addArgument(['--key'], {
    required: true, description: 'private key'
});
parser.addArgument(['--name'], {
    description: 'name of contract account name'
});
let args = parser.parseArgs();

if (!args.name)
    args.name = args.abi.split('/').slice(-1).pop().split('.')[0];



let eos = Eos.Localnet({
    keyProvider: args.key,
    httpEndpoint: args.url,
    binaryen: require('binaryen')
});

wast = fs.readFileSync(args.wast);
abi = fs.readFileSync(args.abi);


console.log('Deploying contract ' + args.name + '...');

eos.setcode(args.name, 0, 0, wast);
eos.setabi(args.name, JSON.parse(abi));

let error = false;
process.on('uncaughtException', (err) => {
});


process.on('unhandledRejection', (err) => {
    console.error('Fail :(');
    console.error(JSON.parse(err).message);
    error = true;
});

process.on('exit', () => {
    if (!error)
        console.log('Success :)');
});