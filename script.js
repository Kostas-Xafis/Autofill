let scanned = false,
    connected = false,
    keepIndexes = false, //* comes in conflict with the function on the popup but it's just the editor 
    port;
chrome.runtime.onMessage.addListener(req => {
    if('extensionloaded' in req){
        // Send a request to the popupjs to give it back some website info
        chrome.runtime.sendMessage({msg: "Ready"})
    } else if('fill' in req){
        //Fill the inputs
        console.log('fill')
        fill_inputs(req.fill)
    } else if('keepIndexes' in req){
        keepIndexes = req.keepIndexes
    }
    if(!connected){
        port = chrome.runtime.connect({name:"something"})
        connected = true
        if(!keepIndexes)
            indexing()

        port.onDisconnect.addListener(() => {
            console.log("Good bye extension!")
            connected = false
            if(!keepIndexes)
                remove_indexing()
        })
        chrome.runtime.sendMessage({msg:"Input_ind", inputs: inputIds});
    }
})
            // Scanning inputs 
let inputs = [],
    inputIds = {};
const get_inputs = () => {
    let inp = [...document.querySelectorAll("input, select")];
    inp = inp.filter(elem => elem.id !== '')
    console.log(inp)
    inputs = inp;
    inputs.forEach((elem, ind) => inputIds[ind+1] = {id:elem.id, index:ind+1});
}

            //Filling the inputs
const fill_inputs = (data) => {
    for(const id in data){
        let elem = document.getElementById(id)
        if(elem != null){
            const val = data[id];
            if(elem.tagName.toLowerCase() == 'input'){
                elem.value = val
            } else {
                elem.selectedIndex = val
            }
        }
    }
    data = {};
}
            // Giving every input of a form it's own index
const indexing = () => {    
    inputs.forEach((input, ind) => {
        if(input.id){
            const i = ind + 1;
            const label_text = input.labels ? (input.labels[0] ? input.labels[0].innerHTML : '') : '';
            if(label_text){
                input.labels[0].innerHTML += `<span style='font-weight:bold'> (${i}) </span>`
            }
            const type = input.tagName.toLowerCase();
            if(type === 'input'){
                input.placeholder += `(${i})`
            } else {
                input.item(0).innerText += `(${i})`
            }
        }
    })
}

const remove_indexing = () => {
    inputs.forEach( input => {
        if(input.id){
            const label_text = input.labels ? (input.labels[0] ? input.labels[0].innerText : '') : '';
            if(label_text){
                input.labels[0].querySelector("span").remove();
            }
            const type = input.tagName.toLowerCase();
            if(type === 'input'){
                input.placeholder = input.placeholder.replace(/[(]\d+[)]/g, '')
            } else {
                input.item(0).innerText = input.item(0).innerText.replace(/[(]\d+[)]/g, '')
            }
        }
    })
}

get_inputs();