let iconPathChange = {};

function setImgPaths(darkMode) {
	if (darkMode) {
		iconPathChange = {
			".act_content": ["main", "dark"],
			"#openAct": ["light", "main"],
			"#closeAct": ["light", "main"],
			"#closeSetts": ["light", "main"],
			"#userIcon": [".png", "-hov.png"]
		};
	} else {
		iconPathChange = {
			".act_content": ["main", "light"],
			"#openAct": ["main", "dark"],
			"#closeAct": ["main", "dark"],
			"#closeSetts": ["main", "dark"],
			"#userIcon": [".png", "-hov.png"]
		};
	}
}
function setImages(darkMode) {
	let img;
	if (darkMode) {
		img = document.querySelector("#openAct");
		img.setAttribute("src", "images/light/bars.png");
		img = document.querySelector("#closeAct");
		img.setAttribute("src", "images/light/x.png");
		img = document.querySelector("#closeSetts");
		img.setAttribute("src", "images/light/x.png");
		img = document.querySelector("#userIcon img");
		img.setAttribute("src", "images/dark/user.png");
		img = document.querySelectorAll(".innerDBox img");
		img[0].setAttribute("src", "images/dark/drop.png");
		img[1].setAttribute("src", "images/dark/drop.png");
	} else {
		img = document.querySelector("#openAct");
		img.setAttribute("src", "images/main/bars.png");
		img = document.querySelector("#closeAct");
		img.setAttribute("src", "images/main/x.png");
		img = document.querySelector("#closeSetts");
		img.setAttribute("src", "images/main/x.png");
		img = document.querySelector("#userIcon img");
		img.setAttribute("src", "images/main/user.png");
		img = document.querySelectorAll(".innerDBox img");
		img[0].setAttribute("src", "images/light/drop.png");
		img[1].setAttribute("src", "images/light/drop.png");
	}
}
const loadPrefs = () => {
	document.body.style.height = extCache.height;
	changes.init([userCache.undo, userCache.redo]);
	function openSwitches(id) {
		document.getElementById(id).classList.add("swTrackOpen");
	}
	if (extCache.darkMode) {
		//Dark mode on
		openSwitches("darkMode");
		setImgPaths(true);
		// Images are already set for dark mode... i might consider changing it in the future
	} else {
		//Dark mode off
		document.body.classList.add("whiteMode");
		document.body.classList.remove("darkMode");
		setImgPaths(false);
		setImages(false);
	}
	if (!userCache.hasFile) {
		[...document.querySelectorAll(".dropBox")].forEach(elem => elem.style.setProperty("display", "flex"));
	}
	if (userCache.kIndexes) {
		openSwitches("kIndexes");
	}
	if (extCache.autoClose) {
		openSwitches("autoClose");
	}
};
