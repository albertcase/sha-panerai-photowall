var workInfoData = {
    "_totalpage":""
}

var ismoveDisable = false;



var swiper = new Swiper('.swiper-container', {
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 30,
    speed:600,
    parallax : true,
    grabCursor : true,
    //effect : 'fade',
    centeredSlides: true
});



var pullUpEl, pullUpOffset;

// 滚动执行输出内容函数
function getItemElement(imgtype, imgid, imgurl, _content) {
      var elem = document.createElement('li');
      var writeInfoHtml = "";
      if(imgtype == "pic"){
        writeInfoHtml = '<a href="products.html?cpid='+imgid+'"></a><img src="'+imgurl+'" />'
      }else if(imgtype == "user"|| imgtype == "home"){
        writeInfoHtml = '<a href="workinfo.php?id='+imgid+'"></a><img src="'+imgurl+'" />';
      }else{
        elem.setAttribute("onclick", "myVideo($(this))");
        elem.setAttribute("data-videourl", _content);
        writeInfoHtml = '<img src="'+imgurl+'" />';   //<a href="javascript:;" onclick="myVideo($(this))" data-videourl="'+_content+'"></a>
      }

      elem.className = 'grid-item ' + imgtype;
      elem.setAttribute("data-type", imgtype);
      elem.setAttribute("data-id", imgid);
      elem.innerHTML = writeInfoHtml;
      return elem;
}



// 滚动执行函数

var curpageindex = 1;
function pullUpAction () {
        //$(".loading").show();
        curpageindex ++;
        console.log(curpageindex + ": " + workInfoData["_totalpage"]);
        if(curpageindex >= workInfoData["_totalpage"]){
            $("#pullUp").hide();
        }else{
            $("#pullUp").show();
        }

        var curchoseType;

        if(isIpad()){
            curchoseType = $(".head_ipad li.hover").attr("data-type");
        }else{
            curchoseType = $(".menuArea li.hover").attr("data-type");
        }

        // 图片列表
        var pull_photolistPushData = {
            "type": curchoseType,  //all   user   home
            "page": curpageindex,  // 页数
            "row": "10"    // 个数，默认10
        };

        
        ajaxfun("POST", "/Request.php?model=photolist", pull_photolistPushData, "json", pull_photolistCallback);



        function pull_photolistCallback(data){
            workInfoData["_totalpage"] = data.totalpage;
            //console.log(data);
            var elems = [], loadingImgArr = [];
            var fragment = document.createDocumentFragment();

            if(data.code == 1){
                if(data.msg == ""){
                    console.log("没有更多的作品了哦，马上去上传自己的作品");
                    //return false;
                };
                $.map(data.msg, function(v, k){
                    loadingImgArr.push(v.url);
                    var elem = getItemElement(v.type, v.id, v.url, v.content);
                        fragment.appendChild( elem );
                        elems.push( elem );
                    //return '<li class="grid-item" data-type="'+v.type+'"><a href="workinfo.html?wid='+v.id+'"></a><img src="'+v.url+'" /></li>';
                })//.join("");

                //console.log(loadingImgArr);

                // 当图片加载完成之后在添加进入页面            
                LoadFn(loadingImgArr , function (){

                    // append elements to container
                    grid.appendChild(fragment);
                    // add and lay out newly appended elements
                    isotope.appended(elems);
                    imagesLoaded( grid, function() {
                        // layout Masonry after each image loads
                        //isotope.layout();
                        myScroll.refresh();
                        //$(".loading").hide();
                    });
                       
                } , function (p){
                    //console.log(p+"%");
                });

                
            }else{
                console.log(data.msg);
                //$(".loading").hide();
            }
        } 


}



    // 滚动状态执行
    
    if(document.getElementById('pullUp')){

        pullUpEl = document.getElementById('pullUp'); 
        pullUpOffset = pullUpEl.offsetHeight;

        myScroll.on('refresh', function () {
            if(curpageindex >= workInfoData["_totalpage"] || ismoveDisable) return false;

            if (pullUpEl.className.match('loadingp')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        });

        myScroll.on('scrollMove', function () {
            if(curpageindex >= workInfoData["_totalpage"] || ismoveDisable) return false;

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
                pullUpEl.className = 'loadingp';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';                
                pullUpAction(); // Execute custom function (ajax call?)
            }
        });

    } 
    

var entertype = GetQueryString("type");
if(!entertype){
    entertype = "all"
}


// 图片列表
var photolistPushData = {
    "type": entertype,  //all   user   home
    "page": "1",  // 页数
    "row": "10"    // 个数，默认10
};


$(".loading").show();

if(entertype == "all" || !entertype){
    if(isIpad()){
        $("#pl_list").append('<li class="grid-item static"><img src="../imgs/wog_wechat.jpg"></li>');
    }
}


ajaxfun("POST", "/Request.php?model=photolist", photolistPushData, "json", photolistCallback);


function photolistCallback(data){


    workInfoData["_totalpage"] = data.totalpage;

    //console.log(data);
    var elems = [], loadingImgArr = [];
    var fragment = document.createDocumentFragment();

    if(data.code == 1){

        $(".li_" + photolistPushData["type"]).addClass("hover");

        if(data.totalpage >1){
            $("#pullUp").show();
        }

        if(data.msg == ""){
            $(".loading").hide();
            $("#pl_list").html('<p>您尚未上传任何作品，诚邀您登临“臻品之墙”</p>');
        }else{

            var elem;
            if(data.total == 1){
                loadingImgArr.push(data.msg[0].url);
                elem = getItemElement(data.msg[0].type, data.msg[0].id, data.msg[0].url, data.msg[0].content);
                fragment.appendChild( elem );
                    //allImgLoading.push();
                elems.push( elem );
            }else{
                $.map(data.msg, function(v, k){
                    loadingImgArr.push(v.url);
                    elem = getItemElement(v.type, v.id, v.url, v.content);
                    fragment.appendChild( elem );
                        //allImgLoading.push();
                    elems.push( elem );
                    //return '<li class="grid-item" data-type="'+v.type+'"><a href="workinfo.html?wid='+v.id+'"></a><img src="'+v.url+'" /></li>';
                })//.join("");
            }
            


            // 当图片加载完成之后在添加进入页面            
            LoadFn(loadingImgArr , function (){

                if(data.total == 1){

                    grid.appendChild(fragment);
                    $(".loading,#pullUp").hide();

                }else{
                    // append elements to container
                    grid.appendChild(fragment);
                    // add and lay out newly appended elements
                    isotope.appended(elems);
                    imagesLoaded( grid, function() {
                        // layout Masonry after each image loads
                        isotope.layout();
                        myScroll.refresh();     // 数据加载完成后，调用界面更新方法 
                        $(".loading").hide();
                    });
                }
                
                   
            } , function (p){
                //console.log(p+"%");
            });

        }

        


    }else{
        console.log(data.msg);
    }
} 



var grid = document.querySelector('.grid');
var isotope = new Isotope( grid, {
    itemSelector: '.grid-item',
    percentPosition: true
});

imagesLoaded( grid, function() {
    isotope.layout();
});




function myVideo(_this){

    var vurl = _this.attr("data-videourl");
    var posterImg = _this.find("img").attr("src");
        videoFun(vurl, posterImg);

    // $(".loading").show();

    // var vurl = _this.attr("data-videourl");
    // var liArr = [];
    // liArr.push(vurl);
    // LoadFn(liArr, function (){

    //     $(".loading").hide();
    //     var video = document.createElement("VIDEO");
    //     video.setAttribute("id", "video");
    //     video.setAttribute("width", "100%");
    //     video.setAttribute("height", "100%");
    //     video.setAttribute("autoplay", "autoplay");
    //     video.setAttribute("src", vurl);
    //     document.body.appendChild(video);

    //     eventTester = function(e){
    //         video.addEventListener(e,function(){
    //             $("video").hide().remove();
    //         })
    //     }

    //     eventTester("pause");

           
    // } , function (p){
    //     //console.log(p+"%");
    // });


    return false;

}









//var vidArr = ["r01737z30w2"];
//var vPic = [basePath + "imgs/poster.jpg"];
var player;
var videoWidth = document.body.clientWidth;
var videoHeight = videoWidth * (1080 / 1920);

var videoFun = function(n,vPic){
    var video = new tvp.VideoInfo(); 
    video.setVid(n);
    player = new tvp.Player(); 
    player.create({
        width: videoWidth + 'px',
        height: videoHeight + 'px',
        video: video,
        autoplay: true,
        isHtml5UseFakeFullScreen: true,
        pic: vPic,
        modId:"mod_player", //mod_player是刚刚在页面添加的div容器 autoplay:true
        oninited: function () {         
            //player.pause();
            //播放器在视频载入完毕触发
        },
        onallended: function(){

        },
        onpause: function(){

        },
        onplaying: function(){
        },
        onfullscreen: function (isfull) {
            //alert(isfull);
            //onfullscreen(isfull); //播放器触发全屏/非全屏时，参数isfull表示当前是否是全屏
        }
    });

    $("#mod_player").css({"margin-top":-(videoHeight/2),"margin-left":-(videoWidth/2)});
    $("#video").show();
}


$(".video_close").click(function(){
    $("#video").hide();
    $("#mod_player").html("");
})

$(".fullpageBtn").click(function(){
    player.enterFullScreen();
    player.play(); 
})












