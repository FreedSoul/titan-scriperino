const { table } = require('console');
const fs = require('fs') ;

const output = fs.readFileSync('matching-table.txt', 'utf8')
const xtedtable = output.trim('\r').split('\r\n').map(x => x.split(' -- '))
console.log(xtedtable)