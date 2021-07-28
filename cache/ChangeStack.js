class ChangesStack {
	constructor() {
		this.undo = [];
		this.redo = [];
	}

	init([undo, redo]) {
		this.undo = undo;
		this.redo = redo;
	}

	Add(index, text) {
		this.undo.push({ ind: index, txt: text });
		this.redo = [];
		this.saveCache();
	}

	Undo() {
		const last = this.undo.pop(),
			li_item = $(`.indexes_li:nth-child(${last.ind}) p:nth-child(2)`),
			cur_txt = li_item.text();
		this.redo.push({ ind: last.ind, txt: cur_txt });
		li_item.text(last.txt);

		const li = li_item[0].parentNode;
		last.txt === "" ? this.removeTrashClass(li) : this.addTrashClass(li);
		this.saveCache();
	}

	Redo() {
		const last = this.redo.pop(),
			li_item = $(`.indexes_li:nth-child(${last.ind}) p:nth-child(2)`),
			cur_txt = li_item.text();
		this.undo.push({ ind: last.ind, txt: cur_txt });
		li_item.text(last.txt);

		const li = li_item[0].parentNode;
		last.txt === "" ? this.removeTrashClass(li) : this.addTrashClass(li);
		this.saveCache();
	}

	saveCache() {
		userCache.changes = {};
		[...$(".show_trash")].forEach(li => {
			let ind = li.querySelector("div").getAttribute("data-ind");
			userCache.changes[ind] = li.children[1].innerText;
		});
		userCache.undo = this.undo.slice();
		userCache.redo = this.redo.slice();
		setCache(hostname);
	}

	deleteAll() {
		this.undo = [];
		this.redo = [];
		this.saveCache();
	}

	addTrashClass(li) {
		if (!li.classList.contains("show_trash")) li.classList.add("show_trash");
	}

	removeTrashClass(li) {
		if (li.classList.contains("show_trash")) li.classList.remove("show_trash");
	}

	get undoLen() {
		return this.undo.length;
	}

	get redoLen() {
		return this.undo.length;
	}
}
