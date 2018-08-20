var storage = window.localStorage;
var player = $("#finishsound")[0];
var bmtonstart;
$(function () {
	player.load();
	if ((pstorage.getItem("busetime") != null) && (pstorage.getItem("busetime") != "null")) {
		$("#blankb").show();
		$("#btimer").show();
		$("#minute").text(pstorage.getItem("bminute"));
		$("#second").text(pstorage.getItem("bsecond"));
		$("#bclear").show();
		$("#inputy").hide();
		maxtime = pstorage.getItem("btotal");
		bmtonstart = pstorage.getItem("btotal");
	}
	else{
		$("#bclear").hide();
	}
});
$("#starty").click(function () {
	if ((pstorage.getItem("busetime") == null) || (pstorage.getItem("busetime") == "null")) {
		maxtime = $("#worktime").val() * 60;
		if (!/^\d+$/.test(maxtime)) {
			maxtime = 52 * 60;
		}
		bmtonstart = maxtime;
		pstorage.setItem("btotal", maxtime);
	} else {
		maxtime -= storage.getItem("busetime");
	}
	$("#bclear").show();
	$("#starty").hide();
	$("#inputy").hide();
	btimer = setInterval("workCountDown()", 1000);
});
$("#bclear").click(function () {
	$("#bclear").hide();
	$("#starty").show();
	$("#inputy").show();
	$("#minute").text("Timer haven't started 00");
	$("#second").text("00");
	clearInterval(btimer);
	storage.setItem("busetime", null);
});
function workCountDown() {
	if (maxtime >= 0) {
		minutes = Math.floor(maxtime / 60);
		seconds = Math.floor(maxtime % 60);
		$("#minute").text("Worktime " + minutes);
		$("#second").text(seconds);
		storage.setItem("busetime", bmtonstart - maxtime);
		storage.setItem("bminute", minutes);
		storage.setItem("bsecond", seconds);
		if (maxtime == 5 * 60) {
			if (window.Notification) {
				const notify3 = new Notification("5 minutes left for working");
			}
			alert("5 minutes left for working");
		}
		--maxtime;
	} else {
		player.play();
		clearInterval(btimer);
		if (window.Notification) {
			const notify4 = new Notification("Worktime is up. Now let us have a break!");
		}
		alert("Worktime is up. Now let us have a break!");
		storage.setItem("busetime", null);
		maxtime = $("#breaktime").val() * 60;
		if (!/^\d+$/.test(maxtime)) {
			maxtime = 17 * 60;
		}
		btimer = setInterval("breakCountDown()", 1000);
	}
}

function breakCountDown() {
	if (maxtime >= 0) {
		minutes = Math.floor(maxtime / 60);
		seconds = Math.floor(maxtime % 60);
		$("#minute").text("Breaktime " + minutes);
		$("#second").text(seconds);
		--maxtime;
	} else {
		player.play();
		clearInterval(btimer);
		$("#starty").show();
		$("#inputy").show();
		if (window.Notification) {
			const notify5 = new Notification("Now it is time for working.");
		}
		alert("Now it is time for working.");
	}
}
