const fs = require("fs");
const path = require('node:path'); 
const pathToText = path.join(__dirname, '/text.txt');
let readableStream = fs.createReadStream(pathToText, "utf8");
readableStream.on("data", function(chunk){ 
    console.log(chunk);
});