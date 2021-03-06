const internalError = "There was an internal error, please reopen the extension"

const errorhandler = (err) => {    
    console.error(err);
}
const catchHandler = (error) => {
    let {errorType = "log", errorMsg = internalError} = error
    console[errorType](errorMsg)
}
const rejectHandler = (rej, errType, errMsg) => {
    return rej({errorType:errType, errorMsg: errMsg})
}

const callFS = (handler) => window.webkitRequestFileSystem(PERSISTENT, 1024*1024*128, handler, errorhandler);        
    //Check if a json file exists for this website
const checkFileExist = (operation) => {
    return new Promise((resolve, reject) => callFS((fs) => {
        fs.root.createReader().readEntries((entries) => {
            let exists = false;
            let fName = file_loc.replace("/", "")
            for(let entry of entries){
                if(entry.name === fName){
                    exists = true;
                    break;
                }
            }
            if(operation === "delete"){
                exists ? resolve() : reject();
            }else if(operation === "check"){
                exists ? resolve() :
                         rejectHandler(reject, "warn",
                             "There is no registered json file for this website")
            } else if(operation === "create") {
                resolve(exists);
            }
        }, errorhandler)
    }))
}
    //This function works like w+ (rewrites or creates)
const createFile = async (data) => {
    /*  Deleting the file first and then recreating it because
        the createWriter just changes the bytes of the file 
        and doesn't rewrite it.😢 
    */
    const createFileProm = () => {
        return new Promise((resolve, reject) => callFS((fs) => {
            fs.root.getFile(file_loc, {create: true}, (fileEntry) => {
                fileEntry.createWriter( (fileWriter) => {
                    let fileData = new Blob([data], {type: "application/json"})
                    fileWriter.onwriteend = () => {
                        resolve("Saved");
                    }
                    fileWriter.onerror = (e) => {
                        rejectHandler(reject, "error", e.target.error);
                    }
                    fileWriter.write(fileData)
                }, (err) => rejectHandler(reject, "error", err))
            }, (err) => rejectHandler(reject, "error", err))
        }))
    };

    await checkFileExist("create").then((exists) => {
            // if the file exists delete it and then create it again
        return exists ? deleteJson() : createFileProm();
    }).then((res) => {
            //Undefined means that the resolve came from deleteJson 
            // else it's a string from the createFileProm promise
        if(res == undefined){
            return createFileProm();            
        } else if(res === "Saved"){
            return ;  
        }
    }).then(() => {
        console.log("Saved file succesfully")
        return true;
    }).catch(catchHandler)
}
    //Receive the JSON data from the file, if it exists
const getFileJson = (filename) => {
    return new Promise(resolve => callFS((fs) => {
        fs.root.getFile(filename, {create:false}, (fileEntry) => {
            fileEntry.file(async (file) => {
                jsonData = JSON.parse(await file.text());
                resolve();
            }, errorhandler)
        }, errorhandler)
    }))
}
    //Get json data from a file picker
const getJson = async() => {
    try {
        [...fileHandles] = await window.showOpenFilePicker({
            types: [{accept:{"application/json":[".json"], "text/plain":[".txt"],
                    "application/vnd.ms-excel":[".xls"], 
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":[".xlsx"],
                    "application/xml":[".xml"], "text/xml":[".xml"]}}],
            multiple: true
        })
        let i = 1;
        for(const fileHandle of fileHandles){
            const file_blob = await fileHandle.getFile()
            const file_extension = file_blob.name.match(/\.[^.]+$/)[0]
            let file_reader;
            if(file_extension === ".json" || file_extension === ".txt")
                file_reader = async () => JSON.parse(await file_blob.text())
            else if(file_extension === ".xlsx" || file_extension === ".xml" 
                    || file_extension === ".xls"){
                file_reader = async () => await readXLSXdata(file_blob) 
            }
            console.log(i == fileHandles.length)
            await appendJson(await file_reader(), i == fileHandles.length)
            i++
        }
    } catch(err) {
       throw new Error(err)
    }
}

const deleteJson = () => {
    return new Promise( (resolve, reject) => callFS( (fs) => {
        fs.root.getFile(file_loc, {}, (fileEntry) => {
            const filename = fileEntry.name
            fileEntry.remove(() => {
                console.log(`Removed ${filename} succesfully`)
                resolve()
            }, (err) => rejectHandler(reject, "error", err))
        }, (err) => rejectHandler(reject, "error", err))
    }))
}
    //* Importing xlsx reader from cdn
function getXLSXreader(){
    return new Promise(res => {
        let xlsx_script = document.createElement("script")
        xlsx_script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"
        xlsx_script.integrity = "sha512-wBcFatf7yQavHQWtf4ZEjvtVz4XkYISO96hzvejfh18tn3OrJ3sPBppH0B6q/1SHB4OKHaNNUKqOmsiTGlOM/g=="
        xlsx_script.crossOrigin = "anonymous"
        xlsx_script.id = "xlsx"
        xlsx_script.onload = res
        document.head.appendChild(xlsx_script)
    })
}
    //* Return a structured json from excel data
async function readXLSXdata(file_blob){    
    try{
            //* Making a request if the script doesn't exist, which by default it doesn't, 
            //* Consider caching it
        if(document.getElementById("xlsx") == null)
            await getXLSXreader();

            //* Reading the raw data from file
        let xlsx_data = XLSX.read(
                new Uint8Array(await file_blob.arrayBuffer()),
                {type: "array"})

        //* Structuring the data to the desired form
        const structured_json = {}
        for(const SheetName of xlsx_data.SheetNames){
            let data_array = XLSX.utils.sheet_to_json(xlsx_data.Sheets[SheetName], {header:1})
            const [keys_row, ...values_rows] = data_array.slice()
            for(const [id, ...value_row] of values_rows){
                let i = 1;
                structured_json[id] = {}
                for(const value of value_row){
                    structured_json[id][keys_row[i]] = value;
                    i++;
                } 
            }
        }
        xlsx_data = {}
        return structured_json
    }catch (err) {
        throw new Error(err)
    }
}

    //*Drag & Drop files
$(document).on("dragover", (e) => e.preventDefault())
[0].addEventListener("drop", async (e) => {
    try{
        e.preventDefault()
        if(e.dataTransfer?.items?.length){
            let drops = e.dataTransfer.files;
            for(const i in drops){
                if(typeof drops[i] != "object") continue

                const file_blob = drops[i];
                const extension = file_blob.name.match(/\.[^.]+$/)[0]

                if(extension === ".json" || extension === ".txt"){
                    await appendJson(JSON.parse(await file_blob.text()))
                } else if(extension === ".xlsx" || extension === ".xls" || extension === ".xml"){
                    await appendJson(await readXLSXdata(file_blob))
                } else {
                    const file_extension = await file_blob.name.match(/\.[^.]+$/)[0]
                    console.log(`We do not currently support files with ${file_extension} extension`)
                }
            }
        }
    }catch (err){
        //* Notify the user if an error occurs
        throw new Error(err)
    }
})