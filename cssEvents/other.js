function get_fade_in_rate(index) {
	//* +3 because log(0) = -Infinity, log(1) = 0
	return Math.floor(Math.log10(index + 3) * 1000);
}

function get_cssRule(selector, sheet = 0) {
	return Object.values(document.styleSheets[sheet].cssRules).find(rule => rule?.selectorText == selector);
}

function getRectPos(elem) {
	return elem.getBoundingClientRect();
}

function get_computed_style(elem, attribute) {
	return window.getComputedStyle(elem)[attribute];
}

//* Trashcan listeners
function trashHandler(e) {
	const div = e.currentTarget;
	li = div.parentNode;
	if (!li.classList.contains("show_trash")) return;

	const span = li.children[1],
		ind = Number(div.getAttribute("data-ind"));
	changes.Add(ind, span.innerText);
	span.innerText = "";

	delete userCache.changes[ind];
	setCache(hostname);
	li.classList.remove("show_trash");
	div.removeEventListener("click", trashHandler);
}

function addTrashListener(trashcan_div) {
	trashcan_div.addEventListener("click", trashHandler);
}
