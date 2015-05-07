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



function loading(allAmg){
	LoadFn(allAmg , function (){
		$(".loading").hide();
		$(".page").animate({"opacity" : 1});
        console.log("加载完成!");
	} , function ( p ){
		//$('.loading').html(p+"%");
	});


}

