


if(isIpad()){

	// 获取作品
	var photolistbyidPushData = {
	    "id": ""
	};

	function photolistbyidCallback(data){
		//console.log(data);
	    if(data.code == 1){
	       
	    	var wInfoHtml = '<div class="wa_header"><span class="heart_icon hover"><img src="../imgs/heart_icon_hover.png" width="100%"></span> <em>'+data.msg.ballot+'</em> <span class="wechat_name">'+data.msg.nickname+'</span></div><dl><dt><img src="'+data.msg.url+'" width="100%"></dt><dd>'+data.msg.content+'</dd></dl>';	
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


	var curcpid;
	$(".grid").delegate("li","click",function(){
		
		var itemType = $(this).attr("data-type");
		if(itemType == "video") return false;
		
		if(!itemType){
			$(".proinfo").hide();
			$("#imgsQrcode").show();
		}else{
			ismoveDisable = true;
			var photolistbyidPushData = {
			    "id": $(this).attr("data-id")
			};

			ajaxfun("GET", "/Request.php?model=photolistbyid", photolistbyidPushData, "json", photolistbyidCallback);

			$("#pl_list").css({"opacity": 0});

			if(itemType == "user"||itemType == "home"){
				$(".proinfo").hide();
				$("#imgsSection").show();
			}else if(itemType == "pic"){
				$(".loading").hide();
				ajaxfun("GET", "/Request.php?model=product","", "json", productCallback);
				curcpid = $(this).attr("data-id");
			}
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



    function productCallback(data){
        //console.log(data);
        var _proImgArr = [], curswiperindex;
        var productHtml = $.map(data.msg, function(v, k){
        	_proImgArr.push(v.bigpic);
        	if(curcpid == v.id){
                curswiperindex = k;
            }
        	return ' <div class="swiper-slide"><div class="proName"><h2>RADIOMIR 1940</h2>'+v.title+'</div><div class="proImg"><img src="'+v.bigpic+'" /></div><div class="proDescription">'+v.content+'</div></div>';
        }).join("");
        

        LoadFn(_proImgArr , function (){

	        $(".loading").hide();
	        $(".proinfo").hide();
			$("#prosSection").show();
	        $("#productContent").html(productHtml);
        	swiper.update();

        	swiper.slideTo(curswiperindex, 0, true);
	           
	    } , function (p){
	        //console.log(p+"%");
	    });
        
    }




}






