let user_data = null;
    
chrome.runtime.onMessage.addListener(req => {
    if('extensionloaded' in req){
        // Send a request to the popupjs to give you back the users info
        if(user_data == null){
            chrome.runtime.sendMessage({msg: 'page-loaded'})
        } else {
            chrome.runtime.sendMessage({msg: 'load-users', newUsers: user_data})
        }
    } else if('user_data' in req){
        // Get the users info from popup.js
        if(user_data == null){
            user_data = req.user_data
            console.log(user_data)
        }
    } else if('scan_inputs' in req){
        // Scan the inputs of the page    
        scan_inputs()
    } else if ('change' in req){
        // Change Json names of users info
        let key = req.change;
        for(let user in user_data){
            if(key in user_data[user]){
                change_user_data(key);
            } else {
                console.log(`The ${key} key doesn't exist the user_data object`)
            }
            break;
        }
    } else if('fill' in req){
        //Un-focus every input
        unfocus();
        //Fill the inputs
        fill_inputs(req.fill);
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
    form_inputs.forEach((form, ind) => form_inputs[ind] = form.filter(input => input != null));

    console.log("Forms :", form_inputs);

        // Giving each input a focus listener
    form_inputs.forEach(form => Give_focus_listener(form));
}

const pTags = ['div', 'p', 'table','tbody', 'tr', 'td', 'thead', 'th', 'ul', 'ol', 'li', 'dt', 'dl', 'span', 'fieldset']

const findInputs = (parent) => {
    let children = parent.children
    let arr = []
    for(let i = 0; i < children.length; i++){
        let tag = children[i].tagName.toLowerCase()
        if(tag == 'input' || tag == 'select'){
            arr.push(children[i])
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
            //Change the users info names
const input_focus_event = (id) => {
    return new CustomEvent('input_focused', {detail: id})
}

const change_user_data = (key => {
    console.log('I am waiting for you to press an input element...');

        // Cant remove anonymous functions...
    const EventHandler = async (e) => {
        const inputId = e.detail;
        console.log(`Changed ${key} key with ${inputId}`)

        for(let user in user_data){            
            user_data[user][inputId] = user_data[user][key];
            delete user_data[user][key];
        }
        console.log(user_data);

        // If ((1)focus mode on -> (2)other input focus) will pass the (1) focused element 
        document.getElementById(inputId).blur();
        //Remove handler
        e.target.removeEventListener('input_focused', EventHandler);
    }

    document.body.addEventListener('input_focused', EventHandler);
})

const Give_focus_listener = ( (form) => {
    form.forEach(input => input.addEventListener('focus', () => document.body.dispatchEvent(input_focus_event(input.id))))
})
            //Filling the inputs
const fill_inputs = (user) => {
    for(const key in user_data[user]){
        let elem = document.getElementById(key);
        if(elem != null){
            const val = user_data[user][key];
            if(elem.tagName.toLowerCase() == 'input'){
                elem.value = val
            } else {
                elem.selectedIndex = val
            }
        }
    }
}

const unfocus = () => {
    form_inputs.forEach(form => form.forEach(input => input.blur()));
}