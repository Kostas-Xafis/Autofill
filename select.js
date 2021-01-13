let template = document.createElement("template");
template.innerHTML = 
`
<style>
    div, p, img, {
        margin: 0px;
        padding: 0px;
    }
    #main{
        width: 100%;
        height:100%;
        font-weight: 500;
        letter-spacing: 0.4px;
        cursor:default;
    }
    #base {
        width: inherit;
        height: 100%;
        display: grid;
    }
    #pick {
        position:relative;
        top:25%;
        height: 100%;        
        text-align: center;
        grid-column: 1/5;
    }
    #pick div {
        position: absolute;
        width: fit-content;
        overflow:hidden;
        text-overflow: ellipsis
    }
    #Darrow {
        position:relative;
        top:25%;
        left:25%;
        height: 100%;
        grid-column: 5/6;
    }
    #Darrow img {
        margin-top: 2px;
        width: 18px;
        height: 14px;
    }
    #optBody {
        position:absolute;
        overflow-y: scroll;
        display:none
    }
    .opt {
        width:100%;
        height:16px;        
        text-align:center;  
    }
    .optT{
        align-self:center;
        transition: box-shadow 350ms;
    }
</style>

<div id="main">
    <div id="base">
        <div id="pick">
            <div></div>
        </div>
        <div id="Darrow"><img src="select.png"></div>
    </div>
    <div id="optBody">

    </div>
</div>
`
let dpHeight = 16 * 5 // pixels * items
// let selectColors;
class Select extends HTMLElement{    
    constructor(){        
        super();
        this.arrowflipped = false;
        this.attachShadow({mode: "open"})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.options = [];
            //Colors d: for base l: for options h:hover effect(optional) 
        this.dColor = this.getAttribute("dColor") ? this.getAttribute("dColor") : "pink"
        this.lColor = this.getAttribute("lColor") ? this.getAttribute("lColor") : "#85c45b"

        this.shadowRoot.querySelector("#main").style.backgroundColor = this.dColor
        
        this.itemSelected = 0
        this.width = jQuery(this.shadowRoot.querySelector("#main")).width()

            //? Centering text position on init
        let pickDiv = jQuery(this.shadowRoot.querySelector("#pick div"))
        pickDiv.text(this.getAttribute("placeholder") ? this.getAttribute("placeholder") : "Select")
        pickDiv.css({
            "left":`${(((this.width - pickDiv.width())/2)/this.width)*100}%`           
        })

            //? Some dynamic css for options body
        let optBody = jQuery(this.shadowRoot.querySelector("#optBody"))        
        let optBodyWidth  = this.width            
        optBody.css({
            "backgroundColor":this.lColor,
            "width": `${optBodyWidth}px`            
        })
    }

    display(){
        this.shadowRoot.querySelector("#optBody").style.display = this.arrowflipped ? "none" : "grid"
    }

    arrowflip(){
        let keyframes = [
            {transform: "rotate(0deg)"},
            {transform: "rotate(180deg)"}
        ]
            //Think about the id that's in the MDN docs
        let img = this.shadowRoot.querySelector("#Darrow img")
        let bez = {norm: "cubic-bezier(.25,.9,.52,.67)", rev:"cubic-bezier(.67,.52,.9,.25)"}
        let anim = img.animate(keyframes, {easing: this.arrowflipped ? bez.rev : bez.norm, duration:700, direction: this.arrowflipped ? "reverse" : "normal"})
        this.display()        
        anim.finished.then(() => {
                // Animation class's way of animationend event
            img.style.transform = `rotate(${this.arrowflipped ? 180 : 0}deg)`
        })
    }

    empty(){
        let $optBody = jQuery(this.shadowRoot.querySelector("#optBody"))
            //Zero-ing the height because the background will still be visible
        $optBody.empty().css("height", "0px")
        this.shadowRoot.querySelector("#pick div").innerText = this.getAttribute("placeholder")
        this.options = [];
    }

    fill(e){
            //Assigning the HEIGHT of options body here since it depends on amount of options
        let optBody = jQuery(this.shadowRoot.querySelector("#optBody"))
        let optBodyHeight = optBody[0].childElementCount * 16 <= dpHeight ? optBody[0].childElementCount * 16 : dpHeight
        optBody.css({
            "height":`${optBodyHeight}px`,
            "overflow-y":(optBodyHeight > dpHeight ? "scroll" : "auto")
        });
        
        let picked = jQuery(this.shadowRoot.querySelector("#pick div"))
            //Adding a click and hover lister on each option
        Object.entries(e.target.children).forEach((optArr, ind) => {
            this.options.push(optArr[1]);
            let option = jQuery(optArr[1])
            option.on('click', (e) => {
                picked.text(e.target.innerText)
                    //Centering the text with the left property
                picked.css("left", `${(((this.width - picked.width())/2)/this.width)*100}%`)
                    // A way to reference both the index and the actual option
                this.itemSelected = {ind:ind+1, item: e.currentTarget}
            })
            option.hover((e) => jQuery(e.target).css("box-shadow", "inset 0px 0px 5px 1px #00131a"),
                         (e) => jQuery(e.target).css("box-shadow", "inset 0px 0px 0px 0px #00131a"))
        })
    }

    connectedCallback() {
            //If the user clicks on the element open the options & flip the arrow
        this.shadowRoot.addEventListener('click', () => {
            this.arrowflip()
            this.arrowflipped = !this.arrowflipped
        })
            //If the user clicks anywhere else on the popup -> close the options & flip the arrow
        window.addEventListener('click', (e) =>{
            if(e.target.id != this.id && this.arrowflipped){
                this.arrowflip();
                this.arrowflipped = !this.arrowflipped
            }
        })
            //An event listener for when the element's options are generated
        this.shadowRoot.querySelector("#optBody").addEventListener('filled', (e) => {               
                this.fill(e)
        })
        this.addEventListener('empty', () => {               
            this.empty()
        })
    }

    disconnectedCallback() {
        this.shadowRoot.removeEventListener()
    }
}

window.customElements.define("select-pro", Select);