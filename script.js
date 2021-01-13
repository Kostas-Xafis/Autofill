chrome.runtime.onMessage.addListener(req => {
    if('extensionloaded' in req){
        // Send a request to the popupjs to give you back some website info
        chrome.runtime.sendMessage({msg: "Ready", host: location.host, inputs: inputs})
    } else if('scan_inputs' in req){
        // Scan the inputs of the page    
        scan_inputs()
    } else if('fill' in req){
        //Fill the inputs
        fill_inputs(req.fill)
    }
})
            // Scanning inputs 
let form_inputs = []
const scan_inputs = () =>{
    let forms_obj = document.getElementsByTagName('form')
    
    let forms = Object.entries(forms_obj);
    forms = forms.flat().filter(elem => typeof elem == 'object');

    
    if(forms.length > 0){
        forms.forEach((form, ind) => form_inputs[ind] = findInputs(form).flat(Infinity))
    }
    form_inputs.forEach((form, ind) => form_inputs[ind] = form.filter(input => {
            // if the input isn't null and has an id
            if(input != null){
                if(input.id){
                    return true
                }
            }
        }));
    form_inputs = form_inputs.filter(form => form.length > 0);    
        //Give each input it's own index
    indexing();
}

const pTags = ['div', 'p', 'table','tbody', 'tr', 'td', 'thead', 'th', 'ul', 'ol', 'li', 'dt', 'dl', 'span', 'fieldset']

const findInputs = (parent) => {
    let children = parent.children
    let arr = []
    for(let i = 0; i < children.length; i++){
        let tag = children[i].tagName.toLowerCase()
        if(tag == 'input' || tag == 'select'){
            if(children[i].style.display != "none" && children[i].type != "hidden"){
                arr.push(children[i])
            }
        } else if(pTags.findIndex(tagname => tagname == tag) >= 0){
            arr.push(findInputs(children[i]))
        } else {
            arr.push(null)
        }
    }
    if(arr.length > 0){
        return arr.slice()
    } else {
        return null
    }
}
            //Filling the inputs
const fill_inputs = (data) => {
    for(const key in data){
        let elem = document.getElementById(key)
        if(elem != null){
            const val = data[key];
            if(elem.tagName.toLowerCase() == 'input'){
                elem.value = val
            } else {
                elem.selectedIndex = val
            }
        }
    }
}
            // Giving every input of a form it's own index
let inputs = [];
const indexing = () => {
    let i = 1;
    form_inputs.forEach(form => form.forEach( input => {
        if(input.id){
            inputs.push({id:input.id, ind:i});
            let index = `<span style='font-weight:bold'> (${i}) </span>`
            let label_text = input.labels ? (input.labels[0] ? input.labels[0].innerHTML : '') : '';
            if(label_text){
                input.labels[0].innerHTML += index
            }
            let type = input.tagName.toLowerCase();
            if(type === 'input'){
                input.placeholder += `(${i})`
            } else {
                input.item(0).innerHTML += `(${i})`
            }
        }
        i++;
    }))
    chrome.runtime.sendMessage({msg:"Input_ind", inputs: inputs})
}
