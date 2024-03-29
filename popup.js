let jsonData,
	inputs,
	temp_ki_pairs = {},
	file_loc = "";
// Get user info Json file
chrome.runtime.onMessage.addListener(async message => {
	if (message.msg === "Ready") {
		file_loc = `/db_${hostname.replaceAll(".", "")}.json`;
		keepIndexes();
		//*Getting any the registered data
		try {
			if (!userCache?.hasFile) throw new Error("There is no file");
			console.log("Found json file");
			await getFileJson(file_loc);
			create_new_dps();
		} catch (err) {
			$("#uData").css("--gtr", "100%");
			$("#uData .title").css({ display: "none" });
			$("#fill_ul, #uData ul").css("align-content", "initial");
			console.log(err);
		}
		window.requestAnimationFrame(() => {
			document.body.style.width = "399px";
			window.requestAnimationFrame(() => (document.body.style.width = "400px"));
		}); // ! For some reason there a small space in the left
	} else if (message.msg === "Input_ind") {
		createIndexDropdown(message.inputs);
	}

	console.log(message.msg);
});

const sendmsg = msg => {
	chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, msg);
	});
};
//Creating a port listener to open a connection with the script.js
chrome.runtime.onConnect.addListener(port => {});
//*Create selection options
//User's info to fill
const changeNamesDropdown = () => {
	const $dp = $("#fill_ul");
	let totalKeys = Object.values(jsonData).length;
	if (totalKeys < 150) {
		for (const dataKey in jsonData)
			if (dataKey != "ki_pairs") $("<p>").text(dataKey).appendTo($("<li>").addClass("fill_li").appendTo($dp));
	} else {
		let txt = "";
		for (const dataKey in jsonData) if (dataKey != "ki_pairs") txt += `<li class="fill_li"><p>${dataKey}</p></li>`;

		$dp.html($dp.html() + txt);
	}
	$(".fill_li")
		.fadeOut(10)
		.each((ind, elem) => $(elem).fadeIn(get_fade_in_rate(ind + 1)));
	clickListeners();
};
//Json Key name to change
const changeKeysDropdown = () => {
	let $dp = $("#uData ul");
	let totalKeys = Object.values(jsonData.ki_pairs).length;
	if (totalKeys < 150) for (const key in jsonData.ki_pairs) $("<p>").text(key).appendTo($("<li>").addClass("keys_li").appendTo($dp));
	else {
		let txt = "";
		for (const key in jsonData.ki_pairs) txt += `<li class="keys_li"><p>${key}</p></li>`;
		$dp.html($dp.html() + txt);
	}
	optListeners();
	get_cssRule(".changeCol ul li").style.maxWidth = `${($("body").width() - 37) / 2}px`;
	$(".keys_li").fadeOut(10);
};
//Index of inputs dropdown
const createIndexDropdown = inputsArr => {
	inputs = inputsArr;
	const $dp = $("#indexes ul");
	const changes = userCache.changes;
	Object.entries(inputsArr).forEach(([i, { id, index }]) => {
		const change = changes?.[i] ? changes[i] : "";
		let li = $("<li>").addClass("indexes_li");
		let p = $("<p>").addClass("index").text(`${index}.`).appendTo(li.appendTo($dp));
		p.after($("<p>").text(change));

		//!Trash image
		let img = $("<img>");
		let div = $("<div>").attr("data-ind", index);
		img.appendTo(div.appendTo(p.parent()));
		if (change != "") {
			li.addClass("show_trash");
			img.attr("src", "/images/main/trash.png");
			addTrashListener(div[0]);
		}
	});

	$("#indexes ul li").fadeOut(10);
};

const removeDropdown = list => {
	$(list).remove();
};

const keepIndexes = () => {
	sendmsg({ keepIndexes: userCache.kIndexes });
};
