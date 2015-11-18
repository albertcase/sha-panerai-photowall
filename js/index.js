
var grid = document.querySelector('.grid');

var msnry = new Masonry( grid, {
    itemSelector: '.grid-item',
    percentPosition: true
});

imagesLoaded( grid, function() {
    // layout Masonry after each image loads
    msnry.layout();
});

    

var swiper = new Swiper('.swiper-container', {
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 30,
    speed:900,
    parallax : true,
    grabCursor : true,
    effect : 'coverflow',
    centeredSlides: true,
    coverflow: {
        rotate: 30,
        stretch: 10,
        depth: 60,
        modifier: 2,
        slideShadows : false
    }
});




$(".proList li").click(function(){
    var curType = $(this).attr("data-type");
    if($(this).find("a").is(":hidden")){
        if(curType == "image"){
            $(".proinfo").hide();
            $("#imgsSection").show();
        }else if(curType == "pro"){
            $(".proinfo").hide();
            $("#prosSection").show();
            swiper.update();
        }else{
            alert("video")
        }
    }
})


$(".proinfo_close").click(function(){
    $(".proinfo").hide();
    //swiper.removeAllSlides();
})






var myScroll, pullUpEl, pullUpOffset;


function getItemElement(imgtype, imgid, imgurl) {
      var elem = document.createElement('li');
      elem.className = 'grid-item';
      elem.setAttribute("data-type", imgtype);
      elem.innerHTML = '<a href="workinfo.html?wid='+imgid+'"></a><img src="'+imgurl+'" />';
      return elem;
}


var curpageindex = 1;
function pullUpAction () {
 
        curpageindex ++;

        // 图片列表
        var pull_photolistPushData = {
            "type": "all",  //all   user   home
            "page": curpageindex,  // 页数
            "row": "10"    // 个数，默认10
        };

        ajaxfun("POST", "/Request.php?model=photolist", pull_photolistPushData, "json", pull_photolistCallback);



        function pull_photolistCallback(data){
            //console.log(data);
            var elems = [];
            var fragment = document.createDocumentFragment();

            if(data.code == 1){
                if(data.msg == ""){
                    console.log("没有更多的作品了哦，马上去上传自己的作品");
                    //return false;
                };
                $.map(data.msg, function(v, k){
                    var elem = getItemElement(v.type, v.id, v.url);
                        fragment.appendChild( elem );
                        elems.push( elem );
                    //return '<li class="grid-item" data-type="'+v.type+'"><a href="workinfo.html?wid='+v.id+'"></a><img src="'+v.url+'" /></li>';
                })//.join("");


                // append elements to container
                grid.appendChild(fragment);
                // add and lay out newly appended elements
                msnry.appended(elems);
                imagesLoaded( grid, function() {
                    // layout Masonry after each image loads
                    msnry.layout();
                    myScroll.refresh();     // 数据加载完成后，调用界面更新方法 
                });
                

            }else{
                console.log(data.msg);
            }
        } 


}










    
    myScroll = new IScroll('#wrapp', { 
        preventDefault:false,
        click:iScrollClick(), //调用判断函数
        scrollbars: false,//有滚动条
        mouseWheel: true,//允许滑轮滚动
        fadeScrollbars: true//滚动时显示滚动条，默认影藏，并且是淡出淡入效果
    });

    
    if(document.getElementById('pullUp')){

        pullUpEl = document.getElementById('pullUp'); 
        pullUpOffset = pullUpEl.offsetHeight;

        myScroll.on('refresh', function () {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        });

        myScroll.on('scrollMove', function () {
            if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                this.maxScrollY = pullUpOffset;
            }
        });

        myScroll.on('scrollEnd', function () {
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';                
                pullUpAction(); // Execute custom function (ajax call?)
            }
        });

    } 
    

    



document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);








// 图片列表
var photolistPushData = {
    "type": "all",  //all   user   home
    "page": "1",  // 页数
    "row": "10"    // 个数，默认10
};

ajaxfun("POST", "/Request.php?model=photolist", photolistPushData, "json", photolistCallback);


function photolistCallback(data){
    //console.log(data);
    var elems = [];
    var fragment = document.createDocumentFragment();

    if(data.code == 1){

        $.map(data.msg, function(v, k){
            var elem = getItemElement(v.type, v.id, v.url);
                fragment.appendChild( elem );
                elems.push( elem );
            //return '<li class="grid-item" data-type="'+v.type+'"><a href="workinfo.html?wid='+v.id+'"></a><img src="'+v.url+'" /></li>';
        })//.join("");


        // append elements to container
        grid.appendChild(fragment);
        // add and lay out newly appended elements
        msnry.appended(elems);
        imagesLoaded( grid, function() {
            // layout Masonry after each image loads
            msnry.layout();
            myScroll.refresh();     // 数据加载完成后，调用界面更新方法 
        });
        

    }else{
        console.log(data.msg);
    }
} 









