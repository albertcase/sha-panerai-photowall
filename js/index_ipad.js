
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
		//console.log(data);
	    if(data.code == 1){
	       
	    	var wInfoHtml = '<div class="wa_header"><span class="heart_icon"><img src="../imgs/heart_icon.png" width="100%"></span> <em>'+data.msg.ballot+'</em> <span class="wechat_name">'+data.msg.nickname+'</span></div><dl><dt><img src="'+data.msg.url+'" width="100%"></dt><dd>'+data.msg.content+'</dd></dl>';	
	    	$(".workInfo_Area").html(wInfoHtml);

	    	// 投票
		    var ballotdPushData = {
		        "id": data.msg.id
		    };

		    $(".heart_icon").click(function(){

		        if($(this).hasClass("hover")) return false;

		        $(this).addClass("hover");
		        
		        ajaxfun("POST", "/Request.php?model=ballot", ballotdPushData, "json", ballotdCallback);
		    })


	    }else{
	        alert(data.msg);
	    }
	} 



	$(".grid").delegate("li","click",function(){
		ismoveDisable = true;
		var itemType = $(this).attr("data-type");
		var photolistbyidPushData = {
		    "id": $(this).attr("data-id")
		};

		ajaxfun("GET", "/Request.php?model=photolistbyid", photolistbyidPushData, "json", photolistbyidCallback);

		$("#pl_list").css({"opacity": 0});

		if(itemType == "user"){
			$(".proinfo").hide();
			$("#imgsSection").show();
		}else{
			$(".proinfo").hide();
			$("#prosSection").show();
		}
		
	});



	$(".proinfo_close").click(function(){
	    $(".proinfo").hide();
	    $(".workInfo_Area").empty();
	    ismoveDisable = false;
	    $("#pl_list").css({"opacity": 1});
	    //swiper.removeAllSlides();
	})



    function ballotdCallback(data){
        var curPraise = $(".heart_icon").siblings("em").html();
        if(data.code == 1){
            $(".heart_icon").siblings("em").html(parseInt(curPraise)+1);
            alert("点赞成功！");
        }else{
            console.log(data.msg);
        }
    } 







}






