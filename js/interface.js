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



// 授权登录
var oauthPushData = {
	"url": "index.html"
};

//ajaxfun("GET", "/Request.php?model=oauth", oauthPushData, "json", "");





// 图片列表
var photolistPushData = {
	"type": "",
	"page": "",
	"row": ""
};

ajaxfun("POST", "/Request.php?model=photolist", photolistPushData, "json", photolistCallback);

function photolistCallback(data){
	if(data.code == 1){
		
	}else{
		console.log(data.msg);
	}
} 


// 获取作品
var photolistbyidPushData = {
	"id": ""
};

ajaxfun("GET", "/Request.php?model=photolistbyid", photolistbyidPushData, "json", photolistbyidCallback);

function photolistbyidCallback(data){
	if(data.code == 1){
		
	}else{
		console.log(data.msg);
	}
} 



// 投票
var ballotdPushData = {
	"id": ""
};

ajaxfun("POST", "/Request.php?model=ballotd", ballotdPushData, "json", ballotdCallback);

function ballotdCallback(data){
	if(data.code == 1){
		
	}else{
		console.log(data.msg);
	}
} 



// jssdk
var jssdkPushData = {
	"url": ""
};

ajaxfun("POST", "/Request.php?model=jssdk", jssdkPushData, "json", jssdkCallback);

function jssdkCallback(data){
	if(data.code == 1){
		
	}else{
		console.log(data.msg);
	}
} 























