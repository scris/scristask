var currentUser = AV.User.current();
if (currentUser) {
	$("#haventloggedin").hide();
	$("#loggedin").show();
	var avtask = AV.Object.extend('task');
	var avnote = AV.Object.extend('note');
	setTimeout(function(){
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
	},800);
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
	$("#loadingbar").hide();
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

$("#logouttoggle").click(function () {
	AV.User.logOut();
	document.location.reload();
});


var deleter = function (record) {

};

if (window.Notification) {
	Notification.requestPermission(function (permission) {

	});
}
//tasks
var state = [];

function setDefaultState() {
	var baseState = {};
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
	if((text.indexOf('[longterm]') >= 0) || (text.indexOf('[plan]') >= 0) || (text.indexOf('[routine]') >= 0))
	{
		var item = '<li data-id="' + id + '" class="animated flipInX ' + c + '" id="item' + id + '"><div class="checkbox"><span class="close"><i class="fa fa-times"></i></span><label class="itemlabel">' + text + "</label></div></li>";
	}
	else
	{
		var item = '<li data-id="' + id + '" class="animated flipInX ' + c + '" id="item' + id + '"><div class="checkbox"><span class="close"><i class="fa fa-times"></i></span><label class="itemlabel"><span class="checkbox-mask"></span><input type="checkbox" />' + text + "</label></div></li>";
	}

	var isError = $(".form-control").hasClass("hidden");

	if (text === "") {
		$(".err").removeClass("hidden").addClass("animated bounceIn");
	} else {
		$(".err").addClass("hidden");
		$(".todo-list").append(item);
	}

	$(".refresh").removeClass("hidden");

	$(".no-items").addClass("hidden");

	if((text.indexOf('[easy]') >= 0))
	{
		$("item" + id).find(".itemlabel").addClass("labeleasy");
	}
	
	if((text.indexOf('[try]') >= 0))
	{
		$("item" + id).find(".itemlabel").addClass("labeltry");
	}
	
	if((text.indexOf('[must]') >= 0))
	{
		$("item" + id).find(".itemlabel").addClass("labelmust");
	}
	
	setTimeout(function () {
			$(".todo-list li").removeClass("animated flipInX");
	},500);

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
	var queryday = new AV.Query('task');
	queryday.equalTo('owner', AV.User.current());
	queryday.equalTo('day', newDay);
	var querylongterm = new AV.Query('task');
	querylongterm.equalTo('owner', AV.User.current());
	querylongterm.equalTo('islongterm',true);
	var query = new AV.Query('task');
	query = AV.Query.or(queryday,querylongterm);
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
			todoFolder.set('day', newDay);
			if((itemVal.indexOf('[longterm]') >= 0) || (itemVal.indexOf('[plan]') >= 0) || (itemVal.indexOf('[routine]') >= 0))
			{
				todoFolder.set('islongterm',true);
			}
			todoFolder.save().then(function (todo) {
				addItem(itemVal, false, todo.id, true);
			}, function (error) {
				alert(JSON.stringify(error));
			});
			//formControl.focus();
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


});

//loadr
if (currentUser) {
	loadr();
	$("#loadingbar").hide();
}
