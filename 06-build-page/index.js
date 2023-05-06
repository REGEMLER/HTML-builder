const fs = require("fs");
const path = require('node:path'); 
const builderPath = path.join(__dirname, '/project-dist');
const stylesPath = path.join(__dirname, '/styles');
const assetsPath = path.join(__dirname, '/assets');
const compPath = path.join(__dirname, '/components');
const templateHTMLPath = path.join(__dirname, '/template.html');
const fsp = require('node:fs/promises');
const readdir = fsp.readdir;
const readdirCB = fs.readdir;
let componentsArr = []; 
let stylesArr = []; 

// replace template with components
async function replaceTemplate(){
    fs.readFile(builderPath + "/index.html", "utf8", (error, text) => {
        if(error) {
            console.error(error); 
        } else {
            let writeableStream = fs.createWriteStream(builderPath + "/index.html");
            componentsArr.forEach(file => {
                text = text.replace(`{{${file.name}}}`, file.data)
            })
            writeableStream.end(text);
        }
    })
}

// set data from components to array; 
async function readComponents(){
    try {
        const components = await readdir(compPath, {withFileTypes: true});
        components.forEach((file, index, arr) => {
            const pathToCurrentFile = path.join(compPath + `/${file.name}`);
            fs.readFile(pathToCurrentFile, "utf8", (error, data) => {
                if(error)  console.error(error);
                const beforeDot = file.name.indexOf(".");
                const name = file.name.slice(0, beforeDot);
                let obj = {
                    name,
                    data,
                    index
                }
                componentsArr.push(obj); 
                if(arr.length === componentsArr.length){
                    componentsArr.sort((a,b) => a.index - b.index); 
                    replaceTemplate()
                }
            })
        })
    }
    catch (error){
        console.error(error); 
    }
}

//copy styles 
async function copyStyles(){
    readdirCB(stylesPath, (error, data) => {
        if(error) {
            console.error(error);
        }  else {
            const styles = data.filter(file => path.extname(file) === ".css"); 
            styles.forEach( (file, index, arr) => {
                const pathToCurrentFile = path.join(stylesPath, `/${file}`);
                fs.readFile(pathToCurrentFile, "utf8", (error, data) => {
                    if(error) {
                        console.error(error);
                    } else {
                        stylesArr.push(data); 
                        if(stylesArr.length === arr.length){
                            let writeableStream = fs.createWriteStream(builderPath + '/style.css');
                            writeableStream.end(stylesArr.join(" ")); 
                        }
                    }
                })
            });
            readComponents(); 
        }
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
                let readableStream = fs.createReadStream(pathTocopeingFile);
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

//create index.html file, write data from template ti it and copy asses
async function createIndex (data){
    fs.writeFile(builderPath + '/index.html', data, (error) => {
        if(error) console.error(error); 
        else {
            fs.rm(builderPath + '/assets', {recursive: true, force: true}, () => {
                fs.mkdir(builderPath + '/assets', ()=>{
                    copyAssets(""); 
                    copyStyles();
                })
            })
        } 
    })
}

//Get data from template.html 
async function readTemplate (){
    fs.readFile(templateHTMLPath, "utf8", (error, data) => {
        if(error) console.error(error); 
        else {
            createIndex(data);
        }
    })
}

//Create builder folder
async function htmlBuilder(){ 
    await fsp.rm(builderPath, {recursive: true, force: true});
    await fsp.mkdir(builderPath, {recursive: true});
    readTemplate(); 
}

htmlBuilder(); 