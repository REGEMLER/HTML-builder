const fs = require('node:fs/promises');
const path = require('node:path'); 
const pathToFolder = path.join(__dirname, '/secret-folder');
const readdir = fs.readdir;


async function read(){
    try {
        const files = await readdir(pathToFolder,{withFileTypes: true});
        for (const file of files) {
            const fileName = file.name;
            const extenction = path.extname(fileName);
            if(file.isFile()){
                const pathToFile = path.join(__dirname, '/secret-folder', `/${file.name}`);
                fs.open(pathToFile, 'r').then((result) => {
                    return result.stat();
                }).then((result => {
                    const imdex = fileName.indexOf(".");
                    const name = fileName.slice(0,imdex);
                    console.log(`File ${name} - ${extenction.slice(1)} - ${result.size}bytes`);
                }))
            }
        } 
    } catch (error) {
        console.error(error);
    }
}
read(); 