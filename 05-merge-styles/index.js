const path = require('path');
const fs = require('fs');

let fileWay = path.join(__dirname, 'styles');
let makeWay = path.join(__dirname, 'project-dist');
let styleWay = path.join(makeWay, 'bundle.css');


fs.writeFile(
    path.join(makeWay, 'bundle.css'),
    '',
    (err) => {
        if (err) throw err;
    }
);

fs.readdir(fileWay, { withFileTypes: true }, (err, files) => {
    if (err) { console.log(err); }
    files.forEach(file => {

        if (file.isFile() && path.extname(file.name).trim() == '.css') {
            fs.readFile(path.join(fileWay, file.name), 'utf-8', (err, content) => {
                if (err) {
                    throw err
                }
                fs.appendFile(styleWay, `${content} \n`, (err) => {
                    if (err) throw err;
                });
            })
        }
    })
})