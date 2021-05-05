function get_fade_in_rate(index){
    //* +3 because log(0) = -Infinity, log(1) = 0 
    return Math.floor(Math.log10(index+3)*1000)
}

function get_cssRule(selector, sheet = 0){
    return Object.values(document.styleSheets[sheet].cssRules).find(
        (rule) => rule?.selectorText == selector
    );
}

function getRectPos(elem){
    return elem.getBoundingClientRect();
};

        //! Handling actions and their popups
let act_clicked = false
$("#act_note").fadeOut(10)
$("#actions_body").fadeOut(10)

function OpenActions (e){
    $('#barImg')[0].removeEventListener("click", OpenActions)
    const actions = $("#actions")
    let final_slide_anim;
    const slideTopts = { easeing: "linear", fill: "forwards" };
    const slideTransition = [
        { marginLeft: "400px", opacity: 0 },
        { marginLeft: "0px", opacity: 1}];
    const bkgroundDimTransition = [
        { background: "rgb(0 0 0 / 0%)" },
        { background: "rgb(0 0 0 / 50%)"},
    ];

    const action_class = $(".action");
    const action_body = $("#actions_body");
    barImgFlip();
    if (!act_clicked) {
        //* Dimming the background a bit
        actions.css({ left: "0px" })[0]
            .animate(bkgroundDimTransition, {duration: 400, fill: "forwards"});
        
        let final_slide_anim;
        action_class.each((ind, elem) => {
            slideTopts.duration = get_fade_in_rate(ind);
            final_slide_anim = $(elem)[0]
              .animate(slideTransition, slideTopts);
        });
        actions.css({ zIndex: "10" });
        action_body.css({ display: "grid" });
        final_slide_anim.finished.then(() => {
            action_body.css({ background: "var(--main-col)" });
            $("#barImg")[0].addEventListener("click", OpenActions);
        })
    } else {
        actions[0].animate(bkgroundDimTransition, {duration:400, direction:"reverse", fill:"forwards"});
        slideTopts.direction = "reverse";
        action_body.css({ background: "" });
        action_class.each((ind, elem) => {
            slideTopts.duration = get_fade_in_rate(ind-1);
            final_slide_anim = $(elem)[0]
                .animate(slideTransition, slideTopts);
        });
        
        final_slide_anim.finished.then(() => {
            actions.css({ zIndex: "0", left: "400px" });
            action_body.css({ display: "none" });
            $("#barImg")[0].addEventListener("click", OpenActions);
        })
    }
    act_clicked = !act_clicked;
}

$('#barImg')[0].addEventListener("click", OpenActions)
const barImgFlip = () => {
    const imgKeyframes = [
        {transform: "rotateZ(0deg)", opacity: 1},
        {transform: "rotateZ(90deg)", opacity: 0.5}]
    const img = $('#openAct')
    const img2 = $('#closeAct')
    function imgToAnimate(){
        return act_clicked ? img2 : img;
    }
    const barAnim = imgToAnimate()[0].animate(imgKeyframes,
                    {duration: 150,  fill: "forwards"})
    barAnim.finished.then(() => {
        [imgKeyframes[0].transform, imgKeyframes[1].transform] = ["rotateZ(180deg)", "rotateZ(90deg)"];
        imgToAnimate()[0].animate(imgKeyframes,
                    {duration: 150, direction:"reverse", fill:"forwards"})
        img.css({display: act_clicked ? "none" : ""})
        img2.css({display:act_clicked ? "block" : "none"})
    })
}
        //!Switching icons to main color and back

function replaceIconHandlerEnter() {
    const [str1, str2] = event_ids[this.event_id];
    const $elem = this.tagName === "IMG" ? $(this) : $(this).children("img");
    $elem.attr("src", $elem.attr("src").replace(str1, str2));
}
function replaceIconHandlerLeave() {
    const [str1, str2] = event_ids[this.event_id];
    const $elem = this.tagName === "IMG" ? $(this) : $(this).children("img");
    $elem.attr("src", $elem.attr("src").replace(str2, str1));
}
function removeIconHandlers(){
    this.removeEventListener("mouseenter", replaceIconHandlerEnter);
    this.removeEventListener("mouseleave", replaceIconHandlerLeave);
}
function changeIcon(elem){
    elem.addEventListener("mouseenter", replaceIconHandlerEnter)
    elem.addEventListener("mouseleave", replaceIconHandlerLeave)
    elem.addEventListener("mode", removeIconHandlers, {once:true})
}
const event_ids = {}
function activateIconChange(){
    let counter = 0;
    $(".act_content > img").each((ind, elem) => {
        elem = elem.parentNode
        const [path1, path2] = iconPathChange[".act_content"]
        elem.event_id = counter;
        event_ids[counter++] = [path1, path2];
        changeIcon(elem)
    })
    $("#openAct").each((ind, elem) => {
        const [path1, path2] = iconPathChange["#openAct"]
        elem.event_id = counter;
        event_ids[counter++] = [path1, path2];
        changeIcon(elem)
    })
    $("#closeAct").each((ind, elem) => {
        const [path1, path2] = iconPathChange["#closeAct"]
        elem.event_id = counter;
        event_ids[counter++] = [path1, path2];
        changeIcon(elem)
    })
    $("#userIcon").each((ind, elem) => {
        const [path1, path2] = iconPathChange["#userIcon"]
        elem.event_id = counter;
        event_ids[counter++] = [path1, path2];
        changeIcon(elem)
    })
    $("#closeSetts").each((ind, elem) => {
        const [path1, path2] = iconPathChange["#closeSetts"]
        elem.event_id = counter;
        event_ids[counter++] = [path1, path2];
        changeIcon(elem)
    })
}
activateIconChange();

function removeImgListeners(){
    const event = new Event("mode")
    $(".act_content").each((ind, elem) => elem.dispatchEvent(event))
    $("#barImg img").each((ind, elem) => elem.dispatchEvent(event))
    $("#userIcon")[0].dispatchEvent(event)
    $("#closeSetts")[0].dispatchEvent(event)
    activateIconChange()
}
        //! Popup window for actions  
const action_popup = (note) => {
    let note_text = "",
        note_yes = "",
        note_no = "";
    switch(note){
        case "deleteOk": 
            note_text = "Delete your data for this website?"
            note_yes  = "Yes"
            note_no   = "No"
            break
        case "deleteNoFile":
            note_text  = "There is no file to delete for this website"
            note_yes   = "Ok"
            break
        case "upload":
            note_text = ". Do you want to continue?"
            note_yes  = "Yes"
            note_no   = "No"
            $("#note").css("font-size", "12px")
            break
    }
    $("#note").text(note_text)
    $("#note_yes p").text(note_yes)
            //?Make a popup with 1 or 2 buttons (yes and/or no);
    if(note_no){
        $("#note_no p")[0].innerText = note_no
        $("#note_no").css("display", "flex")
    } else {
        $("#note_no").css("display", "none")
    }
    $("#act_note").fadeIn(400).css({zIndex: "15"})
    $("#bblock_popup").css({display: "block"})
    $("#barImg").css({filter: "blur(3px)"})
    ans_click()
}

const ans_click = () => {
    // Creating and removing a click listener for both yes and no answers
    $("#note_yes, #note_no").each((ind, elem) => {
        $(elem).on("click", () => {
            $("#act_note").fadeOut(400, () => {
                $("#barImg").css({filter:""});
                $("#bblock_popup").css({display:""})
                $("#act_note").css({zIndex: "-10"})
                $("#note_yes, #note_no").each((ind, elem) => $(elem).off("click"))
            })
        })
    })
}
        // ! Open the side panel
let expanded = false;
$("#expand_arrow").on("click", (e) => {
    const expImg = $("#expand_arrow img"),
          expBody = $("#expand_arrow"),
          changes = $("#changes"),
          cSelect = $("#changeSelect")
    if(!expanded) {
        changes.css("--changes-w", `${$("#main_body").width()}px`)
        expBody.css({borderLeft: "2px solid var(--main-col)"})
        cSelect.css({display: "flex"})
        expImg.css({transform: "rotateZ(270deg)"})
        $(".keys_li").each((ind, elem) => $(elem).fadeIn(get_fade_in_rate(ind)))
        $("#indexes ul li").each((ind, elem) => $(elem).fadeIn(get_fade_in_rate(ind)))
    } else {
        changes.css("--changes-w", "")
        expBody.css({borderLeft:""})
        cSelect.css({display: "none"})
        expImg.css({transform: ""})
        $(".changeCol ul li:not(.dropBox)").fadeOut(10)
    }
    expanded = !expanded
})

        //! Open Settings
let settsOpen = false;
function OpenSettings(e) {
    const fadeKeysFrames = [{opacity:0.01}, {opacity:1}]
    const animOpts = {duration: 500, direction: settsOpen ? "reverse" : "normal",
                      fill:"forwards"}
    const id = e.currentTarget.id
    e.currentTarget.removeEventListener("click", OpenSettings)
    if(id == "userIcon"){
        $("#settsBgBlur").css({zIndex: 7})
        const fadeAnim = $("#userSettings").css("zIndex", 10)[0].animate(fadeKeysFrames, animOpts)
        fadeAnim.finished.then(() => {
            settsOpen = !settsOpen;
            document.querySelector("#closeSetts").addEventListener("click", OpenSettings)
        })
    }else if(id == "closeSetts"){
        $("#settsBgBlur").css({zIndex: -10})
        const fadeAnim = $("#userSettings")[0].animate(fadeKeysFrames, animOpts)
        fadeAnim.finished.then(() => {
            settsOpen = !settsOpen;
            $("#userSettings").css("zIndex", -10)
            document.querySelector("#userIcon").addEventListener("click", OpenSettings)
        })
    }
}
document.querySelector("#userIcon").addEventListener("click", OpenSettings)

        //! On Off switch 
function OnOfListener (e) {
    const target = e.currentTarget,
          isOn = $(target.querySelector(".swTrack")).width() < $(target).width()*0.4 ? false : true,
          ballKeyFrames = [{marginLeft:"-1px"}, {marginLeft:"41px"}],
          trackKeyFrames = [{width:"30%"}, {width:"100%"}];

    target.removeEventListener("click", OnOfListener); //Removing the listener to prevent spam 
    const animOpts = {duration: 250, direction: isOn ? "reverse" : "normal",
                      fill:"forwards"}
    let ballAnim = target.querySelector(".swBall").animate(ballKeyFrames, animOpts)
    target.querySelector(".swTrack").animate(trackKeyFrames, animOpts)

        //* Cache setting
    if(e.currentTarget.id == "darkMode"){
        extCache.darkMode = !isOn;
        setCache("extCache")
        if(extCache.darkMode){
            $("body").removeClass("whiteMode").addClass("darkMode");
            setImgPaths(true)
        } else {
            $("body").removeClass("darkMode").addClass("whiteMode");
            setImgPaths(false)
        }
        setImages(extCache.darkMode)
        removeImgListeners()
    } else if(e.currentTarget.id == "kIndexes"){
        userCache.kIndexes = !isOn;
        setCache(hostname);
        keepIndexes();
    } else if(e.currentTarget.id == "autoClose"){
        extCache.autoClose = !isOn;
        setCache("extCache")
    }
    ballAnim.finished.then(() => target.addEventListener("click", OnOfListener))
}
document.querySelectorAll(".swBody")
        .forEach((elem) => elem?.addEventListener("click", OnOfListener))

        //! Drag n' drop of data keys
const optListeners = () => {
    const opts = $("#uData ul li:not(.dropBox)")
    //z-index: normal < hover < drag
    let handler
    function moveHandler(elem) {
        handler = function (e) {
            e.preventDefault();
            elem.css({top: `${e.y}px`, left: `${e.x-getRectPos(elem[0]).width/2}px`})
            elem.addClass("dragged_li");
        }
    }
    opts.each((ind, opt) => {
        const $opt = $(opt)
        $opt.on("mousedown", (e) => {
            moveHandler($opt)            
            document.addEventListener("mousemove", handler)
            dropOpts(true);
            $(document).one("mouseup", (e) => {
                $opt.removeClass("dragged_li").fadeOut(10, () => $opt.fadeIn(500))
                    .css({left: "", top: ""}).fadeIn()

                document.removeEventListener("mousemove", handler)
                dropOpts(false);
                changeIndDp($opt);
            })
        })
    })
}
let mouseOverCur_li = -1,
    mouseOverPre_li = -1,
    indexes = [];
function liHandler(e) {
    const li = $("#indexes ul li")
    let inside = 0;        
    indexes.forEach(ind => {
        const item = $(li[ind])
        const {left, right, top, bottom, height, width} = getRectPos(item[0])

        if(e.x - left < width && right  - e.x < width &&
            e.y - top < height && bottom - e.y < height){
            inside++
            [mouseOverPre_li, mouseOverCur_li] = [mouseOverCur_li, ind]
            if(mouseOverPre_li !== mouseOverCur_li){
                item.addClass("drop_to_index");
                mouseOverCur_li = ind
            }
        } else if(mouseOverPre_li !== mouseOverCur_li){
            item.removeClass("drop_to_index");
        }
    })
    if(!inside){
        $(li[mouseOverCur_li]).removeClass("drop_to_index");
        [mouseOverPre_li, mouseOverCur_li] = [-1, -1]
    }
}

const dropOpts = (listen) => {
        //*Determining how many li's are visible (0.7 ratio seems good)
        //*and which ones to pick for the handler
    let indListPos = getRectPos($("#indexes ul")[0]);
    const ulTop = indListPos.top,
          ulBot = indListPos.bottom
    let indexesPos = [],
        VisIndexes = []
    $("#indexes ul li").each((ind, elem) => indexesPos.push(getRectPos(elem)))
    let i = 0;
    for(const indPos of indexesPos){
        const {top, bottom, height} = indPos
        let visRatio = height*0.7;
        if(top > ulTop - visRatio && bottom < ulBot + (height-visRatio)){
            VisIndexes.push(i);
        }
        i++
    }
    if(listen){
        indexes = VisIndexes;
        $(".changeCol ul").css("--curs","grabbing");
        document.addEventListener("mousemove", liHandler)
    } else {
        indexes = [];
        $(".changeCol ul").css("--curs","grab");
        document.removeEventListener("mousemove", liHandler)
    }
}
const changeIndDp = (dragItem) => {
    if(mouseOverCur_li !== -1){
        const ind = mouseOverCur_li+1,
              drop_li_p = $(`#indexes ul li:nth-child(${ind})`).removeClass("drop_to_index").children()
        let prev_txt = drop_li_p[1].innerText;
        drop_li_p[1].innerText = dragItem.text()
        temp_ki_pairs[ind] = {key:dragItem.text(), ind};
            //* Undo Redo stuff
        undo_changes_stack.push({ind, prev_txt});
        redo_changes_stack = [];

        userCache?.changes ?  0 : userCache.changes = {};
        userCache.changes[ind] = dragItem.text();
        setCache(hostname)
    }
}

function li_trash_enter_handler(e){
    const li = e.currentTarget;
    if (li.children[1].innerText === "") return;
    li.classList.add("show_trash");
    li.setAttribute("data-dir", "fwd");

    const div = li.querySelector("div");
    div.style.display = "flex";
    const div_width = getRectPos(div).width;
    if(div.children[0].src === "")
        div.children[0].src = "./images/main/trash.png"

    const slide_kframes = [
        { width: div_width <= 0.5 ? "0%" : `${div_width}px` },
        { width: "100%" }
    ];
    const slide_options = {duration:400, fill:"forwards", easing:"linear"}
    div.animate(slide_kframes, slide_options);
}

function li_trash_leave_handler(e) {
    const li = e.currentTarget;
    if (li.children[1].innerText === "" && li.getAttribute("data-dir") != "fwd") return;
    li.setAttribute("data-dir", "bkw");
    const div = li.querySelector("div");
    const div_width = getRectPos(div).width;

    const slide_kframes = [
        { width: "0%" },
        { width: div_width >= 33 ? "100%" : `${div_width}px` },
    ];
    const slide_options = { duration: 400, fill: "forwards", easing: "linear", direction:"reverse"};

    let anim = div.animate(slide_kframes, slide_options)
    anim.finished.then(() => {
        if(li.getAttribute("data-dir") === "fwd")
            return
        div.style.display = "none";
        li.classList.remove("show_trash")
    });
}

function trash_slide() {
    const index_li = $("#indexes ul li");
    index_li.each((ind, li) => {
        li.addEventListener("mouseenter", li_trash_enter_handler);
        li.addEventListener("mouseleave", li_trash_leave_handler);
    });

    const trashcans = $("#indexes ul li div");
    trashcans.each((ind, trash_div) => {
        trash_div.addEventListener("click", () => {
            let span = trash_div.parentNode.children[1] 
            undo_changes_stack.splice(undo_changes_stack.findIndex(undo => undo.ind == ind+1), 1) 
            redo_changes_stack = []
            delete userCache.changes[ind+1]
            userCache.undo = undo_changes_stack;            
            span.innerText = ""
            setCache(hostname)
        })
    })
}

    //* Resizing the extension window
const minHeight = 220,
      maxHeight = 350;
let first_mDown = false;
function resHandler (e) {
    e.preventDefault()
    if(e.y > minHeight-5 && e.y < maxHeight-5)
        $(document.body).css({height: `${e.y+5}px`});
    else {
        if(e.y < minHeight-5)
            $(document.body).css({height: `${minHeight}px`});
        else
            $(document.body).css({height: `${maxHeight}px`});
    }
}
function mUpHandler (e) {
    eventNum = 1; mDown = false;
    document.removeEventListener("mousemove", resHandler)
    document.removeEventListener("mouseup", mUpHandler);
    document.removeEventListener("mousedown", mDownHandler)
    extCache.height = `${$("body").height()}px`;
    setCache("extCache")
}
function mDownHandler (e) {
    mDown = true;
    let {height} = getRectPos(document.body);
    if(e.y <= height && e.y >= height-7){
        document.addEventListener("mousemove", resHandler)        
        document.addEventListener('mouseup', mUpHandler)
    }    
}
let eventNum = 1;
let mDown = false;
function mEnterHandler (e) {
    let cur_eventNum = eventNum++;
    if(cur_eventNum == 1){
            // Initializing the listener only once
        document.addEventListener('mousedown', mDownHandler)
    }
}
$("#heightSlider")[0].addEventListener("mouseenter", mEnterHandler)