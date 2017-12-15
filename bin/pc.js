#!/usr/bin/env node

const program = require('commander');
const { tieba } = require('../src/tieba');
const { firstPage } = require('../src/firstPage');
const { fetchPage } = require('../src/tool');

/**
 * Usage.
 */

program
.command('simple')
.description('crawler files from tieba')
.alias('s')
.action(function(type, name){
    process.stdout.write('输入网址：');
	process.stdin.on('data', function (chunk) {
        let url = String(chunk);
        process.stdout.write(url);
        process.stdin.end();
        fetchPage(url, tieba, '', 1)
    });
});

program
.command('first')
.description('crawler files from tieba')
.alias('f')
.action(function(type, name){
    process.stdout.write('输入贴吧首页：');
	process.stdin.on('data', function (chunk) {
        let url = String(chunk);
        process.stdout.write(url);
        process.stdin.end();
        fetchPage(url, firstPage, '', 1)
    });
});

program.parse(process.argv);