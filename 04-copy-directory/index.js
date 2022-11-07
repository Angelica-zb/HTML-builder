const path = require('path');
const fs = require('fs');

let fileWay = path.join(__dirname, 'files');
let copyWay = path.join(__dirname, 'files-copy')
copy(fileWay, copyWay)

function copy(fileWay, copyWay) {
    fs.rm(copyWay, { recursive: true, force: true }, (err) => {
        fs.mkdir(copyWay, { recursive: true }, (err) => {
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
                        copy(fileWay2, copyWay2)
                    }
                })
            }
        })
    })
}