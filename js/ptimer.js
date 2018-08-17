$("#pstart").click(function(){
    pmaxtime=$("#ptime").val;
    ptimer = setInterval("CountDown()", 1000);      
});
            function CountDown() {
                if (maxtime >= 0) {
                    pminutes = Math.floor(maxtime / 60);
                    pseconds = Math.floor(maxtime % 60);
                    $("pminute").val = pminutes;
                    $("psecond").val = pseconds;
                    if (maxtime == 5 * 60) alert("5 minutes left");
                        --maxtime;
                } else{
                    $("finishsound").play();
                    clearInterval(ptimer);
                    alert("Time is up.");
                }
            }
            