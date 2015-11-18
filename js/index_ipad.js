
function isIpad(){
    var ua = navigator.userAgent.toLowerCase();
    if(/ipad/i.test(ua))
    {
        return true;
    }
    else{
        return false;
    }
}



if(isIpad()){

	// 获取作品
	var photolistbyidPushData = {
	    "id": ""
	};

	function photolistbyidCallback(data){
		console.log(data);
	    if(data.code == 1){
	       
	    	var wInfoHtml = '<div class="wa_header"><span class="heart_icon"><img src="../imgs/heart_icon.png" width="100%"></span> <em>'+data.msg.ballot+'</em> <span class="wechat_name">'+data.msg.nickname+'</span></div><dl><dt><img src="'+data.msg.url+'" width="100%"></dt><dd>'+data.msg.content+'</dd></dl>';	
	    	$(".workInfo_Area").html(wInfoHtml);

	    }else{
	        console.log(data.msg);
	    }
	} 



	$(".grid").delegate("li","touchstart",function(){
		var itemType = $(this).attr("data-type");
		var photolistbyidPushData = {
		    "id": $(this).attr("data-id")
		};

		ajaxfun("GET", "/Request.php?model=photolistbyid", photolistbyidPushData, "json", photolistbyidCallback);

		if(itemType == "user"){
			$(".proinfo").hide();
			$("#imgsSection").show();
		}else{
			$(".proinfo").hide();
			$("#prosSection").show();
		}
		

	});








}






