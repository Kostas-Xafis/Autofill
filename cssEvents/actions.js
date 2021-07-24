//! Handling actions and their popups
let act_clicked = false;
$("#act_note").fadeOut(10);

function OpenActions(e) {
	$("#barImg")[0].removeEventListener("click", OpenActions);
	const actions = $("#actions");
	let final_slide_anim;
	const slideTopts = { easeing: "linear", fill: "forwards" };
	const slideTransition = [
		{ transform: "translateX(100%)", opacity: 0 },
		{ transform: "translateX(0%)", opacity: 1 }
	];
	const bkgroundDimTransition = [{ backgroundColor: "rgb(0 0 0 / 0%)" }, { backgroundColor: "rgb(0 0 0 / 75%)" }];

	const action_class = $(".action");
	const action_body = $("#actions_body");
	barImgFlip();
	if (!act_clicked) {
		//* Dimming the background a bit
		actions.css({ left: "0px" })[0].animate(bkgroundDimTransition, { duration: 400, fill: "forwards" });

		let final_slide_anim;
		action_class.each((ind, elem) => {
			slideTopts.duration = get_fade_in_rate(ind);
			final_slide_anim = $(elem)[0].animate(slideTransition, slideTopts);
		});
		actions.css({ zIndex: "10" });
		final_slide_anim.finished.then(() => {
			action_body.css({ background: "var(--main-col)" });
			$("#barImg")[0].addEventListener("click", OpenActions);
		});
	} else {
		actions[0].animate(bkgroundDimTransition, { duration: 400, direction: "reverse", fill: "forwards" });
		slideTopts.direction = "reverse";
		action_body.css({ background: "" });
		action_class.each((ind, elem) => {
			slideTopts.duration = get_fade_in_rate(ind - 1);
			final_slide_anim = $(elem)[0].animate(slideTransition, slideTopts);
		});

		final_slide_anim.finished.then(() => {
			actions.css({ zIndex: "0", left: "400px" });
			$("#barImg")[0].addEventListener("click", OpenActions);
		});
	}
	act_clicked = !act_clicked;
}

$("#barImg")[0].addEventListener("click", OpenActions);
const barImgFlip = () => {
	const imgKeyframes = [
		{ transform: "rotateZ(0deg)", opacity: 1 },
		{ transform: "rotateZ(90deg)", opacity: 0.5 }
	];
	const img = $("#openAct");
	const img2 = $("#closeAct");
	function imgToAnimate() {
		return act_clicked ? img2 : img;
	}
	const barAnim = imgToAnimate()[0].animate(imgKeyframes, { duration: 150, fill: "forwards" });
	barAnim.finished.then(() => {
		[imgKeyframes[0].transform, imgKeyframes[1].transform] = ["rotateZ(180deg)", "rotateZ(90deg)"];
		imgToAnimate()[0].animate(imgKeyframes, { duration: 150, direction: "reverse", fill: "forwards" });
		img.css({ display: act_clicked ? "none" : "" });
		img2.css({ display: act_clicked ? "block" : "none" });
	});
};

//! Popup window for actions
const action_popup = note => {
	let note_text = "",
		note_yes = "",
		note_no = "";
	switch (note) {
		case "deleteOk":
			note_text = "Delete your data for this website?";
			note_yes = "Yes";
			note_no = "No";
			break;
		case "deleteNoFile":
			note_text = "There is no file to delete for this website";
			note_yes = "Ok";
			break;
		case "upload":
			note_text = "Do you want to continue?";
			note_yes = "Yes";
			note_no = "No";
			$("#note").css("font-size", "12px");
			break;
	}
	$("#note").text(note_text);
	$("#note_yes p").text(note_yes);
	//?Make a popup with 1 or 2 buttons (yes and/or no);
	if (note_no) {
		$("#note_no p")[0].innerText = note_no;
		$("#note_no").css("display", "flex");
	} else {
		$("#note_no").css("display", "none");
	}
	$("#act_note").fadeIn(400).css({ zIndex: "15" });
	$("#bblock_popup").css({ display: "block" });
	$("#barImg").css({ filter: "blur(3px)" });
	ans_click();
};

const ans_click = () => {
	// Creating and removing a click listener for both yes and no answers
	$("#note_yes, #note_no").each((ind, elem) => {
		$(elem).on("click", () => {
			$("#act_note").fadeOut(400, () => {
				$("#barImg").css({ filter: "" });
				$("#bblock_popup").css({ display: "" });
				$("#act_note").css({ zIndex: "-10" });
				$("#note_yes, #note_no").each((ind, elem) => $(elem).off("click"));
			});
		});
	});
};
// ! Open the side panel
let expanded = false;
$("#expand_arrow").on("click", e => {
	const expImg = $("#expand_arrow img"),
		expBody = $("#expand_arrow"),
		changes = $("#changes"),
		cSelect = $("#changeSelect");
	if (!expanded) {
		changes.css("--changes-w", `${$("#main_body").width()}px`);
		expBody.css({ borderLeft: "2px solid var(--main-col)" });
		cSelect.css({ display: "flex" });
		expImg.css({ transform: "rotateZ(270deg)" });
		$(".keys_li").each((ind, elem) => $(elem).fadeIn(get_fade_in_rate(ind)));
		$("#indexes ul li").each((ind, elem) => $(elem).fadeIn(get_fade_in_rate(ind)));
	} else {
		changes.css("--changes-w", "");
		expBody.css({ borderLeft: "" });
		cSelect.css({ display: "none" });
		expImg.css({ transform: "" });
		$(".changeCol ul li:not(.dropBox)").fadeOut(10);
	}
	expanded = !expanded;
});
