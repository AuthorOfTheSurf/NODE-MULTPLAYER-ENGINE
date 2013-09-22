// Clock interval counter ====================================================
function clock(){
    totalSeconds = 0;
    
     $('#clock').prepend('<div id="clock"><label id="minutes">00</label>:<label id="seconds">00</label></div>');

        timerCount = setInterval(setTime, 1000);
        function setTime()
        {
            ++totalSeconds;
            $('#clock > #seconds').html(pad(totalSeconds%60));
            $('#clock > #minutes').html(pad(parseInt(totalSeconds/60)));
        }
        function pad(val)
        {
            var valString = val + "";
            if(valString.length < 2)
            {
                return "0" + valString;
            }
            else
            {
                return valString;
            }
        }
}


function countdown(){
    var countdownDiv = document.getElementById("count_num");
    var timer = setInterval(function(){
    $("#count_num").html(function(i,html){
       
    if(parseInt(html)>1)
       {
       return parseInt(html)-1;
       }
       else
       {
         clearTimeout(timer);
            return "GO!"
          // TweenLite.to($("#count_num"), 0.5, {opacity:0, delay:.5, onComplete:hideCount});
          //  $("#count_num").style.display = "none";
            
       }
     });

    },1000);

    //hideCount()
    TweenLite.to(countdownDiv, 0.5, {opacity:0, delay:3.5, onComplete:hideCount});
}

function hideCount(){
    var countdownDiv = document.getElementById("count_num");
    countdownDiv.style.display = "none";
    clock() //STARTS THE TIMER
}

