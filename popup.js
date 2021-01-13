let jsonData
let keys
let hostname = ""
            // Get user info Json file
const pageLoaded = chrome.runtime.onMessage.addListener(message => {         
    if(message.msg === "Ready"){        
        hostname = (message.host).replaceAll(".", "")
        //  Getting the registered data (if they exist)
        checkFileExist().then( res =>{ 
            if(res){
                console.log("Found json file")
                getFileJson().then(() => {
                    storeKeys();
                    changeNamesDropdown()
                    changeKeysDropdown()
                }).catch(err => console.error(err)) 
            }else{
                console.warn("There is no registered json file for this website")
            }            
        })
        if(message.inputs){
            createIndexDropdown(message.inputs)
            // inputs for the all_data object
            sel_index = message.inputs
        }
    } else if(message.msg === "Input_ind"){
        createIndexDropdown(message.inputs)
        sel_index = message.inputs
    }        
    chrome.runtime.onMessage.removeListener(pageLoaded)
})

const sendmsg = (msg) => {
    chrome.tabs.query({currentWindow:true, active:true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, msg);
    })
}
            // Make selection options 
    //User's info to fill
const changeNamesDropdown = () => {
    let $dp = jQuery($("#fNames")[0].shadowRoot.querySelector("#optBody"))
    for(const user in jsonData){
        $('<div>').addClass("optT").text(user).appendTo($("<div>").addClass("opt").val(user).appendTo($dp))
    }
    fillEvent($dp)
}
    //Json Key name to change
const changeKeysDropdown = () => {
    let $dp = jQuery($("#cJson")[0].shadowRoot.querySelector("#optBody"))
    for(const user in jsonData){
        for(const key in jsonData[user]){
            // .opt, text-value=key            
            $('<div>').addClass("optT").text(key).appendTo($('<div>').addClass("opt").attr("keyName", key).appendTo($dp))
        }
        break
    }
    fillEvent($dp)
}
    //Index of inputs dropdown
const createIndexDropdown = (inputs) =>{
    let $dp = jQuery($("#cJson_ind")[0].shadowRoot.querySelector("#optBody"))
    for(const input of inputs){
        $("<div>").addClass("optT").text(`(${input.ind}) ${input.id}`)
                  .appendTo($("<div>").addClass("opt").attr("id", input.id).appendTo($dp));
    }
    fillEvent($dp)
}

const removeDropdown = (id) => {
    let $dp = $(id)
    emptyEvent($dp)
}

const storeKeys = () => {
    keys = [];
    let arrData = Object.entries(jsonData);    
    for(const data of arrData){
        for(const datakey in data[1]){
            keys.findIndex(key => key === datakey) == -1 ? keys.push(datakey) : false;
        }
    }
}