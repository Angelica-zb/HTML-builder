const path = require('path');
const fs = require('fs');

let fileWay = path.join(__dirname, 'assets');
let proectWay = path.join(__dirname, 'project-dist');
let copyWay = path.join(proectWay, 'assets');

let filesStyleWay = path.join(__dirname, 'styles');
let styleWay = path.join(proectWay, 'style.css');

let componentsWay = path.join(__dirname, 'components');
let html = path.join(proectWay, 'index.html');

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
    fs.writeFile(
        path.join(proectWay, 'index.html'),
        '',
        (err) => {
            if (err) throw err;
        }
    );

    let htmlTemplate = '';
    const template = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf8');
    template.on('data', content => htmlTemplate += content)

    template.on('end', () => {
        fs.readdir(componentsWay, { withFileTypes: true }, (err, files) => {
            if (err) { console.log(err); } else {
                files.forEach(file => {
                    if (file.isFile() && path.extname(file.name).trim() == '.html') {

                        let tag = path.parse(file.name).name
                        let component = '';

                        const components = fs.createReadStream(path.join(componentsWay, file.name), 'utf8');

                        components.on('data', content => component += content)
                        components.on('end', () => {
                            htmlTemplate = htmlTemplate.replaceAll(`{{${tag}}}`, component)
                            fs.writeFile(html, htmlTemplate, err => {
                                if (err) throw err;
                            });
                        })
                    }
                })
            }
        });

    })
})