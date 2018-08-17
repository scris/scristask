			'use strict';
			//ptimer clock
			var pclock = document.querySelector('.pclock');

			//a function to clear selections caused by double clicking on the clock (makes for better UX)
			function pclearSelection() {
				if (document.selection) {
					document.selection.empty();
				} else if (window.getSelection) {
					window.getSelection().removeAllRanges();
				}
			}

			//configures the clock - bound to the .clock element
			(function pClock() {
				//colors
				var c5 = '#131313';

				//List of timers you want, they will display and execute in this order.
				var psetterArr = [{
					label: 'Projcet',
					color: c5,
					default: 60
				}];

				//Clock Variables
				var pcanvas = this.querySelector('.ppie');
				var pctx = pcanvas.getContext('2d');
				var psetters = this.querySelector('.psetters');
				var poriginalSetter = psetters.removeChild(psetters.querySelector('.psetter'));

				//Constructor for copying and displaying the originalSetter - call through makeSetter(item) - Note this is a private function
				function pmakeSetter(item) {
					var psetter = poriginalSetter.cloneNode(true);
					var pindicator = psetter.querySelector('.pindicator');
					var pslider = psetter.querySelector('.pslider');

					psetter.className += ' ' + item.label;
					pslider.value = pindicator.innerText = item.default;
					psetter.querySelector('.plabely').innerText = item.label;

					psetters.appendChild(psetter);

					pslider.addEventListener('input', function () {
						pindicator.innerText = this.value;
					});

					return psetter;
				} //END makeSetter

				//Function to draw the time remaining indicator pie - should be called at every update
				function pdrawPie(color, percent) {

					var ppie = new Path2D();
					ppie.arc(pcanvas.height / 2,pcanvas.width / 2, pcanvas.width / 2, 0, Math.PI * 2 * percent);
					ppie.lineTo(pcanvas.height / 2, pcanvas.width / 2);

					pctx.clearRect(0, 0, pcanvas.width, pcanvas.height);
					pctx.fillStyle = color;
					pctx.fill(ppie);
				}

				//constructs the setters and adds them as objects to the clock object
				(function pconstructor() {

					psetterArr.forEach(function (item) {
						pclock[item.label] = pmakeSetter(item);
					}); //END setterArr.forEach

					pdrawPie(c5, 1);
				})(); //END constructor


				this.ptimer = function () {

					var ptimer = this;
					var ptimeRemaining = 0;
					var ptimeTotal = 0;
					var pon = false;
					var ptimerReset = true;
					var ptimerInt;
					var ptimerIndex = 0;
					this.dblclick = false;

					//updates the minutes and seconds in the .time element
					function pshowTime() {
						var minutes = Math.floor(ptimeRemaining / 60);
						var seconds = ptimeRemaining - minutes * 60;

						ptimer.querySelector('.ptime').innerText = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
					} //END showTime

					//displays and alert for the current timer
					function pshowAlert() {
						window.alert(psetterArr[ptimerIndex].label + ' is DONE!');
					} //END showAlert

					//sets the initial value for all elements and objects in order to start the current timer, also displays border around current slider
					function pinitiateTimer() {
						if (psetterArr[ptimerIndex] === undefined) {
							ptimer.preset();
							return;
						} //END if undefined

						ptimeTotal = ptimeRemaining = psetters.querySelector('.' + psetterArr[ptimerIndex].label + '>.pslider').value * 60;

						psetters.querySelectorAll('.psetter').forEach(function (el) {
							el.setAttribute('style', 'border-color:transparent;');
						});
						psetters.querySelector('.' + psetterArr[ptimerIndex].label).setAttribute('style', 'border-color:' + psetterArr[ptimerIndex].color + ';');

						pshowTime();
						pdrawPie(psetterArr[ptimerIndex].color, 100);
					} // END initiateTimer

					//sets the countdown interval, calls showTime() and drawPie(), when current timer is complete calls showAlert(), timerIndex++ and initiateTimer(),and fades out the .sliders
					this.pstart = function () {
						if (ptimerReset) {
							pinitiateTimer();
							ptimerReset = false;
						}

						ptimerInt = setInterval(function () {
							ptimeRemaining--;
							pshowTime();
							pdrawPie(psetterArr[ptimerIndex].color, ptimeRemaining / ptimeTotal);

							if (ptimeRemaining === 0) {
								pshowAlert();
								ptimerIndex++;
								pinitiateTimer();
							}
						}, 1000);

						ptimer.querySelector('.pstate').innerText = '';

						pon = true;

						$('.pslider').animate({
							width: 'hide',
							opacity: 'hide'
						}, 500);

						pclearSelection();
					};

					//pauses the timer adds paused text
					this.ppause = function () {

						if (ptimeRemaining !== ptimeTotal) {

							pon = false;
							clearInterval(ptimerInt);
							ptimer.querySelector('.pstate').innerText = '- Paused -';
						}

						pclearSelection();
					};

					//clears the timer interval, triggers reset, fades in the .slider's, resets the pie, updates state text, clears the .slider borders
					this.preset = function () {

						if (ptimeRemaining !== ptimeTotal) {

							clearInterval(ptimerInt);
							ptimerReset = true;
							pon = false;
							ptimerIndex = 0;

							$('.pslider').animate({
								width: 'show',
								opacity: 'show'
							}, 500);

							pdrawPie(c5, 100);

							ptimer.querySelector('.ptime').innerText = 'Ready';

							psetters.querySelectorAll('.psetter').forEach(function (el) {
								el.setAttribute('style', 'border-color:transparent;');
							});

							this.querySelector('.pstate').innerText = '';

							pclearSelection();
						}
					};

					//registers click event for timer, decides if action should be start, pause or reset
					this.addEventListener('click', function () {
						if (ptimer.dblclick) {
							ptimer.preset();
							return;
						}
						ptimer.dblclick = true;
						window.setTimeout(function () {
							ptimer.dblclick = false;
						}, 250);
						if (pon) {
							ptimer.ppause();
						} else {
							ptimer.pstart();
						}
					}); //END addEvent click

					return this;
				}.call(pclock.querySelector('.ptimer')); //Auto executes and binds the timer object to the .timer element

			}).call(pclock); //Auto executes and binds clock object to the clock element// JavaScript Document