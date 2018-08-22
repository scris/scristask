var pstorage = window.localStorage;
var pplayer = $("#finishsound")[0];
var pmtonstart;
$(function () {
	if ((pstorage.getItem("pusetime") != null) && (pstorage.getItem("pusetime") != "null")) {
		$("#blankp").show();
		$("#ptimer").show();
		$("#proj").val(pstorage.getItem("projname"));
		$("#pminute").text(pstorage.getItem("pminute"));
		$("#psecond").text(pstorage.getItem("psecond"));
		$("#pclear").show();
		$("#ptime").hide();
		$("#ppause").hide();
		pmaxtime = pstorage.getItem("ptotal");
		pmtonstart = pstorage.getItem("ptotal");
	}
	else{
		$("#pclear").hide();
	}
});
$("#pstart").click(function () {
pplayer.load();
	if ((pstorage.getItem("pusetime") == null) || (pstorage.getItem("pusetime") == "null")) {
		pmaxtime = $("#ptime").val() * 60;
		if (!/^\d+$/.test(pmaxtime)) {
			pmaxtime = 52 * 60;
		}
		pstorage.setItem("projname", $("#proj").val());
		pstorage.setItem("ptotal", pmaxtime);
		pmtonstart = pmaxtime;
	}
	else
	{
		pmaxtime -= pstorage.getItem("pusetime");
	}
	$("#ppause").show();
	$("#pclear").show();
	$("#pstart").hide();
	$("#ptime").hide();
	ptimer = setInterval("CountDown()", 1000);
});
$("#ppause").click(function () {
	if ($("#ppause").val() == "Pause") pausyFunction();
	else resumyFunction();
});
$("#pclear").click(function () {
	$("#pstart").show();
	$("#ptime").show();
	$("#ppause").hide();
	$("#pclear").hide();
	$("#pminute").text("Timer haven't started 00");
	$("#psecond").text("00");
	clearInterval(ptimer);
	pstorage.setItem("pusetime", null);
});
function CountDown() {
	if (pmaxtime >= 0) {
		pminutes = Math.floor(pmaxtime / 60);
		pseconds = Math.floor(pmaxtime % 60);
		$("#pminute").text(pminutes);
		$("#psecond").text(pseconds);
		pstorage.setItem("pusetime", pmtonstart - pmaxtime);
		pstorage.setItem("pminute", pminutes);
		pstorage.setItem("psecond", pseconds);
		if (pmaxtime == 5 * 60) {
			if (window.Notification) {
				const notify1 = new Notification("5 minutes left");
			}
		}
		--pmaxtime;
	} else {
		pplayer.play();
		clearInterval(ptimer);
		if (window.Notification) {
			const notify2 = new Notification("Time is up.");
		}
		else{
			alert("Time is up.");
		}
		pstorage.setItem("pusetime", null);
		$("#ppause").hide();
		$("#pclear").hide();
		$("#pstart").show();
		$("#ptime").show();
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
