const path = require('node:path'); 
const pathToFolder = path.join(__dirname, '/files');
const pathToNewFolder = path.join(__dirname, '/files-copy');
const fs = require("fs");
const fsp = require('node:fs/promises');
const readdir = fsp.readdir

async function copyFiles(){
    try{
        const files = await readdir(pathToFolder,{withFileTypes: true});
        for (const file of files) {
            const fileName = file.name;
            const pathTocopeingFile = path.join(__dirname, '/files', `/${fileName}`);
            const pathTocopiedFile = path.join(__dirname, '/files-copy', `/${fileName}`);
            let readableStream = fs.createReadStream(pathTocopeingFile, "utf8");
            let writeableStream = fs.createWriteStream(pathTocopiedFile);
            readableStream.pipe(writeableStream);
        } 
    }
    catch (error) {
        console.error(error);
    }
} 

fs.mkdir(pathToNewFolder, ()=>{
    copyFiles(); 
})
