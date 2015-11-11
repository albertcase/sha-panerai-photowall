var myScroll;
function loaded () {
    myScroll = new IScroll('#wrapper', { mouseWheel: true });
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);



/* menu */

$(".menu").click(function(){

    if($(this).hasClass("open")){
        $(this).removeClass("open");
        $(".menuArea").animate({"left": "-76%"});
        $("#wrapper").animate({"left": "0"});
    }else{
        $(this).addClass("open");
        $(".menuArea").animate({"left": "0%"});
        $("#wrapper").animate({"left": "76%"});
    }

})


 $("#wrapper").bind("touchstart", function (event) {
    if($(".menu").hasClass("open")){
        $(".menu").removeClass("open");
        $(".menuArea").animate({"left": "-76%"});
        $("#wrapper").animate({"left": "0"});
    }
    event.preventDefault(); 
});

// $("#scroller").click(function(){
//     alert(6);
//     if($(".menu").hasClass("open")){
//         $(".menu").removeClass("open");
//         $(".menuArea").animate({"left": "-76%"});
//         $("#wrapper").animate({"left": "0"});
//     }
// })