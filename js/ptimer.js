$("#pstart").click(function(){
    pmaxtime=$("#ptime").val() * 60;
    if(!/^\d+$/.test(pmaxtime))
    {
            pmaxtime = 52 * 60;
    }
    ptimer = setInterval("CountDown()", 1000);      
});
var pplayer = $("#finishsound")[0];
            function CountDown() {
                if (pmaxtime >= 0) {
                    pminutes = Math.floor(pmaxtime / 60);
                    pseconds = Math.floor(pmaxtime % 60);
                    $("#pminute").text(pminutes);
                    $("#psecond").text(pseconds);
                    if (pmaxtime == 5 * 60) alert("5 minutes left");
                        --pmaxtime;
                } else{
                    pplayer.play();
                    clearInterval(ptimer);
                    alert("Time is up.");
                }
            }
            
