//airtable
			var Airtable = require('airtable');
			var base = new Airtable({
				apiKey: storage.getItem("scristaskapi")
			}).base(storage.getItem("scristaskbase"));

			var deleter = function(record) {
				record.destroy(function(err) {
					if (err) {
						console.log('Error destroying ', recordId, err);
					} else {
						console.log('Destroyed ', record.getId());
						$('div[data-record-id="' + record.getId() + '"]').remove();
					}
				});
			};

			var loadr = function() {

				base('Scris Task').select({
					view: "Selected"
				}).eachPage(function page(records, fetchNextPage) {
					records.forEach(function(record) {
						console.log('Retrieved ', record.get('taskname'));
						addItem(record.get('taskname'), record.get('isfinished'), record.getId(), true);
					});

					fetchNextPage();
				},
				function done(error) {
					console.log(error);
				});
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
				var id = id ? id: generateID();
				var c = (status === "done" || status === true) ? "danger": "";
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

				setTimeout(function() {
					$(".todo-list li").removeClass("animated flipInX");
				},
				500);

				if (!noUpdate) {
					pushToState(text, "new", id);
				}
			}

			function refresh() {
				$(".todo-list li").each(function(i) {
					$(this).delay(70 * i).queue(function() {
						$(this).addClass("animated bounceOutLeft");
						$(this).dequeue();
					});
				});

				setTimeout(function() {
					$(".todo-list li").remove();
					$(".no-items").removeClass("hidden");
					$(".err").addClass("hidden");
				},
				800);
			}

			$(function() {
				var err = $(".err"),
				formControl = $(".form-control"),
				isError = formControl.hasClass("hidden");

				if (!isError) {
					formControl.blur(function() {
						err.addClass("hidden");
					});
				}

				$(".add-btn").on("click",
				function() {
					var itemVal = $(".form-control").val();
					base('Scris Task').create({
						"taskname": itemVal,
					},
					function(err, record) {
						if (err) {
							console.log(err);
							return;
						}
						addItem(itemVal, record.get('isfinished'), record.getId(), true);
					});
					formControl.focus();
				});

				$(".refresh").on("click", refresh);
				
				var finishornot = false;
				var fornot = false;
				
				$(".todo-list").on("click", 'input[type="checkbox"]',
				function() {
					var li = $(this).parent().parent().parent();
					li.toggleClass("danger");
					li.toggleClass("animated flipInX");
					base('Scris Task').find(li.data().id, function(err, record) {
    					if (err) { console.error(err); return; }
    					finishornot = record.get('isfinished');
						fornot = ((finishornot == true) ? false : true);
						base('Scris Task').update(li.data().id, {
							"isfinished": fornot
						}, function(err, record1) {
							if (err) { console.error(err); return; }
							console.log(record1.get('isfinished'));
						});
					});
					setToDone(li.data().id);
					setTimeout(function() {
						li.removeClass("animated flipInX");
					},
					500);
				});

				$(".todo-list").on("click", ".close",
				function() {
					var box = $(this).parent().parent();
					base('Scris Task').destroy(box.data().id, function(err, deletedRecord) {
    					if (err) { console.error(err); return; }
						console.log('Deleted record', deletedRecord.id);
					});
					if ($(".todo-list li").length == 1) {
						box.removeClass("animated flipInX").addClass("animated bounceOutLeft");
						setTimeout(function() {
							box.remove();
							$(".no-items").removeClass("hidden");
							$(".refresh").addClass("hidden");
						},
						500);
					} else {
						box.removeClass("animated flipInX").addClass("animated bounceOutLeft");
						setTimeout(function() {
							box.remove();
						},
						500);
					}

					deleteTodo(box.data().id)
				});

				$(".form-control").keypress(function(e) {
					if (e.which == 13) {
						var itemVal = $(".form-control").val();
						base('Scris Task').create({
							"taskname": itemVal,
						},
						function(err, record) {
							if (err) {
								console.log(err);
								return;
							}
							addItem(itemVal, record.get('isfinished'), record.getId(), true);
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

			var randomWordArray = Array("Wow, it's ", "Hey there, it's ", "Happy ", "It's currently ", "Awesome, it's ", "Have a nice ", "Happy splendid ", "Enjoy your ", "What a good day, it's");

			var randomWord = randomWordArray[Math.floor(Math.random() * randomWordArray.length)];

			todayContainer.innerHTML = randomWord + n;

			$(document).ready(function() {
				var state = getState();

				if (!state) {
					setDefaultState();
					state = getState();
				}

				Object.keys(state).forEach(function(todoKey) {
					var todo = state[todoKey];
					addItem(todo.title, todo.status, todo.id, true);
				});

				var mins, secs, update;

				init();
				function init() { (mins = 25),
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
					$(".secs").text(secs); --secs;
					if (mins == 0 && secs < 0) {
						reset();
					} else if (secs < 0 && mins > 0) {
						secs = 59; --mins;
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
			
			
			//run loadr
			loadr();
			