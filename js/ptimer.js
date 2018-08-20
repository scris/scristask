var pplayer = $("#finishsound")[0];
$("#pstart").click(function () {
	pmaxtime = $("#ptime").val() * 60;
	if (!/^\d+$/.test(pmaxtime)) {
		pmaxtime = 52 * 60;
	}
	pplayer.load();
	$("#ppause").show(700);
	ptimer = setInterval("CountDown()", 1000);
});
$("#ppause").click(function () {
	if ($("#ppause").val() == "Pause") pausyFunction();
	else resumyFunction();
});

function CountDown() {
	if (pmaxtime >= 0) {
		pminutes = Math.floor(pmaxtime / 60);
		pseconds = Math.floor(pmaxtime % 60);
		$("#pminute").text(pminutes);
		$("#psecond").text(pseconds);
		if (pmaxtime == 5 * 60) {
			const notify1 = new Notification ("5 minutes left");
			alert("5 minutes left");
		}
		--pmaxtime;
	} else {
		pplayer.play();
		clearInterval(ptimer);
		const notify2 = new Notification ("Time is up.");
		alert("Time is up.");
		$("#ppause").hide(700);
	}
}

function pausyFunction() {
	$("#ppause").val("Resume");
	clearInterval(ptimer);
}

function resumyFunction() {
	$("#ppause").val("Pause");
	ptimer = setInterval("CountDown()", 1000);
}
