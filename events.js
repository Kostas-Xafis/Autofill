            // Work with the popup html
window.addEventListener('load', () => {
    sendmsg({extensionloaded: true});
})
    //Scan inputs
document.getElementById("scan").addEventListener("click", () => {
    sendmsg({scan_inputs: true});
})
    //Save new json
document.getElementById("sJson").addEventListener("click", () => {
    createFile(JSON.stringify(users, null, 2));    
})
    //Change the Json names
document.getElementById('cJbut').addEventListener('click', () => {
    let inputDropdown = document.getElementById('cJson_ind')
    let selectedInput = inputDropdown.selectedOptions[0]
    let selectedKey   = document.getElementById('cJson').selectedOptions[0]
    
    const oldKey = selectedKey.value
    const newKey = selectedInput.id

    for(let user in users){
        users[user][newKey] = users[user][oldKey]
        delete users[user][oldKey]
    }
    selectedKey.value = newKey;
    selectedKey.innerText = newKey + ` ${inputDropdown.selectedIndex}`;
})
    //Fill the inputs
document.getElementById('fill').addEventListener('click', () => {
    const name = document.getElementById('fNames').selectedOptions[0].innerText
    if(name.search(/^Select a/g) == -1){
        sendmsg({fill: name})
    }
})
    //User gives a json file
document.getElementById('takeJson').addEventListener('click', async () => {
    await getJson()
    console.log("Data :", users)        
    createFile(JSON.stringify(users, null, 2))
    changeNamesDropdown()
    changeKeysDropdown()
});

document.getElementById('delJbut').addEventListener('click', () => {
    deleteJson()
})