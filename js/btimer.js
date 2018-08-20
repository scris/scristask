var storage = window.localStorage;
var player = $("#finishsound")[0];
var mtonstart;
$("#starty").click(function () {
	maxtime = $("#worktime").val() * 60;
	if (!/^\d+$/.test(maxtime)) {
		maxtime = 52 * 60;
	}
	mtonstart = maxtime;
	maxtime -= storage.getItem("busetime");
	player.load();
	btimer = setInterval("workCountDown()", 1000);
});

function workCountDown() {
	if (maxtime >= 0) {
		minutes = Math.floor(maxtime / 60);
		seconds = Math.floor(maxtime % 60);
		$("#minute").text("Worktime " + minutes);
		$("#second").text(seconds);
		storage.setItem("busetime", mtonstart - maxtime);
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
		storage.setItem("busetime", 0);
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
		if (window.Notification) {
			const notify5 = new Notification("Now it is time for working.");
		}
		alert("Now it is time for working.");
	}
}
