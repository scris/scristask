$("#pstart").click(function(){
    pmaxtime=$("#ptime").val() * 60;
    if(!/^\d+$/.test(pmaxtime))
    {
            pmaxtime = 52 * 60;
    }
    $("#ppause").show(1500);
    ptimer = setInterval("CountDown()", 1000);      
});
$("#ppause").click(function(){
    if($("#ppause").val() == "Pause") pausyFunction();     
    else resumyFunction();
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
                    $("#ppause").hide(1500);
                }
            }
            function pausyFunction()
            {
                $("#ppause").val("Reusme");
                clearInterval(ptimer);
            }
            function resumyFunction()
            {
                $("#ppause").val("Pause");
                ptimer = setInterval("CountDown()", 1000);
            }
