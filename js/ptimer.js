$("#pstart").click(function(){
    pmaxtime=$("#ptime").val;
    if(!/^\d+$/.test(pmaxtime))
    {
            pmaxtime = 52 * 60;
    }
    ptimer = setInterval("CountDown()", 1000);      
});
            function CountDown() {
                if (pmaxtime >= 0) {
                    pminutes = Math.floor(pmaxtime / 60);
                    pseconds = Math.floor(pmaxtime % 60);
                    $("#pminute").val(pminutes);
                    $("#psecond").val(pseconds);
                    if (pmaxtime == 5 * 60) alert("5 minutes left");
                        --pmaxtime;
                } else{
                    $("#finishsound").play();
                    clearInterval(ptimer);
                    alert("Time is up.");
                }
            }
            
