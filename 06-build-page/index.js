const fs = require("fs");
const path = require('node:path'); 
const builderPath = path.join(__dirname, '/project-dist');
const stylesPath = path.join(__dirname, '/styles');
const assetsPath = path.join(__dirname, '/assets');
const compPath = path.join(__dirname, '/components');
const templateHTMLPath = path.join(__dirname, '/template.html');
const fsp = require('node:fs/promises');
const readdir = fsp.readdir;
const readdir1 = fs.readdir;
let componentsArr = []; 
let stylesArr = []; 

//copy styles 
async function copyStyles(){
    readdir1(stylesPath, (error, data) => {
        if(error)  console.error(error);
        data.forEach( (file, index, arr) => {
            const pathToCurrentFile = path.join(stylesPath, `/${file}`);
            fs.readFile(pathToCurrentFile, "utf8", (error, data) => {
                if(error)  console.error(error);
                stylesArr.push(data); 
                if(stylesArr.length === arr.length){
                    let writeableStream = fs.createWriteStream(builderPath + '/style.css');
                    writeableStream.end(stylesArr.join("                          ")); 
                }
            })
    
        })
    })
}


//copy assets 
async function copyAssets(folder) {
    try{
        const files = await readdir(assetsPath + folder,{withFileTypes: true});
        for (const file of files) {
            const fileName = file.name;
            if(file.isFile()){
                const pathTocopeingFile = path.join(assetsPath + folder + `/${fileName}`);
                const pathTocopiedFile = path.join(builderPath + '/assets' + folder + `/${fileName}`);
                let readableStream = fs.createReadStream(pathTocopeingFile, "utf8");
                let writeableStream = fs.createWriteStream(pathTocopiedFile);
                readableStream.pipe(writeableStream);
            } else {
                fs.mkdir(builderPath + '/assets' + '/' + fileName, ()=>{
                    copyAssets('/' + fileName);  
                })
            }
        } 
    }
    catch (error) {
        console.error(error);
    }
} 


// set data from components to array; 
async function readComponents(){
    readdir(compPath, (error, files) => {
        if(error)  console.error(error);
        files.forEach(file => {
            const pathToCurrentFile = path.join(compPath + `/${file}`);
            fs.readFile(pathToCurrentFile, "utf8", (error, data) => {
                if(error)  console.error(error);
                let obj = {
                    name: file.name,
                    data
                }
                componentsArr.push(obj); 
                console.log(componentsArr[0].name)
            })
        })
    })
}



//create index.html file, write data from template ti it and copy asses
async function createIndex (data){
    fs.writeFile(builderPath + '/index.html', data, () => {
        copyStyles(); 
        // readComponents(); 
        // fs.mkdir(builderPath + '/assets', ()=>{
        //     copyAssets(""); 
        // })
    })
}

//Get data from template.html 
async function readTemplate (){
    fs.readFile(templateHTMLPath, "utf8", (error, data) => {
        if(error) console.error(error); 
        createIndex(data);
    })
}


//Create builder folder
fs.mkdir(builderPath, ()=>{
    readTemplate(); 
})