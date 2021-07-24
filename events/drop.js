//! Append Json data from drag and drop
$(document)
	.on("dragover", e => e.preventDefault())[0]
	.addEventListener("drop", dropFile);

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
