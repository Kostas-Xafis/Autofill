//! Work with the popup html
window.addEventListener("load", async () => {
	sendmsg({ extensionloaded: true });
});
//! Save new json
async function save_changes() {
	if (!jsonData?.ki_pairs) return;
	for (const pair in temp_ki_pairs) {
		const { key, ind } = temp_ki_pairs[pair];
		jsonData.ki_pairs[key] = inputs[ind].id;
	}
	console.log(jsonData);
	await createFile(JSON.stringify(jsonData, null, 2));
	$("#indexes ul li p:nth-child(2)").text("");
	userCache.changes = {};
	setCache(hostname);
}

$("#act_Save").on("click", save_changes);

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
//! User gives a json file
$("#act_Upload").on("click", async () => {
	try {
		let res = await checkFileExist("create");
		if (res) {
			action_popup("upload");
			setTimeout(() => {
				$("#note").css("font-size", "16px");
			}, 400);
			await popup_ans();
		}
		await getJson();
	} catch (err) {
		console.error(err);
	}
});

//! Delete the json file
$("#act_Del").on("click", async () => {
	try {
		await checkFileExist("delete");
		action_popup("deleteOk");
		await popup_ans();
		if ($("#uData ul li").length > 0) {
			removeDropdown("#uData ul li:not(.dropBox)");
			removeDropdown(".fill_li");
		}
		await deleteJson();
		jsonData = {};
		temp_ki_pairs = {};
		$(".dropBox").css({ display: "flex" });
		$("#uData").css("--gtr", "100%");
		$("#uData .title").css({ display: "none" });
		$("#fill_ul, #uData ul").css("align-content", "initial");
		$("#indexes ul li p:nth-child(2)").text("");
		userCache.changes = {};
		userCache.hasFile = false;
		setCache(hostname);
	} catch (err) {
		if (err != "popup_close") {
			console.log(err);
			action_popup("deleteNoFile");
		} else {
			console.error(err);
		}
	}
});
//! Action popup promise
const popup_ans = () => {
	return new Promise((resolve, reject) => {
		$("#note_no, #note_yes").each((ind, elem) => {
			$(elem).on("click", () => {
				elem.id.includes("yes") ? resolve() : reject("popup_close");
			});
		});
	});
};
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

	for (const dataObj in jsonData) for (const key in jsonData[dataObj]) if (!jsonData.ki_pairs?.[key]) jsonData.ki_pairs[key] = "";
};
//! Append Json data (drag n' drop)
const appendJson = async (new_data, reset = true) => {
	let file_exists = jsonData?.ki_pairs ? true : false;
	//* If the user hasn't uploaded any data yet just create a new file
	if (!file_exists) {
		jsonData = new_data;
	} else {
		//*maybe notify the user for conflicts
		for (const dataObj in new_data) {
			if (jsonData?.[dataObj] === undefined) {
				jsonData[dataObj] = new_data[dataObj];
				continue;
			}
			for (const key in new_data[dataObj]) jsonData[dataObj][key] = new_data[dataObj][key];
		}
	}
	create_keyid_pairs();

	if (!reset) return;
	try {
		await createFile(JSON.stringify(jsonData, null, 2));

		userCache.hasFile = true;
		setCache(hostname);
		if (act_clicked) {
			OpenActions();
			setTimeout(create_new_dps, 400);
		} else if (expanded) {
			create_new_dps();
			$(".keys_li").each((ind, elem) => $(elem).fadeIn(get_fade_in_rate(ind)));
		}
	} catch (err) {}
};

//! Undo-Redo Functionality
function keyHandler(e) {
	console.log(e.key);
	if (e.key === "z" || e.key === "Z") {
		if (undo_changes_stack.length) Undo();
	} else if (e.key === "y" || e.key === "Y") {
		if (redo_changes_stack.length) Redo();
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

//!Create an object for UndoRedo!!!!!!!!

const Undo = () => {
	const top_stack = undo_changes_stack[undo_changes_stack.length - 1],
		{ ind, prev_txt } = top_stack,
		li_item = $(`#indexes ul li:nth-child(${ind}) p:nth-child(2)`);
	let cur_txt = li_item.text();
	redo_changes_stack.unshift({ ind, cur_txt });
	li_item.text(prev_txt);
	undo_changes_stack.pop();

	userCache.undo = undo_changes_stack.slice();
	userCache.redo = redo_changes_stack.slice();
	setCache("userCache");
};

const Redo = () => {
	const bot_stack = redo_changes_stack[0],
		{ ind, cur_txt } = bot_stack,
		li_item = $(`#indexes ul li:nth-child(${ind}) p:nth-child(2)`);
	let prev_txt = li_item.text();
	undo_changes_stack.push({ ind, prev_txt });
	li_item.text(cur_txt);
	redo_changes_stack.shift();

	userCache.undo = undo_changes_stack.slice();
	userCache.redo = redo_changes_stack.slice();
	setCache("userCache");
};
