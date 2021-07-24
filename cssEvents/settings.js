//! Open Settings
let settsOpen = false;
function OpenSettings(e) {
	const fadeKeysFrames = [{ opacity: 0.01 }, { opacity: 1 }];
	const animOpts = { duration: 500, direction: settsOpen ? "reverse" : "normal", fill: "forwards" };
	const id = e.currentTarget.id;
	e.currentTarget.removeEventListener("click", OpenSettings);
	if (id == "userIcon") {
		$("#settsBgBlur").css({ zIndex: 7 });
		const fadeAnim = $("#userSettings").css("zIndex", 10)[0].animate(fadeKeysFrames, animOpts);
		fadeAnim.finished.then(() => {
			settsOpen = !settsOpen;
			document.querySelector("#closeSetts").addEventListener("click", OpenSettings);
		});
	} else if (id == "closeSetts") {
		$("#settsBgBlur").css({ zIndex: -10 });
		const fadeAnim = $("#userSettings")[0].animate(fadeKeysFrames, animOpts);
		fadeAnim.finished.then(() => {
			settsOpen = !settsOpen;
			$("#userSettings").css("zIndex", -10);
			document.querySelector("#userIcon").addEventListener("click", OpenSettings);
		});
	}
}
document.querySelector("#userIcon").addEventListener("click", OpenSettings);

//! On Off switch
function OnOfListener(e) {
	const swBody = e.currentTarget,
		swTrack = swBody.querySelector(".swTrack"),
		isOn = Number(get_computed_style(swTrack, "opacity")) < 0.5 ? false : true,
		ballKeyFrames = [{ transform: "translate(0px, -1.5px)" }, { transform: "translate(42px, -1.5px)" }],
		trackKeyFrames = [{ opacity: "0.001" }, { opacity: "1" }];
	console.log(isOn);
	swBody.removeEventListener("click", OnOfListener); //Removing the listener to prevent spam
	const animOpts = { duration: 250, direction: isOn ? "reverse" : "normal", fill: "forwards" };
	let ballAnim = swBody.querySelector(".swBall").animate(ballKeyFrames, animOpts);
	swTrack.animate(trackKeyFrames, animOpts);

	//* Cache setting
	if (swBody.id == "darkMode") {
		extCache.darkMode = !isOn;
		setCache("extCache");
		if (extCache.darkMode) {
			$("body").removeClass("whiteMode").addClass("darkMode");
			setImgPaths(true);
		} else {
			$("body").removeClass("darkMode").addClass("whiteMode");
			setImgPaths(false);
		}
		setImages(extCache.darkMode);
		removeImgListeners();
	} else if (swBody.id == "kIndexes") {
		userCache.kIndexes = !isOn;
		setCache(hostname);
		keepIndexes();
	} else if (swBody.id == "autoClose") {
		extCache.autoClose = !isOn;
		setCache("extCache");
	}
	ballAnim.finished.then(() => swBody.addEventListener("click", OnOfListener));
}
document.querySelectorAll(".swBody").forEach(elem => elem?.addEventListener("click", OnOfListener));
