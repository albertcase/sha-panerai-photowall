function iScrollClick(){
    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
    if (/Silk/i.test(navigator.userAgent)) return false;
    if (/Android/i.test(navigator.userAgent)) {
       var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
       return parseFloat(s[0]+s[3]) < 44 ? false : true
    }
}


var myScroll;
function loaded () {
    myScroll = new IScroll('#wrapp', { 
        preventDefault:false,
        click:iScrollClick(), //调用判断函数
        scrollbars: false,//有滚动条
        mouseWheel: true,//允许滑轮滚动
        fadeScrollbars: true//滚动时显示滚动条，默认影藏，并且是淡出淡入效果
    });
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

window.onload = loaded;


/* menu */

$(".menu").click(function(){

    if($(this).hasClass("open")){
        $(this).removeClass("open");
        $(".menuArea").animate({"left": "-76%"});
        $("#wrapp").animate({"left": "0"});
    }else{
        $(this).addClass("open");
        $(".menuArea").animate({"left": "0%"});
        $("#wrapp").animate({"left": "76%"});
    }

})


$("#wrapp").bind("click", function (event) {
    if($(".menu").hasClass("open")){
        $(".menu").removeClass("open");
        $(".menuArea").animate({"left": "-76%"});
        $("#wrapp").animate({"left": "0"});
        event.preventDefault(); 
    }
    
});



function orientationChange() {
    //alert(window.orientation);
    myScroll.refresh();  
};

addEventListener('load', function(){
    orientationChange();
    window.onorientationchange = orientationChange;
});

















