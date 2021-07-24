//! Undo-Redo Functionality
function keyHandler(e) {
	console.log(e.key);
	if (e.key === "z" || e.key === "Z") {
		if (changes.undoLen) changes.Undo();
	} else if (e.key === "y" || e.key === "Y") {
		if (changes.redoLen) changes.Redo();
	} else if (e.key === "s" || e.key === "S") {
		e.preventDefault();
		console.log("hello?");
		save_changes().then(() => {});
	}
	$(document).on("keyup", e => {
		if (e.key === "Control") {
			$(this).off(e);
			document.removeEventListener("keydown", keyHandler);
		}
	});
}
$(document).on("keydown", e => {
	if (e.key === "Control") {
		document.addEventListener("keydown", keyHandler);
	}
});
