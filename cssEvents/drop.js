//! Drag n' drop of data keys
const optListeners = () => {
	const opts = $("#uData ul li:not(.dropBox)");
	//*z-index: normal < hover < drag
	let handler;
	function moveHandler(elem) {
		handler = function (e) {
			e.preventDefault();
			elem.css({ top: `${e.y}px`, left: `${e.x - getRectPos(elem[0]).width / 2}px` });
			elem.addClass("dragged_li");
		};
	}
	opts.each((ind, opt) => {
		const $opt = $(opt);
		$opt.on("mousedown", e => {
			moveHandler($opt);
			document.addEventListener("mousemove", handler);
			dropOpts(true);
			$(document).one("mouseup", e => {
				$opt.removeClass("dragged_li")
					.fadeOut(10, () => $opt.fadeIn(500))
					.css({ left: "", top: "" })
					.fadeIn();

				document.removeEventListener("mousemove", handler);
				dropOpts(false);
				changeIndDp($opt);
			});
		});
	});
};
let mouseOverCur_li = -1,
	mouseOverPre_li = -1,
	indexes = [];
function liHandler(e) {
	const li = $("#indexes ul li");
	let inside = 0;
	indexes.forEach(ind => {
		const item = $(li[ind]);
		const { left, right, top, bottom, height, width } = getRectPos(item[0]);
		//*Hover effect by detecting in which li the mouse is currently on
		if (e.x - left < width && right - e.x < width && e.y - top < height && bottom - e.y < height) {
			inside++;
			[mouseOverPre_li, mouseOverCur_li] = [mouseOverCur_li, ind];
			if (mouseOverPre_li !== mouseOverCur_li) {
				item.addClass("drop_to_index");
				mouseOverCur_li = ind;
			}
		} else if (mouseOverPre_li !== mouseOverCur_li) {
			item.removeClass("drop_to_index");
		}
	});
	//*If the li is not dropped inside the indexes list
	if (!inside) {
		$(li[mouseOverCur_li]).removeClass("drop_to_index");
		[mouseOverPre_li, mouseOverCur_li] = [-1, -1];
	}
}

const dropOpts = listen => {
	//*Determining how many li's are visible (0.7 ratio seems good)
	//*and which ones to pick for the handler
	let indListPos = getRectPos($("#indexes ul")[0]);
	const ulTop = indListPos.top,
		ulBot = indListPos.bottom;
	let indexesPos = [],
		VisIndexes = [];
	$("#indexes ul li").each((ind, elem) => indexesPos.push(getRectPos(elem)));
	let i = 0;
	for (const indPos of indexesPos) {
		const { top, bottom, height } = indPos;
		let visRatio = height * 0.7;
		if (top > ulTop - visRatio && bottom < ulBot + (height - visRatio)) {
			VisIndexes.push(i);
		}
		i++;
	}
	if (listen) {
		indexes = VisIndexes;
		$(".changeCol ul").css("--curs", "grabbing");
		document.addEventListener("mousemove", liHandler);
	} else {
		indexes = [];
		$(".changeCol ul").css("--curs", "grab");
		document.removeEventListener("mousemove", liHandler);
	}
};
const changeIndDp = dragItem => {
	if (mouseOverCur_li !== -1) {
		const ind = mouseOverCur_li + 1,
			drop_li_p = $(`.indexes_li:nth-child(${ind})`).removeClass("drop_to_index").addClass("show_trash").children();
		let prev_txt = drop_li_p[1].innerText;
		drop_li_p[1].innerText = dragItem.text();
		temp_ki_pairs[ind] = { key: dragItem.text(), ind };

		$(drop_li_p[2].children[0]).attr("src", "images/main/trash.png"); //li > div > img
		addTrashListener(drop_li_p[2]);

		changes.Add(ind, prev_txt);
	}
};
