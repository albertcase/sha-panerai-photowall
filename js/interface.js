











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























