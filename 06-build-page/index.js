const path = require('path');
const fs = require('fs');
const fsPr = fs.promises;

let fileWay = path.join(__dirname, 'assets');
let proectWay = path.join(__dirname, 'project-dist');
let copyWay = path.join(proectWay, 'assets');

let filesStyleWay = path.join(__dirname, 'styles');
let styleWay = path.join(proectWay, 'style.css');

let componentsWay = path.join(__dirname, 'components');
let html = path.join(proectWay, 'index.html');
const template = path.join(__dirname, 'template.html');

fs.rm(proectWay, { recursive: true, force: true }, (err) => {
    if (err) {
        console.log(err);
    }

    fs.mkdir(proectWay, { recursive: true }, (err) => {
            if (err) {
                console.log(err);
            }
        })
        //style
    fs.writeFile(
        path.join(proectWay, 'style.css'),
        '',
        (err) => {
            if (err) throw err;
        }
    );

    fs.readdir(filesStyleWay, { withFileTypes: true }, (err, files) => {
            if (err) { console.log(err); }
            files.forEach(file => {

                if (file.isFile() && path.extname(file.name).trim() == '.css') {
                    fs.readFile(path.join(filesStyleWay, file.name), 'utf-8', (err, content) => {
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
        //assets
    makeAssets(fileWay, copyWay)

    function makeAssets(fileWay, copyWay) {
        fs.mkdir(path.join(proectWay, 'assets'), { recursive: true }, (err) => {
            if (err) {
                console.log(err);
            }
        })
        fs.readdir(fileWay, { withFileTypes: true }, (err, files) => {
            if (err) { console.log(err); } else {
                files.forEach(file => {
                    if (file.isFile()) {
                        fs.copyFile(path.join(fileWay, file.name), path.join(copyWay, file.name), (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        fs.mkdir(path.join(copyWay, file.name), { recursive: true }, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                        let fileWay2 = path.join(fileWay, file.name)
                        let copyWay2 = path.join(copyWay, file.name)
                        makeAssets(fileWay2, copyWay2)
                    }
                })
            }
        })
    }

    //html
    makeHTML()

    async function makeHTML() {
        await fsPr.writeFile(html, '');
        let content = await fsPr.readFile(template, 'utf-8');
        const templates = content.match(/{{[^{}]*}}/g) || [];
        for (let k = 0; k < templates.length; k++) {
            let nameComp = templates[k].replace('{{', '').replace('}}', '') + '.html';
            let replacementPath = path.join(componentsWay, nameComp);
            let replacement = await fsPr.readFile(replacementPath, 'utf-8');
            content = content.replace(templates[k], replacement);
        }
        await fsPr.appendFile(html, content, 'utf-8');
    }
})