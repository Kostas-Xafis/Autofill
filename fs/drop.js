//!Drag & Drop files
const dropFile = async e => {
	try {
		e.preventDefault();
		if (e.dataTransfer?.items?.length) {
			let drops = e.dataTransfer.files;
			for (const i in drops) {
				if (typeof drops[i] != "object") continue;

				const file_blob = drops[i];
				const extension = file_blob.name.match(/\.[^.]+$/)[0];
				if (extension === ".json" || extension === ".txt") {
					await appendJson(JSON.parse(await file_blob.text()));
				} else if (extension === ".xlsx" || extension === ".xls" || extension === ".xml") {
					const { default: readXLSXdata } = await import("./readxls.js");
					await appendJson(await readXLSXdata(file_blob));
				} else {
					const file_extension = await file_blob.name.match(/\.[^.]+$/)[0];
					console.log(`We do not currently support files with ${file_extension} extension`);
				}
			}
		}
	} catch (err) {
		//* Notify the user if an error occurs
		throw new Error(err);
	}
};
