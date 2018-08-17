			'use strict';
			//btimer clock
			var clock = document.querySelector('.clock');

			//a function to clear selections caused by double clicking on the clock (makes for better UX)
			function clearSelection() {
				if (document.selection) {
					document.selection.empty();
				} else if (window.getSelection) {
					window.getSelection().removeAllRanges();
				}
			}

			//configures the clock - bound to the .clock element
			(function Clock() {
				//colors
				var c3 = '#131313';
				var c4 = '#cecece';

				//List of timers you want, they will display and execute in this order.
				var setterArr = [{
					label: 'Work',
					color: c3,
					default: 52
				}, {
					label: 'Break',
					color: c4,
					default: 17
				}];

				//Clock Variables
				var canvas = this.querySelector('.pie');
				var ctx = canvas.getContext('2d');
				var setters = this.querySelector('.setters');
				var originalSetter = setters.removeChild(setters.querySelector('.setter'));

				//Constructor for copying and displaying the originalSetter - call through makeSetter(item) - Note this is a private function
				function makeSetter(item) {
					var setter = originalSetter.cloneNode(true);
					var indicator = setter.querySelector('.indicator');
					var slider = setter.querySelector('.slider');

					setter.className += ' ' + item.label;
					slider.value = indicator.innerText = item.default;
					setter.querySelector('.labely').innerText = item.label;

					setters.appendChild(setter);

					slider.addEventListener('input', function () {
						indicator.innerText = this.value;
					});

					return setter;
				} //END makeSetter

				//Function to draw the time remaining indicator pie - should be called at every update
				function drawPie(color, percent) {

					var pie = new Path2D();
					pie.arc(canvas.height / 2, canvas.width / 2, canvas.width / 2, 0, Math.PI * 2 * percent);
					pie.lineTo(canvas.height / 2, canvas.width / 2);

					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.fillStyle = color;
					ctx.fill(pie);
				}

				//constructs the setters and adds them as objects to the clock object
				(function constructor() {

					setterArr.forEach(function (item) {
						clock[item.label] = makeSetter(item);
					}); //END setterArr.forEach

					drawPie(c3, 1);
				})(); //END constructor


				this.timer = function () {

					var timer = this;
					var timeRemaining = 0;
					var timeTotal = 0;
					var on = false;
					var timerReset = true;
					var timerInt;
					var timerIndex = 0;
					this.dblclick = false;

					//updates the minutes and seconds in the .time element
					function showTime() {
						var minutes = Math.floor(timeRemaining / 60);
						var seconds = timeRemaining - minutes * 60;

						timer.querySelector('.time').innerText = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
					} //END showTime

					//displays and alert for the current timer
					function showAlert() {
						window.alert(setterArr[timerIndex].label + ' is DONE!');
					} //END showAlert

					//sets the initial value for all elements and objects in order to start the current timer, also displays border around current slider
					function initiateTimer() {
						if (setterArr[timerIndex] === undefined) {
							timer.reset();
							return;
						} //END if undefined

						timeTotal = timeRemaining = setters.querySelector('.' + setterArr[timerIndex].label + '>.slider').value * 60;

						setters.querySelectorAll('.setter').forEach(function (el) {
							el.setAttribute('style', 'border-color:transparent;');
						});
						setters.querySelector('.' + setterArr[timerIndex].label).setAttribute('style', 'border-color:' + setterArr[timerIndex].color + ';');

						showTime();
						drawPie(setterArr[timerIndex].color, 100);
					} // END initiateTimer

					//sets the countdown interval, calls showTime() and drawPie(), when current timer is complete calls showAlert(), timerIndex++ and initiateTimer(),and fades out the .sliders
					this.start = function () {
						if (timerReset) {
							initiateTimer();
							timerReset = false;
						}

						timerInt = setInterval(function () {
							timeRemaining--;
							showTime();
							drawPie(setterArr[timerIndex].color, timeRemaining / timeTotal);

							if (timeRemaining === 0) {
								showAlert();
								timerIndex++;
								initiateTimer();
							}
						}, 1000);

						timer.querySelector('.state').innerText = '';

						on = true;

						$('.slider').animate({
							width: 'hide',
							opacity: 'hide'
						}, 500);

						clearSelection();
					};

					//pauses the timer adds paused text
					this.pause = function () {

						if (timeRemaining !== timeTotal) {

							on = false;
							clearInterval(timerInt);
							timer.querySelector('.state').innerText = '- Paused -';
						}

						clearSelection();
					};

					//clears the timer interval, triggers reset, fades in the .slider's, resets the pie, updates state text, clears the .slider borders
					this.reset = function () {

						if (timeRemaining !== timeTotal) {

							clearInterval(timerInt);
							timerReset = true;
							on = false;
							timerIndex = 0;

							$('.slider').animate({
								width: 'show',
								opacity: 'show'
							}, 500);

							drawPie(c3, 100);

							timer.querySelector('.time').innerText = 'Ready';

							setters.querySelectorAll('.setter').forEach(function (el) {
								el.setAttribute('style', 'border-color:transparent;');
							});

							this.querySelector('.state').innerText = '';

							clearSelection();
						}
					};

					//registers click event for timer, decides if action should be start, pause or reset
					this.addEventListener('click', function () {
						if (timer.dblclick) {
							timer.reset();
							return;
						}
						timer.dblclick = true;
						window.setTimeout(function () {
							timer.dblclick = false;
						}, 250);
						if (on) {
							timer.pause();
						} else {
							timer.start();
						}
					}); //END addEvent click

					return this;
				}.call(clock.querySelector('.timer')); //Auto executes and binds the timer object to the .timer element

			}).call(clock); //Auto executes and binds clock object to the clock element// JavaScript Document