$(document).ready(function(){
    var time = $("#ptime");
    var start = $("#pstart");
    var reset = $("#preset");
    var minute = $("#pminute");
    var second = $("#psecond");

    var timer;

    time.bind("input", function(event){
        if(!/^\d+$/.test(time.val())){
            time.val("");
            time.attr("placeholder", "Illegal Input!");
        }
    });
    start.bind("click", function(){
        clearInterval(timer);

        if(time.val()){
            minute.text(setNum(time.val()));
        }else{
            minute.text("52");
        }

        second.text("00");

        timer = setInterval(function(){
            if(second.text() == "00" && minute.text() != "00"){
                second.text("59");
                minute.text(setNum(minute.text() - 1));
            }else if(second.text() == "00" && minute.text() == "00"){
                clearInterval(timer);
             	$("#finishsound").play();
            }else if(second.text() != "00"){
                second.text(setNum(second.text() - 1));
            }
        }, 1000);
    });
    reset.bind("click", function(){
        clearInterval(timer);
        minute.text("52");
        second.text("00");
    });
});

function setNum(num){
    if(num < 10){
        return "0" + num;
    }else{
        return num;
    }
}