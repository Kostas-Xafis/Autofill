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
function removeIconHandlers() {
	this.removeEventListener("mouseenter", replaceIconHandlerEnter);
	this.removeEventListener("mouseleave", replaceIconHandlerLeave);
}
function changeIcon(elem) {
	elem.addEventListener("mouseenter", replaceIconHandlerEnter);
	elem.addEventListener("mouseleave", replaceIconHandlerLeave);
	elem.addEventListener("mode", removeIconHandlers, { once: true });
}
const event_ids = {};
let event_id_counter = 0;
function changePaths(elem, selector) {
	const [path1, path2] = iconPathChange[selector];
	elem.event_id = event_id_counter;
	event_ids[event_id_counter++] = [path1, path2];
	changeIcon(elem);
}

function activateIconChange() {
	$(".act_content > img").each((ind, elem) => {
		elem = elem.parentNode;
		changePaths(elem, ".act_content");
	});
	$("#openAct").each((ind, elem) => {
		changePaths(elem, "#openAct");
	});
	$("#closeAct").each((ind, elem) => {
		changePaths(elem, "#closeAct");
	});
	$("#userIcon").each((ind, elem) => {
		changePaths(elem, "#userIcon");
	});
	$("#closeSetts").each((ind, elem) => {
		changePaths(elem, "#closeSetts");
	});
}
activateIconChange();

function removeImgListeners() {
	const event = new Event("mode");
	$(".act_content").each((ind, elem) => elem.dispatchEvent(event));
	$("#barImg img").each((ind, elem) => elem.dispatchEvent(event));
	$("#userIcon")[0].dispatchEvent(event);
	$("#closeSetts")[0].dispatchEvent(event);
	activateIconChange();
}
