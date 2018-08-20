//leancloud-av
var APP_ID = 'C7SVWNehvavYoUH5cssIKYDH-MdYXbMMI';
var APP_KEY = 'nJ2QMhw8deT5QwNt40rjsaK7';
AV.init({
	appId: APP_ID,
	appKey: APP_KEY,
	region: 'us'
});
var currentUser = AV.User.current();
if (currentUser) {
	$("#haventloggedin").hide();
	$("#loggedin").show();
	var avtask = AV.Object.extend('task');
	var avnote = AV.Object.extend('note');
	var query = new AV.Query('note');
	query.equalTo('owner', AV.User.current());
	query.first().then(function (data) {
		$("#notearea").val(data.get("notecontent"));
		$("#noteid").val(data.id);
	}, function (error) {
		alert(JSON.stringify(error));
	});
	$('#notearea').change(function () {
		var content = $("#notearea").val();
		var noteid = $("#noteid").val();
		var avnote = AV.Object.createWithoutData('note', noteid);
		avnote.set('notecontent', content);
		avnote.save();
	});
} else {
	$("#login").show();
	$("#haventloggedin").show();
	$("#loggedin").hide();
	$("#taskmain").hide();
	$("#btimer").hide();
	$("#ptimer").hide();
	$("#note").hide();
	$("#blankb").hide();
	$("#blankp").hide();
	$("#blankn").hide();
}
//login
$("#loginbtn").click(function () {
	var avuuser = $("#in1").val();
	var avupwd = $("#in2").val();
	AV.User.logIn(avuuser, avupwd).then(function (loginedUser) {
		document.location.reload();
	}, function (error) {
		alert(JSON.stringify(error));
	});
});

$("#loggouttoggle").click(function () {
	V.User.logOut();
	document.location.reload();
});


var deleter = function (record) {

};


//tasks
var state = [];

function setDefaultState() {
	var id = generateID();
	var baseState = {};
	baseState[id] = {
		status: "new",
		id: id,
		title: "This site uses LocalStorage to keep track of your tasks"
	};
	syncState(baseState);
}

function generateID() {
	var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
	return randLetter + Date.now();
}

function pushToState(title, status, id) {
	var baseState = getState();
	baseState[id] = {
		id: id,
		title: title,
		status: status
	};
	syncState(baseState);
}

function setToDone(id) {
	var baseState = getState();
	if (baseState[id].status === 'new') {
		baseState[id].status = 'done'
	} else {
		baseState[id].status = 'new';
	}

	syncState(baseState);
}

function deleteTodo(id) {
	console.log(id)
	var baseState = getState();
	delete baseState[id]
	syncState(baseState)
}

function resetState() {
	localStorage.setItem("state", null);
}

function syncState(state) {
	localStorage.setItem("state", JSON.stringify(state));
}

function getState() {
	return JSON.parse(localStorage.getItem("state"));
}

function addItem(text, status, id, noUpdate) {
	var id = id ? id : generateID();
	var c = (status === "done" || status === true) ? "danger" : "";
	var item = '<li data-id="' + id + '" class="animated flipInX ' + c + '"><div class="checkbox"><span class="close"><i class="fa fa-times"></i></span><label><span class="checkbox-mask"></span><input type="checkbox" />' + text + "</label></div></li>";

	var isError = $(".form-control").hasClass("hidden");

	if (text === "") {
		$(".err").removeClass("hidden").addClass("animated bounceIn");
	} else {
		$(".err").addClass("hidden");
		$(".todo-list").append(item);
	}

	$(".refresh").removeClass("hidden");

	$(".no-items").addClass("hidden");

	setTimeout(function () {
			$(".todo-list li").removeClass("animated flipInX");
		},
		500);

	if (!noUpdate) {
		pushToState(text, "new", id);
	}
}

function addeach(item, index) {
	addItem(item.get("taskname"), item.get("isfinished"), item.id, true);
}

var loadr = function () {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	var newDay = year + "-" + month + "-" + day;
	var query = new AV.Query('task');
	query.equalTo('owner', AV.User.current());
	query.equalTo('day', newDay);
	query.find().then(function (results) {
		results.forEach(addeach);
	}, function (error) {
		alert(JSON.stringify(error));
	});
};


function refresh() {
	$(".todo-list li").each(function (i) {
		$(this).delay(70 * i).queue(function () {
			$(this).addClass("animated bounceOutLeft");
			$(this).dequeue();
		});
	});

	setTimeout(function () {
			$(".todo-list li").remove();
			$(".no-items").removeClass("hidden");
			$(".err").addClass("hidden");
		},
		800);
}

$(function () {
	var err = $(".err"),
		formControl = $(".form-control"),
		isError = formControl.hasClass("hidden");

	if (!isError) {
		formControl.blur(function () {
			err.addClass("hidden");
		});
	}

	$(".add-btn").on("click",
		function () {
			var itemVal = $(".form-control").val();
			var todoFolder = new avtask();
			todoFolder.set('taskname', itemVal);
			todoFolder.set('isfinished', false);
			todoFolder.set('owner', AV.User.current());
			var myDate = new Date();
			var year = myDate.getFullYear();
			var month = myDate.getMonth() + 1;
			var day = myDate.getDate();
			var newDay = year + "-" + month + "-" + day;
			todoFolder.set('day', newDay)
			todoFolder.save().then(function (todo) {
				addItem(itemVal, false, todo.id, true);
			}, function (error) {
				alert(JSON.stringify(error));
			});
			formControl.focus();
			$(".form-control").val("");
		});

	$(".refresh").on("click", refresh);


	$(".todo-list").on("click", 'input[type="checkbox"]',
		function () {
			var li = $(this).parent().parent().parent();
			li.toggleClass("danger");
			li.toggleClass("animated flipInX");
			var query = new AV.Query('task');
			query.get(li.data().id).then(function (todo) {
				todo.set("isfinished", !todo.get("isfinished"));
				todo.save();
				setToDone(li.data().id);
				setTimeout(function () {
						li.removeClass("animated flipInX");
					},
					500);
			}, function (error) {
				alert(JSON.stringify(error));
			});

		});

	$(".todo-list").on("click", ".close",
		function () {
			var box = $(this).parent().parent();
			var todo = AV.Object.createWithoutData('task', box.data().id);
			todo.destroy().then(function (success) {
				if ($(".todo-list li").length == 1) {
					box.removeClass("animated flipInX").addClass("animated bounceOutLeft");
					setTimeout(function () {
							box.remove();
							$(".no-items").removeClass("hidden");
							$(".refresh").addClass("hidden");
						},
						500);
				} else {
					box.removeClass("animated flipInX").addClass("animated bounceOutLeft");
					setTimeout(function () {
							box.remove();
						},
						500);
				}

				deleteTodo(box.data().id)
			}, function (error) {
				alert(JSON.stringify(error));
			});

		});

	$(".form-control").keypress(function (e) {
		if (e.which == 13) {
			var itemVal = $(".form-control").val();
			var todoFolder = new avtask();
			todoFolder.set('taskname', itemVal);
			todoFolder.set('isfinished', false);
			todoFolder.save().then(function (todo) {
				addItem(itemVal, false, todo.id, true);
			}, function (error) {
				console.error(error);
			});
		}
	});
	//$(".todo-list").sortable();
	//$(".todo-list").disableSelection();
});

var todayContainer = document.querySelector(".today");

var d = new Date();

var weekday = new Array(7);
weekday[0] = "Sunday 😊";
weekday[1] = "Monday 😎";
weekday[2] = "Tuesday 😀";
weekday[3] = "Wednesday 😏";
weekday[4] = "Thursday 😙";
weekday[5] = "Friday 😜";
weekday[6] = "Saturday 😇";

var n = weekday[d.getDay()];

var randomWordArray = Array("Wow, it's ", "Hey there, it's ", "Happy ", "It's currently ", "Awesome, it's ", "Have a nice ", "Happy splendid ", "Enjoy your ", "What a good day, it's ");

var randomWord = randomWordArray[Math.floor(Math.random() * randomWordArray.length)];

todayContainer.innerHTML = randomWord + n;

$(document).ready(function () {
	var state = getState();

	if (!state) {
		setDefaultState();
		state = getState();
	}

	Object.keys(state).forEach(function (todoKey) {
		var todo = state[todoKey];
		addItem(todo.title, todo.status, todo.id, true);
	});

	var mins, secs, update;

	init();

	function init() {
		(mins = 25),
		(secs = 59);
	}

	set();

	function set() {
		$(".mins").text(mins);
	}

	$("#start").on("click", start_timer);
	$("#reset").on("click", reset);
	$("#inc").on("click", inc);
	$("#dec").on("click", dec);

	function start_timer() {

		set();

		$(".dis").attr("disabled", true);

		$(".mins").text(--mins);
		$(".separator").text(":");
		update_timer();

		update = setInterval(update_timer, 1000);
	}

	function update_timer() {
		$(".secs").text(secs);
		--secs;
		if (mins == 0 && secs < 0) {
			reset();
		} else if (secs < 0 && mins > 0) {
			secs = 59;
			--mins;
			$(".mins").text(mins);
		}
	}

	function reset() {
		clearInterval(update);
		$(".secs").text("");
		$(".separator").text("");
		init();
		$(".mins").text(mins);
		$(".dis").attr("disabled", false);
	}

	function inc() {
		mins++;
		$(".mins").text(mins);
	}

	function dec() {
		if (mins > 1) {
			mins--;
			$(".mins").text(mins);
		} else {
			alert("This is the minimum limit.");
		}
	}
});

//loadr
if (currentUser) {
	loadr();
}