var shareData = {
            title: '明星大咖来报道，谁是最养眼的COACH星尚人？',
            desc: '明星大咖来报道，谁是最养眼的COACH星尚人？',
            link: window.location.host,
            imgUrl: 'http://' + window.location.host + '/images/share.jpg'
};

var LoadingImg = ["../images/share.jpg","../images/share/1.jpg","../images/share/2.jpg","../images/share/3.jpg","../images/share/4.jpg","../images/share/6.jpg","../images/share/7.jpg","../images/share/8.jpg","../images/share/9.jpg","../images/share/10.jpg","../images/share/11.jpg","../images/share/12.jpg","../images/share/13.jpg","../images/share/14.jpg","../images/share/15.jpg","../images/share/16.jpg","../images/share/17.jpg","../images/share/18.jpg"],_doing;
var allDataVal = "";
$(".loading").fadeIn();


var dataId = {
	"mId" : "",
	"pId" : ""
}


;(function($){
	$(function(){

		_doing = {
			allListData : "",
			modelData : "",
			getQueryString : function(){
				var r = unescape(location.hash);
			    r=r.replace("#","");
			    if(r!=null)return r; return null;
			},
			allData : function(){
        		$.ajax({
				    type: "GET",
				    url: "data.json",
				    dataType:"json"
			    }).done(function(data){
			    	allDataVal = data;
			    	//console.log(data);
				    //获取所有图片
				    $.map(data, function(value){
				        LoadingImg.push(value.pic_thumbnail);
				    	$.map(value.photo,function(thisVal){
				    		LoadingImg.push(thisVal.pic_thumbnail);
				    		$.map(thisVal.product,function(secVal){
					    		LoadingImg.push(secVal.pic_thumbnail)
					    	})
				    	})
				    });

				    loading(LoadingImg);
				    _doing.getList(data);
                    wechatFun();

				    if(_doing.getQueryString()&&_doing.getQueryString()!="#"){
				    	$(".modelList").hide();
			            
			            dataId.mId = _doing.getQueryString();
                        $("#model-detail").fadeIn();
                        _doing.getModel(dataId.mId );
                        var modelName = $(".swiper-slide-active").attr("data-name");
                        shareData = {
                                title: '春夏最养眼的COACH星尚人——'+modelName+'，朋友你怎么看？',
                                desc: '春夏最养眼的COACH星尚人——'+modelName+'，朋友你怎么看？',
                                link: window.location.host,
                                imgUrl: 'http://' + window.location.host + '/images/share/'+dataId.mId+'.jpg'
                        };

                        _hmt.push(['_trackEvent', 'model', 'enter', modelName]);
                        
                        editShare();

				    }

			    });
        	},
        	getList : function(data){
        		this.allListData = $.map(data,function(v){
        			return '<li data-id="'+v.model_nid+'" data-name="'+v.name+'"><img src="'+v.pic_thumbnail+'"></li>'
        		}).join("");
        		$(".modelList").html(this.allListData);

        		/* li点击事件 */
				$(".modelList li").click(function(){
					var modelId = $(this).attr("data-id"); //明星id
                    var modelName = $(this).attr("data-name"); //明星名字

					if(modelId==5)return;
					$(".modelList").hide();
		            
		            dataId.mId = modelId;
                    shareData = {
                                title: '春夏最养眼的COACH星尚人——'+modelName+'，朋友你怎么看？',
                                desc: '春夏最养眼的COACH星尚人——'+modelName+'，朋友你怎么看？',
                                link: window.location.host,
                                imgUrl: 'http://' + window.location.host + '/images/share/'+modelId+'.jpg'
                    };
                    
                    _hmt.push(['_trackEvent', 'list', 'click', modelName]);
                    $("#model-detail").fadeIn();

                    history.pushState("/", null, "#"+modelId)
                    _doing.getModel(modelId);
                    editShare();

				})

        	},
        	getModel : function(modelId){
      
        		$.map(allDataVal,function(v){
        			if(v.model_nid == modelId){
        				this.modelData = $.map(v.photo,function(bv){
        					return '<div class="swiper-slide" data-id="'+bv.photo_nid+'" data-name="'+v.name+'"><img src="'+bv.pic_thumbnail+'"></div>';
        				});
        				$(".swiper-wrapper").html(this.modelData);
        				mySwiper.update();
        			}
        		})

        		
        	},
        	getPro : function(modelId,photoId){
        		$.map(allDataVal,function(v){
        			if(v.model_nid == modelId){
        				$.map(v.photo,function(bv){
        					if(bv.photo_nid == photoId){
        						this.modelData = $.map(bv.product,function(cv){
	        						return '<li><img src="'+cv.pic_thumbnail+'" data-id="'+cv.photo_nid+'"><p> 款号:'+cv.name+'</p></li>';
	        					});
        					}
        				});
        				$(".product").html(this.modelData);
        			}
        		})
        	}
		}



		_doing.allData();


	})
})(jQuery);

var mySwiper = $('#swiper').swiper({
		pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        loop: false,
    	onTouchEnd: function(data) {
	      	holdPosition = 0;
	    }
});


/* 模特详细关闭 */
$(".close").click(function(){
	$(".modelList").fadeIn();
	$("#model-detail").hide();
	$(".swiper-wrapper").html("");
    $(".product").html("");
    mySwiper.removeAllSlides();
    $(".m-page").attr("class","m-page");
    $(".m-page").eq(1).addClass("f-hide");
    car2.refresh();
    history.pushState("/", null, "#");
})




function orientationChange() {
    switch(window.orientation) {
    　　case 0:
            document.getElementById('heng').style.display="none";
            break;
    　　case -90:
            document.getElementById('heng').style.display="block";
            break;
    　　case 90:
            document.getElementById('heng').style.display="block";
            break;
    　　case 180:
        　　document.getElementById('heng').style.display="none";
        　　break;
    };

};


addEventListener('load', function(){
    orientationChange();
    window.onorientationchange = orientationChange;
});

$(".shareTips").click(function(){
    $(".wechatTips").show();
})

$(".wechatTips").click(function(){
    $(this).hide();
})

