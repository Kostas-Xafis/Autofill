//! This function works like w+ (rewrites or creates)
const createFile = async data => {
	/*  Deleting the file first and then recreating it because
        the createWriter just changes the bytes of the file 
        and doesn't rewrite it.😢 
    */
	const createFileProm = () => {
		return new Promise((resolve, reject) =>
			callFS(fs => {
				fs.root.getFile(
					file_loc,
					{ create: true },
					fileEntry => {
						fileEntry.createWriter(
							fileWriter => {
								let fileData = new Blob([data], {
									type: "application/json"
								});
								fileWriter.onwriteend = () => {
									resolve("Saved");
								};
								fileWriter.onerror = e => {
									rejectHandler(reject, "error", e.target.error);
								};
								fileWriter.write(fileData);
							},
							err => rejectHandler(reject, "error", err)
						);
					},
					err => rejectHandler(reject, "error", err)
				);
			})
		);
	};

	await checkFileExist("create")
		.then(exists => {
			// if the file exists delete it and then create it again
			return exists ? deleteJson() : createFileProm();
		})
		.then(res => {
			//Undefined means that the resolve came from deleteJson
			// else it's a string from the createFileProm promise
			if (res == undefined) {
				return createFileProm();
			} else if (res === "Saved") {
				return;
			}
		})
		.then(() => {
			console.log("Saved file succesfully");
			return true;
		})
		.catch(catchHandler);
};
