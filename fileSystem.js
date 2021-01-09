const errorhandler = (err) => {    
    console.error(err);
}
const callFS = (handler) => window.webkitRequestFileSystem(PERSISTENT, 1024*1024*16, handler, errorhandler);    
    //This function works like w+ (rewrites or creates)
const createFile = (data) => {
    return callFS((fs) => {
        fs.root.getFile(`db_${hostname}.json`, {create: true}, (fileEntry) => {
            fileEntry.createWriter( (fileWriter) => {
                let fileData = new Blob([data], {type: "application/json"})
                fileWriter.write(fileData)
            }, errorhandler)
        }, errorhandler)
    })
}
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
            exists ? resolve("Found Json file") : reject("No registered Json file for this website")
        }, errorhandler)
    }))
}
    //Receive the JSON data from the file, if it exists
const getFileJson = () => {
    return new Promise( (resolve, reject) => callFS((fs) => {
        fs.root.getFile(`/db_${hostname}.json`, {create:false}, (fileEntry) => {
            fileEntry.file( (file) => {
                let fileReader = new FileReader();
                fileReader.onerror = (e) => {
                    reject("There was an internal error, try to re-open the extension")
                }
                fileReader.onloadend = (e) => {
                    users = JSON.parse(e.target.result);
                    resolve();
                }
                fileReader.readAsText(file)
            }, errorhandler)
        }, errorhandler)
    }))
}
    //Overly complicated way to get json data from a file picker...
const getJson = async() => {
    [fileHandle] = await window.showOpenFilePicker()
    const fileData = await fileHandle.getFile()
    await new Promise( (resolve, reject) => {
        let dataReader = new FileReader()
        dataReader.onerror = (e) => {
            console.errot(e.target.result)
            reject()
        }
        dataReader.onloadend = (e) => {
            users = JSON.parse(e.target.result)
            resolve()
        } 
        dataReader.readAsText(fileData);
    })
}

const deleteJson = () => {
    return callFS( (fs) => {
        fs.root.getFile(`db_${hostname}.json`, {}, (fileEntry) => {
            let filename = fileEntry.name
            fileEntry.remove(() => console.log(`Removed ${filename} succesfully`));
        })
    })
}