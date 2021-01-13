const errorhandler = (err) => {    
    console.error(err);
}
const callFS = (handler) => window.webkitRequestFileSystem(PERSISTENT, 1024*1024*128, handler, errorhandler);        
    //Check if a json file exists for this website
const checkFileExist = () => {
    return new Promise((resolve, reject) => callFS((fs) => {
        fs.root.createReader().readEntries((entries) => {
            let exists = false;
            for(let entry of entries){
                if(entry.name == `db_${hostname}.json`){                    
                    exists = true;
                    break;
                }
            }
            exists ? resolve(true) : resolve(false)
        }, errorhandler)
    }))
}
    //This function works like w+ (rewrites or creates)
const createFile = async (data) => {
    /*  Deleting the file first and recreating it later 
        because the createWriter just changes the bytes of the file and doesn't 
        rewrite it.😢 
    */
    //Checking if the file exists in the first place
    await checkFileExist().then(async (res) => {
        res ? await deleteJson() : null;
    })
    await new Promise((resolve, reject) => callFS((fs) => {
        fs.root.getFile(`db_${hostname}.json`, {create: true}, (fileEntry) => {
            fileEntry.createWriter( (fileWriter) => {
                let fileData = new Blob([data], {type: "application/json"})
                fileWriter.onwriteend = () => {
                    console.log("Saved file succesfully")
                    resolve();
                }
                fileWriter.onerror = (e) => {
                    console.error("An error occured:" + e.target.error)
                    reject();
                }
                fileWriter.write(fileData)                         
            }, errorhandler)
        }, errorhandler)
    }));
}
    //Receive the JSON data from the file, if it exists
const getFileJson = () => {
    return new Promise( (resolve, reject) => callFS((fs) => {
        fs.root.getFile(`/db_${hostname}.json`, {create:false}, (fileEntry) => {
            fileEntry.file( (file) => {
                let fileReader = new FileReader();
                fileReader.onerror = (e) => {
                    reject(`There was an internal error: ${e.target.error}, try to re-open the extension`)
                }
                fileReader.onloadend = (e) => {
                    jsonData = JSON.parse(e.target.result);
                    resolve();
                }
                fileReader.readAsText(file)
            }, errorhandler)
        }, errorhandler)
    }))
}
    //Overly complicated way to get json data from a file picker...
const getJson = async() => {
    [fileHandle] = await window.showOpenFilePicker({types:[{accept:{"application/json":[".json"]}}]})
    const fileData = await fileHandle.getFile()
    await new Promise( (resolve, reject) => {
        let dataReader = new FileReader()
        dataReader.onerror = (e) => {
            console.warn(e.target.result)
            reject()
        }
        dataReader.onabort = (e) => {
            console.warn(e.target.result)
            reject()
        }
        dataReader.onloadend = (e) => {
            jsonData = JSON.parse(e.target.result)
            resolve()
        } 
        dataReader.readAsText(fileData);
    })
}

const deleteJson = () => {
    return new Promise( (resolve, reject) => callFS( (fs) => {
        fs.root.getFile(`db_${hostname}.json`, {}, (fileEntry) => {
            let filename = fileEntry.name
            fileEntry.remove(() => console.log(`Removed ${filename} succesfully`));
            resolve(true);
        }, (err) => {
            console.log(err)
            resolve(false)
        })
    }))
}
console.log("everything loaded")