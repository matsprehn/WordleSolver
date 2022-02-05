const readline  = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
    input: fs.createReadStream('./words.txt'),
    output: null,
    console: false
});

const input = []

readInterface.on('line', (line) => {
    if (line.length ===5)
    input.push(line);
});

readInterface.on('close', () => {
    console.log(input.length);
    fs.writeFileSync('./wordle.txt', input.join('\n'));
})