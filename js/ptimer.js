$(document).ready(function(){
    var ptime = $("#ptime");
    var pstart = $("#pstart");
    var preset = $("#preset");
    var pminute = $("#pminute");
    var psecond = $("#psecond");

    var ptimer;

    ptime.bind("input", function(event){
        if(!/^\d+$/.test(ptime.val())){
            ptime.val("");
            ptime.attr("placeholder", "Illegal Input!");
        }
    });
    pstart.bind("click", function(){
        clearInterval(ptimer);

        if(ptime.val()){
            pminute.text(setNum(ptime.val()));
        }else{
            pminute.text("52");
        }

        psecond.text("00");

        ptimer = setInterval(function(){
            if(psecond.text() == "00" && pminute.text() != "00"){
                psecond.text("59");
                pminute.text(setNum(pminute.text() - 1));
            }else if(psecond.text() == "00" && pminute.text() == "00"){
                clearInterval(ptimer);
             	$("#finishsound").play();
            }else if(psecond.text() != "00"){
                psecond.text(setNum(psecond.text() - 1));
            }
        }, 1000);
    });
    preset.bind("click", function(){
        clearInterval(ptimer);
        pminute.text("52");
        psecond.text("00");
    });
});

function setNum(num){
    if(num < 10){
        return "0" + num;
    }else{
        return num;
    }
}