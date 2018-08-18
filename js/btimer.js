$("#starty").click(function(){
    maxtime=$("#worktime").val;
    if(!/^\d+$/.test(maxtime))
    {
            maxtime = 52 * 60;
    }
    btimer = setInterval("workCountDown()", 1000);      
});
            function workCountDown() {
                if (maxtime >= 0) {
                    minutes = Math.floor(maxtime / 60);
                    seconds = Math.floor(maxtime % 60);
                    $("#minute").val("Worktime" +minutes);
                    $("#second").val(seconds);
                    if (maxtime == 5 * 60) alert("5 minutes left for working");
                        --maxtime;
                } else{
                    $("#finishsound").play();
                    clearInterval(btimer);
                    alert("Worktime is up. Now let us have a break!☺️");
                    btimer = setInterval("breakCountDown()", 1000);  
                }
            }
            function breakCountDown() {
                if (maxtime >= 0) {
                    minutes = Math.floor(maxtime / 60);
                    seconds = Math.floor(maxtime % 60);
                    $("#minute").val("Breaktime" + minutes);
                    $("#second").val(seconds);
                    --maxtime;
                } else{
                    $("#finishsound").play();
                    clearInterval(btimer);
                    alert("Now it is time for working.👍");
                }
            }
            