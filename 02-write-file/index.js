const path = require('path');
const fs = require('fs');

fs.writeFile(
    path.join(__dirname, 'newText.txt'),
    '',
    (err) => {
        if (err) throw err;
    }
);

const { stdin, stdout } = process;

stdout.write('Введити данные:\n');

stdin.on('data', function(data) {
    if (data.toString().trim() == 'exit') {
        process.exit();
    } else {
        fs.appendFile(
            path.join(__dirname, 'newText.txt'),
            data,
            (err) => {
                if (err) throw err;
            }
        );
    }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Удачи в обучении!'));