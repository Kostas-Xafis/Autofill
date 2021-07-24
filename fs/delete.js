//! Delete the file that contains the data of that on that website
const deleteJson = () => {
	return new Promise((resolve, reject) =>
		callFS(fs => {
			fs.root.getFile(
				file_loc,
				{},
				fileEntry => {
					const filename = fileEntry.name;
					fileEntry.remove(
						() => {
							console.log(`Removed ${filename} succesfully`);
							resolve();
						},
						err => rejectHandler(reject, "error", err)
					);
				},
				err => rejectHandler(reject, "error", err)
			);
		})
	);
};
