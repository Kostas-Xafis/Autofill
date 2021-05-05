let userCache = {}, 
    extCache = {};
let undo_changes_stack = [],
    redo_changes_stack = [];
const getCache = async (key) => {
    if(typeof key != "object")
        key = [key];
    const prom  = await new Promise(res => chrome.storage.sync.get(key, (cache) => res(cache)));
    [userCache, extCache] = [prom?.[hostname] ? prom[hostname] : {}, 
                             prom?.extCache ? prom.extCache : {}];
    return loadPrefs();
}

const setCache = (key) => {
    const newCache = {}
    newCache[key] = key == "extCache" ? extCache : userCache;
    chrome.storage.sync.set(newCache)
}

const removeCache = async (key) => {
    chrome.storage.sync.remove([key])
}

let iconPathChange = {}

function setImgPaths(darkMode) {
    if(darkMode){
        iconPathChange = {
            ".act_content": ["main", "dark"],
            "#openAct": ["light", "main"],
            "#closeAct": ["light", "main"],
            "#closeSetts":["light", "main"],
            "#userIcon": [".png", "-hov.png"]}        
    } else {
        iconPathChange = {
            ".act_content": ["main", "light"],
            "#openAct": ["main", "dark"],
            "#closeAct": ["main", "dark"],
            "#closeSetts":["main", "dark"],
            "#userIcon": [".png", "-hov.png"]}
    }
}
function setImages(darkMode){
    let img;
    if(darkMode){
        img = document.querySelector("#openAct")
        img.setAttribute("src", "images/light/bars.png")
        img = document.querySelector("#closeAct")
        img.setAttribute("src", "images/light/x.png")
        img = document.querySelector("#closeSetts")
        img.setAttribute("src", "images/light/x.png")
        img = document.querySelector("#userIcon img")
        img.setAttribute("src", "images/dark/user.png")
        img = document.querySelectorAll(".innerDBox img");
        img[0].setAttribute("src", "images/dark/drop.png");
        img[1].setAttribute("src", "images/dark/drop.png");
    } else {
        img = document.querySelector("#openAct")
        img.setAttribute("src", "images/main/bars.png")
        img = document.querySelector("#closeAct")
        img.setAttribute("src", "images/main/x.png")
        img = document.querySelector("#closeSetts")
        img.setAttribute("src", "images/main/x.png")
        img = document.querySelector("#userIcon img")
        img.setAttribute("src", "images/main/user.png")
        img = document.querySelectorAll(".innerDBox img")
        img[0].setAttribute("src", "images/light/drop.png")
        img[1].setAttribute("src", "images/light/drop.png") 
    }
}
const loadPrefs = () => {
    document.body.style.height = extCache.height;
    undo_changes_stack = userCache.undo ? userCache.undo : [];
    redo_changes_stack = userCache.redo ? userCache.redo : [];
    function openSwitches(id){
        let $switch = document.getElementById(id);
        $switch.querySelector(".swTrack").style.width = "100%";
        $switch.querySelector(".swBall").style.marginLeft = "41px";
    }
    if(extCache.darkMode){
            //Dark mode on
        openSwitches("darkMode")
        setImgPaths(true)
        // Images are already set for dark mode... i might consider changing it in the future
    } else{
            //Dark mode off
        document.body.classList.add("whiteMode");
        document.body.classList.remove("darkMode");
        setImgPaths(false)
        setImages(false)
    }
    if(!userCache.hasFile){
        [...document.querySelectorAll(".dropBox")].forEach(elem => elem.style.setProperty("display", "flex"))
    }
    if(userCache.kIndexes){
        openSwitches("kIndexes")
    }
    if(extCache.autoClose){
        openSwitches("autoClose")
    }
}

let hostname = ""
chrome.tabs.query({active:true, currentWindow:true}, (tabs) => {
    hostname = new URL(tabs[0].url).hostname;
    getCache([hostname, "extCache"]);
})

// The cache will become more useful when user login and authentication (Oauth) comes