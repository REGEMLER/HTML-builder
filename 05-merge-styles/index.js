const path = require('node:path'); 
const pathToFolderStyles = path.join(__dirname, '/styles');
const pathToBundle = path.join(__dirname, '/project-dist', `/bundle.css`);
const fs = require("fs");
const readdir = fs.readdir;
const arrOfData = [];


readdir(pathToFolderStyles, (error, data) => {
    if(error)  console.error(error);
    const stylesArr = data.filter(file => path.extname(file) === ".css"); 
    stylesArr.forEach( (file, index, arr) => {
        const pathToCurrentFile = path.join(__dirname, '/styles', `/${file}`);
        fs.readFile(pathToCurrentFile, "utf8", (error, data) => {
            if(error)  console.error(error);
            let obj = {
                index,
                data
            }
            arrOfData.push(obj); 
            arrOfData.sort((a,b) => a.index - b.index); 
            if(arrOfData.length === arr.length){
                let resultArr = arrOfData.map(obj => obj.data)
                let writeableStream = fs.createWriteStream(pathToBundle);
                writeableStream.end(resultArr.join("                          ")); 
            }
        })

    })
})
