let users;
            // Get user info Json file
const page_loaded = chrome.runtime.onMessage.addListener( async (message, sender, response) => {
    if(message.msg == 'page-loaded'){ 
        users = await getUsers()        
        sendmsg({user_data: users})        
    } else if(message.msg == 'load-users'){
        users = message.newUsers
    }
    changeNamesOpt();
    changeKeysOpt();
    chrome.runtime.onMessage.removeListener(page_loaded);
})

window.addEventListener('load', () => {
    sendmsg({extensionloaded: true});
})

const getUsers = () => {
    return new Promise( (resolve, reject) => {
        let request = new XMLHttpRequest()
        request.open('get', chrome.extension.getURL('/db.json'), true)

        request.responseType = 'json'
        request.setRequestHeader("Content-Type", "application/json")
        request.onload = () => {    
            if(request.status >= 400){
                reject(request.response)
            } else {
                resolve(request.response)
            }
        }
        request.send()
    })
}

const sendmsg = (msg) => {
    chrome.tabs.query({currentWindow:true, active:true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, msg);
    })
}
            // Work with the popup html
    //Scan inputs
document.getElementById("scan").addEventListener("click", () => {
    sendmsg({scan_inputs: true});
})
    //Save new json
document.getElementById("sJson").addEventListener("click", () => {

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users))
    let dbut = document.getElementById('dJson')
    dbut.setAttribute('href', dataStr)

    sendmsg({button: dbut, str: dataStr})
    dbut.click()
})
    //Change the Json names
document.getElementById('cJbut').addEventListener('click', () => {
    const key = document.getElementById('cJson').selectedOptions[0].innerText
    if(key.search(/^Select a/g) == -1){
        sendmsg({change: key});
    }
})
    //Fill the inputs
document.getElementById('fill').addEventListener('click', () => {
    const name = document.getElementById('fNames').selectedOptions[0].innerText
    if(name.search(/^Select a/g) == -1){
        sendmsg({fill: name})
    }
})

            // Make selection inputs
    //User's info to fill
const changeNamesOpt = () => {
    let elem = document.getElementById('fNames')
    for(const user in users){    
        var opt = document.createElement('option');
        opt.innerHTML = user
        elem.appendChild(opt)
    }
}
    //Object Key name to change
const changeKeysOpt = () => {
    let elem = document.getElementById('cJson')
    for(const user in users){
        for(let key in users[user]){
            var opt = document.createElement('option');
            opt.innerHTML = key
            elem.appendChild(opt)
        }
        break;
    }
}
