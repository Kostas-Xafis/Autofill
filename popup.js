let users
let hostname = ""
            // Get user info Json file
const pageLoaded = chrome.runtime.onMessage.addListener((message, sender, response) => {         
    if(message.msg === "Ready"){
        // Later you will need to keep the host name for redirects from the website
        hostname = (message.host).replaceAll(".", "")
        // Getting the registered data (if they exist)
        checkFileExist().then( res =>{ 
            console.log(res);           
            getFileJson().then(() => {
                changeNamesDropdown()
                changeKeysDropdown()
            }).catch(err => console.error(err)) 
        }).catch(err => console.error(err));

        createIndexDropdown(message.inputs)
    }
    chrome.runtime.onMessage.removeListener(pageLoaded)
})

const sendmsg = (msg) => {
    chrome.tabs.query({currentWindow:true, active:true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, msg);
    })
}
            // Make selection inputs 
    //User's info to fill
const changeNamesDropdown = () => {
    let elem = document.getElementById('fNames')
    for(const user in users){
        var opt = document.createElement('option');
        opt.innerHTML = user
        elem.appendChild(opt)
    }
}
    //Object Key name to change
const changeKeysDropdown = () => {
    let dropdown = document.getElementById('cJson')
    for(const user in users){
        for(let key in users[user]){
            var opt = document.createElement('option');
            opt.innerHTML = key
            opt.value = key
            dropdown.appendChild(opt)
        }
        break;
    }
}

const createIndexDropdown = (inputs) =>{
    let dropdown = document.getElementById("cJson_ind")
    for(let input of inputs){
        let opt = document.createElement("option")
        opt.id = input.id
        opt.innerHTML = `(${input.ind})` + (input.id.length < 20 ? ` ${input.id}` : "")
        dropdown.appendChild(opt);
    }
}