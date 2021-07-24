const files = {
	fs: ["other.js", "find.js", "get.js", "create.js", "delete.js", "drop.js"],
	events: ["other.js", "actions.js", "drop.js", "undo.js"],
	cssEvents: ["other.js", "actions.js", "drop.js", "imgHov.js", "resize.js", "settings.js"]
};
(async () => {
	for (let folder in files) {
		for (let file of files[folder]) {
			await new Promise((res, rej) => {
				let script = document.createElement("script");
				script.src = `/${folder}/${file}`;
				script.onload = res;
				document.head.appendChild(script);
			});
		}
	}
})();
