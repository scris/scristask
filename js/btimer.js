$("#start").click(function(){
    maxtime=$("#worktime").val;
    if(!/^\d+$/.test(pmaxtimer))
    {
            maxtimer = 52 * 60;
    }
    timer = setInterval("workCountDown()", 1000);      
});
            function workCountDown() {
                if (maxtime >= 0) {
                    minutes = Math.floor(maxtime / 60);
                    seconds = Math.floor(maxtime % 60);
                    $("minute").val = "Worktime" +minutes;
                    $("second").val = seconds;
                    if (maxtime == 5 * 60) alert("5 minutes left for working");
                        --maxtime;
                } else{
                    $("finishsound").play();
                    clearInterval(timer);
                    alert("Worktime is up. Now let us have a break!☺️");
                    
                }
            }
            function breakCountDown() {
                if (maxtime >= 0) {
                    minutes = Math.floor(maxtime / 60);
                    seconds = Math.floor(maxtime % 60);
                    $("minute").val = "Breaktime" + minutes;
                    $("second").val = seconds;
                    --maxtime;
                } else{
                    $("finishsound").play();
                    clearInterval(timer);
                    alert("Now it is time for working.👍");
                    timer = setInterval("breakCountDown()", 1000);  
                }
            }
            