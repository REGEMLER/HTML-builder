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
            const pathTocopeingFile = path.join(pathToFolder, `/${fileName}`);
            const pathTocopiedFile = path.join(pathToNewFolder, `/${fileName}`);
            let readableStream = fs.createReadStream(pathTocopeingFile, "utf8");
            let writeableStream = fs.createWriteStream(pathTocopiedFile);
            readableStream.pipe(writeableStream);
        } 
    }
    catch (error) {
        console.error(error);
    }
} 

async function copy(){ 
    await fsp.rm(pathToNewFolder, {recursive: true, force: true});
    await fsp.mkdir(pathToNewFolder, {recursive: true});
    copyFiles()
}

copy(); 