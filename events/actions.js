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
		changes.deleteAll();
		setCache(hostname);
		setCache("extCache");
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
