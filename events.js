            // Work with the popup html
window.addEventListener('load', async () => {
    sendmsg({extensionloaded: true});
})
    //Scan inputs
$('#scan').on("click", () => {
    sendmsg({scan_inputs: true});
})
    //Save new json
$('#sJson').on("click", async() => {
    await createFile(JSON.stringify(jsonData, null, 2))
})
    //Change the Json names
let undoStack = [];    
$('#cJbut').on('click', () => {
        // The dropdown selection element
    const inputDropdown = $('#cJson_ind')[0]
    const keysDropdown  = $('#cJson')[0]
        // The selected option
    let selectedInput = inputDropdown.selectedOptions[0]
    let selectedKey   = keysDropdown.selectedOptions[0]
        // The keys to be changed
    const oldKey = selectedKey.value
    const newKey = selectedInput.id

    for(let data in jsonData){
        jsonData[data][newKey] = jsonData[data][oldKey]
        delete jsonData[data][oldKey]
    }
    let prevKeyText = selectedKey.innerText
    let keyIndex = keysDropdown.selectedIndex;
    selectedKey.value = newKey;
        //Changing inner text for ui
    selectedKey.innerText =`(${inputDropdown.selectedIndex}) ${keys[keyIndex - 1]}`;    

        //Saving changes in a stack for undo function
    undoStack[undoStack.length-1] = {"keys":[oldKey, newKey], "oldText":prevKeyText, "keyIndex": keyIndex} 
})

$('#undo').on('click', () => {
    let {keys, oldText, keyIndex} = undoStack[undoStack.length-1];

    const oldKey = keys[0]
    const newKey = keys[1]
        // Changing the Json data
    for(let data in jsonData){
        jsonData[data][oldKey] = jsonData[data][newKey]
        delete jsonData[data][newKey]
    }
        // Changing the ui data
    let UndoSelDataKey = $("#cJson")[0].item(keyIndex)
    UndoSelDataKey.innerText = oldText
    UndoSelDataKey.value = oldKey;
        // Removing the undo from the stack
    undoStack.pop();
});
    //Fill the inputs
$('#fill').on('click', () => {
    const dataKey = $('#fNames')[0].shadowRoot.querySelector("#pick div").innerText;
    if(dataKey.search(/^Select/g) == -1){
        sendmsg({fill: jsonData[dataKey]})
    }
})
    //User gives a json file
$('#takeJson').on('click', async () => {
    await getJson()
    console.log("Data :", jsonData)     
    await createFile(JSON.stringify(jsonData, null, 2))
        // If a dropdown list was already made
    if($("#cJson")[0].options.length > 0){
        removeDropdown("#cJson")
    }
    if($("#fNames")[0].options.length > 0){
        removeDropdown("#fNames")
    }
    changeNamesDropdown()
    changeKeysDropdown()
    storeKeys()
});

    //Delete the json file
$('#delJbut').on('click', async() => {
    if($("#cJson")[0].options.length > 0){
        removeDropdown("#cJson")
    }
    if($("#fNames")[0].options.length > 0){
        removeDropdown("#fNames")
    }
    await deleteJson()
})

const fillEvent = ($dp) => {   
    let event = new Event("filled");
    $dp[0].dispatchEvent(event);
}

const emptyEvent = ($dp) => {
    let event = new Event("empty");
    $dp[0].dispatchEvent(event);
}
