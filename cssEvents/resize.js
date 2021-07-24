//* Resizing the extension window
const minHeight = 220,
	maxHeight = 350;
let first_mDown = false;
function resHandler(e) {
	e.preventDefault();
	if (e.y > minHeight - 5 && e.y < maxHeight - 5) $(document.body).css({ height: `${e.y + 5}px` });
	else {
		if (e.y < minHeight - 5) $(document.body).css({ height: `${minHeight}px` });
		else $(document.body).css({ height: `${maxHeight}px` });
	}
}
function mUpHandler(e) {
	eventNum = 1;
	mDown = false;
	document.removeEventListener("mousemove", resHandler);
	document.removeEventListener("mouseup", mUpHandler);
	document.removeEventListener("mousedown", mDownHandler);
	extCache.height = `${$("body").height()}px`;
	setCache("extCache");
}
function mDownHandler(e) {
	mDown = true;
	let { height } = getRectPos(document.body);
	if (e.y <= height && e.y >= height - 7) {
		document.addEventListener("mousemove", resHandler);
		document.addEventListener("mouseup", mUpHandler);
	}
}
let eventNum = 1;
let mDown = false;
function mEnterHandler(e) {
	let cur_eventNum = eventNum++;
	if (cur_eventNum == 1) {
		// Initializing the listener only once
		document.addEventListener("mousedown", mDownHandler);
	}
}
$("#heightSlider")[0].addEventListener("mouseenter", mEnterHandler);
