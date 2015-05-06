var LoadingImg = [],_doing;
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

				    if(_doing.getQueryString()){
				    	$(".modelList").hide();
			            $("#model-detail").fadeIn();
			            dataId.mId = _doing.getQueryString();
			            _doing.getModel(dataId.mId );
				    }

			    });
        	},
        	getList : function(data){
        		this.allListData = $.map(data,function(v){
        			return '<li data-id="'+v.model_nid+'"><img src="'+v.pic_thumbnail+'"></li>'
        		}).join("");
        		$(".modelList").html(this.allListData);

        		/* li点击事件 */
				$(".modelList li").click(function(){
					var modelId = $(this).attr("data-id");
					$(".modelList").hide();
		            $("#model-detail").fadeIn();
		            dataId.mId = modelId;
		            history.pushState("index.html", null, "#"+modelId)
		            _doing.getModel(modelId);
				})

        	},
        	getModel : function(modelId){

        		$.map(allDataVal,function(v){
        			if(v.model_nid == modelId){
        				this.modelData = $.map(v.photo,function(bv){
        					return '<div class="swiper-slide" data-id="'+bv.photo_nid+'"><img src="'+bv.pic_thumbnail+'"></div>';
        				});
        				$(".swiper-wrapper").html(this.modelData);
        			}
        		})

        		var swiper = $('.swiper-container').swiper({
						pagination: '.swiper-pagination',
				        paginationClickable: true,
				        nextButton: '.swiper-button-next',
				        prevButton: '.swiper-button-prev',
				        loop: false,
			        	onTouchEnd: function(data) {
					      	holdPosition = 0;
					    }
				});
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



/* 模特详细关闭 */
$(".close").click(function(){
	$(".modelList").fadeIn();
	$("#model-detail").hide();
	$(".swiper-wrapper").html("");
    $(".product").html("");
})
