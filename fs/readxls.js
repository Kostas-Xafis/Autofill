//* Importing xlsx reader from cdn
function getXLSXreader() {
	return new Promise(res => {
		let xlsx_script = document.createElement("script");
		xlsx_script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js";
		xlsx_script.integrity = "sha512-wBcFatf7yQavHQWtf4ZEjvtVz4XkYISO96hzvejfh18tn3OrJ3sPBppH0B6q/1SHB4OKHaNNUKqOmsiTGlOM/g==";
		xlsx_script.crossOrigin = "anonymous";
		xlsx_script.id = "xlsx";
		xlsx_script.onload = res;
		document.head.appendChild(xlsx_script);
	});
}
//* Return a structured json from excel data
export default async function readXLSXdata(file_blob) {
	try {
		//* Making a request if the script doesn't exist, which by default it doesn't,
		if (document.getElementById("xlsx") == null) await getXLSXreader();

		//* Reading the raw data from file
		let xlsx_data = XLSX.read(new Uint8Array(await file_blob.arrayBuffer()), { type: "array" });

		//* Structuring the data to the desired form
		const structured_json = {};
		for (const SheetName of xlsx_data.SheetNames) {
			let data_array = XLSX.utils.sheet_to_json(xlsx_data.Sheets[SheetName], { header: 1 });
			const [keys_row, ...values_rows] = data_array.slice();
			for (const [id, ...value_row] of values_rows) {
				let i = 1;
				structured_json[id] = {};
				for (const value of value_row) {
					structured_json[id][keys_row[i]] = value;
					i++;
				}
			}
		}
		xlsx_data = {};
		return structured_json;
	} catch (err) {
		throw new Error(err);
	}
}
