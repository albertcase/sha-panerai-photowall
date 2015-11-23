// 授权登录
var oauthPushData = {
    "url": window.location.href
};

function oauthfunc(){
    $.ajax({
        type: "GET",
        url: "/Request.php?model=oauth",
        data: oauthPushData,
        dataType: "json"
    }).done(function(data){
    })
}


$.ajax({
    type: "GET",
    url: "/Request.php?model=islogin",
    data: oauthPushData,
    dataType: "json"
}).done(function(data){
    if(data.code == 0){
        oauthfunc();
    }
})



function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return unescape(r[2]); return null;
}

function iScrollClick(){
    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
    if (/Silk/i.test(navigator.userAgent)) return false;
    if (/Android/i.test(navigator.userAgent)) {
       var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
       return parseFloat(s[0]+s[3]) < 44 ? false : true
    }
}


function ajaxfun(ajaxType, ajaxUrl, ajaxData, ajaxDataType, ajaxCallback){
    $.ajax({
        type: ajaxType,
        url: ajaxUrl,
        data: ajaxData,
        dataType: ajaxDataType
    }).done(function(data){
        ajaxCallback(data)
    })
}



var myScroll;
    myScroll = new IScroll('#wrapp', { 
        preventDefault:false,
        click:iScrollClick(), //调用判断函数
        scrollbars: false,//有滚动条
        mouseWheel: true,//允许滑轮滚动
        fadeScrollbars: true//滚动时显示滚动条，默认影藏，并且是淡出淡入效果
    });

document.getElementById("wrapp").addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

//window.onload = loaded;


/* menu */

$(".menu").click(function(){

    if($(this).hasClass("open")){
        $(this).removeClass("open");
        $(".menuArea").stop().animate({"left": "-76%"});
        $("#wrapp").stop().animate({"left": "0"});
        $(".disable").hide();
    }else{
        $(this).addClass("open");
        $(".menuArea").stop().animate({"left": "0%"});
        $("#wrapp").stop().animate({"left": "76%"});
        $(".disable").show();
    }

})


$(".disable").bind("touchstart", function (event) {
    if($(".menu").hasClass("open")){
        $(".menu").removeClass("open");
        $(".menuArea").stop().animate({"left": "-76%"});
        $("#wrapp").stop().animate({"left": "0"});
        $(".disable").hide();
        event.preventDefault(); 
    }
    
});


function orientationChange() {
    myScroll.refresh();
};

addEventListener('load', function(){
    orientationChange();
    window.onorientationchange = orientationChange;
});






/* 微信分享 */



var wechatUrl;
if(window.location.href.indexOf('#') < 0){
    wechatUrl = window.location.href;
}else{
    wechatUrl = window.location.href.substr(0,window.location.href.indexOf('#'));
}


// jssdk
var jssdkPushData = {
    "url": wechatUrl
};

ajaxfun("POST", "/Request.php?model=jssdk", jssdkPushData, "json", jssdkCallback);

function jssdkCallback(data){
    if(data.code == 1){
        wechatShare(data.appid,data.timestamp,data.noncestr,data.sign);
    }else{
        //console.log(data.msg);
    }
} 





var shareData = {
            title: '登临“臻品之墙”，分享你与沛纳海的 故事！',
            desc: '我的照片刚刚登上了沛纳海的“臻品之墙” 期待你的参与哦。',
            link: window.location.host,
            imgUrl: 'http://' + window.location.host + '/imgs/share.jpg'
};

function wechatShare(timestamp_val,signature_val){

  wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wx737a6d5fe4d19c89', // 必填，公众号的唯一标识
      timestamp: timestamp_val, // 必填，生成签名的时间戳
      nonceStr: 'asdkhaedhqwui', // 必填，生成签名的随机串
      signature: signature_val,// 必填，签名，见附录1
      jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });

  wx.ready(function(){


    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    wx.onMenuShareTimeline({
        title: shareData.title, // 分享标题
        link: shareData.link, // 分享链接
        imgUrl: shareData.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数

            //alert('分享成功');
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            // alert("分享失败")
        }
    });
    
    
    wx.onMenuShareAppMessage({
        title: shareData.title, // 分享标题
        link: shareData.link, // 分享链接
        imgUrl: shareData.imgUrl, // 分享图标
        desc: shareData.desc,
        success: function () { 
            // 用户确认分享后执行的回调函数


            //alert('分享成功');
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
           // alert("分享失败")
        }
    });
      
  });

  wx.error(function(res){
    //alert("无法使用微信JS")
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

  });

}

function editShare(){   ///demon
     wx.onMenuShareTimeline({
            title: shareData.title, // 分享标题
            link: shareData.link, // 分享链接
            imgUrl: shareData.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数

                
                //alert('分享成功');
            },
            cancel: function () { 
                // 用户取消分享后执行的回调函数
                // alert("分享失败")
            }
        });
        
        
        wx.onMenuShareAppMessage({
            title: shareData.title, // 分享标题
            link: shareData.link, // 分享链接
            imgUrl: shareData.imgUrl, // 分享图标
            desc: shareData.desc,
            success: function () { 
                // 用户确认分享后执行的回调函数

                //alert('分享成功');
            },
            cancel: function () { 
                // 用户取消分享后执行的回调函数
               // alert("分享失败")
            }
        });
}








/* 图片加载 */
function LoadFn ( arr , fn , fn2){
        var loader = new PxLoader();
        for( var i = 0 ; i < arr.length; i ++)
        {
            loader.addImage(arr[i]);
        };
        
        loader.addProgressListener(function(e) {
                var percent = Math.round( e.completedCount / e.totalCount * 100 );
                if(fn2) fn2(percent)
        }); 
        
        
        loader.addCompletionListener( function(){
            if(fn) fn();    
        });
        loader.start(); 
}





















