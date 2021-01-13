const hoverHandle = (dCol, lCol, actual, trig) => {
    return (e) => {
        e.bubbles = false;
        if(e.target.tagName.toLowerCase() == "button"){
            $(actual).hover(() => $(actual).css({"background-color":dCol, "height":"100%", "width":"100%", "margin-left":"0%", "border-radius":"0px"}),
                            () => $(actual).css({"background-color":lCol, "height":"80%", "width":"80%", "margin-left":"10%", "border-radius":"15px"}))
                            .trigger(trig)
        }
    }
}
    //Scan button
let sActual = "#scan .actual"
const Cscan = {l:"#e8c262", d:"#daa520"}
$("#scan").hover(hoverHandle(Cscan.d, Cscan.l, sActual, "mouseenter"),
           hoverHandle(Cscan.d, Cscan.l, sActual, "mouseleave"))

    //Save json button
let sjActual = "#sJson .actual"
const Csj = {l:"#afeeee", d:"#25afaf"}
$("#sJson").hover(hoverHandle(Csj.d, Csj.l, sjActual, "mouseenter"),
            hoverHandle(Csj.d, Csj.l, sjActual, "mouseleave"))
    //Change button
let cJbut = "#cJbut .actual"
const CcJ = {l:"#90ee90", d:"#1dbf1d"}
$("#cJbut").hover(hoverHandle(CcJ.d, CcJ.l, cJbut, "mouseenter"),
                  hoverHandle(CcJ.d, CcJ.l, cJbut, "mouseleave"))
    //Take Json file Button
let takeJson = "#takeJson .actual"
const CtJ = {l:"#ffc0cb", d:"#ff5774"}
$("#takeJson").hover(hoverHandle(CtJ.d, CtJ.l, takeJson, "mouseenter"),
                     hoverHandle(CtJ.d, CtJ.l, takeJson, "mouseleave"))
    //Delete Json file Button
let delJbut = "#delJbut .actual"
const CdJ = {l:"#e89d17", d:"#cd6100"}
$("#delJbut").hover(hoverHandle(CdJ.d, CdJ.l, delJbut, "mouseenter"),
                     hoverHandle(CdJ.d, CdJ.l, delJbut, "mouseleave"))                     