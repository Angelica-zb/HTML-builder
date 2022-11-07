const path = require('path');
const fs = require('fs');

const fileWay = path.join(__dirname, 'secret-folder')

fs.readdir(fileWay, { withFileTypes: true }, (err, files) => {
    if (err)
        console.log(err);
    else {
        files.forEach(file => {
            if (file.isFile()) {
                const fileW = path.join(fileWay, file.name)
                fs.stat(fileW, (error, stats) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`${path.parse(file.name).name} - ${path.extname(file.name).slice(1)} - ${stats.size/1000}kb`);
                        // console.log(1)
                    }
                })

            }

        })
    }
})