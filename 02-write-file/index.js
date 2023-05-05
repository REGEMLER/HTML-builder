const fs = require("fs");
const path = require('node:path'); 
const readline = require('node:readline');
const pathToFile = path.join(__dirname, '/hello.txt');
const {
    stdin: input,
    stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });
let writeableStream = fs.createWriteStream(pathToFile);
console.log('What do you want?');
rl.on('line', (answer) => {
    const checkedAnswer = answer.toLowerCase(); 
    if(checkedAnswer === "exit") {
        console.log("Adios, amigo!");
        writeableStream.end("Adios, amigo!");
        rl.close();
    } else {
        console.log('What do you want?')
        writeableStream.write(`${answer} \n`);
    }

});

rl.on("SIGINT", () =>{
    console.log("Namarie");
    rl.close();
})