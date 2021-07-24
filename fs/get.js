//! Receive the JSON data from the file, if it exists
const getFileJson = filename => {
	return new Promise(resolve =>
		callFS(fs => {
			fs.root.getFile(
				filename,
				{ create: false },
				fileEntry => {
					fileEntry.file(async file => {
						jsonData = JSON.parse(await file.text());
						resolve();
					}, errorhandler);
				},
				errorhandler
			);
		})
	);
};
//! Get json data from a file picker
const getJson = async () => {
	try {
		[...fileHandles] = await window.showOpenFilePicker({
			types: [
				{
					accept: {
						"application/json": [".json"],
						"text/plain": [".txt"],
						"application/vnd.ms-excel": [".xls"],
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
						"application/xml": [".xml"],
						"text/xml": [".xml"]
					}
				}
			],
			multiple: true
		});
		for (const fileHandle of fileHandles) {
			const file_blob = await fileHandle.getFile();
			const file_extension = file_blob.name.match(/\.[^.]+$/)[0];
			let file_reader;
			if (file_extension === ".json" || file_extension === ".txt") {
				file_reader = async () => JSON.parse(await file_blob.text());
			} else if (file_extension === ".xlsx" || file_extension === ".xml" || file_extension === ".xls") {
				const { default: readXLSXdata } = await import("./readxls.js");
				file_reader = async () => await readXLSXdata(file_blob);
			}
			await appendJson(await file_reader(), i == fileHandles.length);
		}
	} catch (err) {
		throw new Error(err);
	}
};
