const fs = require("fs");
const path = require('node:path'); 
const readline = require('node:readline');
const pathToFile = path.join(__dirname, '/hello.txt');
const process = require('node:process');
const {
    stdin: input,
    stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });
let writeableStream = fs.createWriteStream(pathToFile);
console.log('What do you want?');
rl.on('line', (answer) => {
    const checkedAnswer = answer.toLowerCase(); 
    console.log('What do you want?')
    if(checkedAnswer === "exit") {
        console.log("Adios, amigo!");
        writeableStream.end();
        rl.close();
    }
    writeableStream.write(`${answer} `);
});

process.on("SIGINT", () =>{
    console.log("Namarie");
    process.exit(0);
})