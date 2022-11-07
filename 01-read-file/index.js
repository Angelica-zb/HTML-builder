const path = require('path');
const fs = require('fs');

const fileWay = path.join(__dirname, 'text.txt')

const str = fs.createReadStream(fileWay, 'utf-8');

let data = '';

str.on('data', chunk => data += chunk);
str.on('end', () => console.log(data));
str.on('error', error => console.log('Error', error.message));