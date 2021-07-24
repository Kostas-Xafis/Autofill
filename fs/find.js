//! Check if a json file exists for this website
const checkFileExist = operation => {
	return new Promise((resolve, reject) =>
		callFS(fs => {
			fs.root.createReader().readEntries(entries => {
				let exists = false;
				let fName = file_loc.replace("/", "");
				for (let entry of entries) {
					if (entry.name === fName) {
						exists = true;
						break;
					}
				}
				if (operation === "delete") {
					exists ? resolve() : reject();
				} else if (operation === "check") {
					exists ? resolve() : rejectHandler(reject, "warn", "There is no registered json file for this website");
				} else if (operation === "create") {
					resolve(exists);
				}
			}, errorhandler);
		})
	);
};
