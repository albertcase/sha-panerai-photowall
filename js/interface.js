
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

ajaxfun("GET", "/Request.php?model=oauth", oauthPushData, "json", "");


// 保存图片
var saveimgPushData = {
	"image": "",
	"content": ""
};

ajaxfun("POST", "/Request.php?model=oauth", saveimgPushData, "json", saveimgCallback);

function saveimgCallback(data){
	if(data.code == 1){
		
	}else{
		console.log(data.msg);
	}
} 



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























