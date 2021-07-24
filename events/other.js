//! Work with the popup html
window.addEventListener("load", async () => {
	sendmsg({ extensionloaded: true });
});

const create_new_dps = () => {
	if ($("#uData ul li").length > 0) {
		removeDropdown("#uData ul li:not(.dropBox)");
		removeDropdown(".fill_li");
	}
	$(".dropBox").css({ display: "none" });
	$("#fill_ul, #uData ul").css("align-content", "");
	$("#uData").css("--gtr", "");
	$("#uData .title").css({ display: "flex" });
	changeNamesDropdown();
	changeKeysDropdown();
};

const create_keyid_pairs = () => {
	//* create the pairs obj if it doesn't exist
	if (!jsonData?.ki_pairs) jsonData.ki_pairs = {};

	for (const dataObj in jsonData) {
		for (const key in jsonData[dataObj]) if (!jsonData.ki_pairs?.[key]) jsonData.ki_pairs[key] = "";
	}
};

//! Fill the inputs
const clickListeners = () => {
	$(".fill_li").each((ind, li) => {
		const $li = $(li);
		$li.on("click", () => {
			const data = jsonData[$li.text()];
			let sendJson = {};
			for (const key in data) {
				const id = jsonData.ki_pairs?.[key];
				sendJson[id] = id ? data[key] : "";
			}
			//* leave any other input blank
			for (const ind in inputs) {
				const { id } = inputs[ind];
				if (id in sendJson == false) sendJson[id] = "";
			}
			sendmsg({ fill: sendJson });
			if (extCache.autoClose) {
				window.close();
			}
		});
	});
};
