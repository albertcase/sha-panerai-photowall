
	var isEdit = true;

	//平台检测
	var os=detectOS();
	//------------判断浏览器、操作系统
	function detectOS() {
	    var userAgent=navigator.userAgent;
	    //console.log(userAgent);
	    var os = {};
	    os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
	    os.androidICS = os.android && userAgent.match(/(Android)\s4/) ? true : false;
	    os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
	    os.iphone = !os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
	    os.ios = os.ipad || os.iphone;
	    os.wp=userAgent.match(/Windows Phone/) || userAgent.match(/IEMobile/) ? true : false;
	    os.supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || 'ontouchstart' in window);
	    return os;
	}//end func
	//微信检测
	var isWeixin=detectWeixin();
	function detectWeixin(){
	    var ua = navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i)=="micromessenger") return true;
	    else return false;
	}//end func





	
	//是否是三星S4
	var isS4=os.android && screen.width==1080 && window.innerHeight>=850 && window.devicePixelRatio==3;
	//alert('s4:'+isS4);
	//是否是iphone5
	var isIp5=os.ios && screen.width==320 && screen.height==568;
	//是否是iphone4
	var isIp4=os.ios && screen.width==320 && screen.height==480;

	//touch 
	var mutiTouch;
	var posLast1=[],posLast2=[],disLast,disSt,degSt,degLast;
	
	
	//imgBox
	var imgStep=1;
	var imgCv,imgCanvas,imgPic;
	var imgBox=$('section.imgBox');
	var imgShell=imgBox.children('.shell');
	var imgScale,imgSaleMin=0.1,imgScaleMax=1,imgScaleTimer;
	if(isS4) imgScaleMax=0.55;
	var imgRotation=0,imgRotaionTimer;
	var imgWatch;

	
	
	function addImgEvent(obj){
		if(isEdit){
			removeImgEvent();	
			imgShell.on('touchstart',imgShell_touchstart);
			imgShell.on('touchmove',{obj:obj},imgShell_touchmove);
			imgShell.on('touchend',{obj:obj},imgShell_touchend);
		}
		
	}//end func
	
	function removeImgEvent(){
		imgShell.off();
	}//end func

	  
	  function imgCreat(src){
			$('<img>').attr({src:src}).one('load',imgLoad);
	  }//end func
	  
	  function imgLoad(e){
			imgShell.css({"height":imgShell.height()});
			$('<canvas id="photoCanvas"></canvas>').attr({"width":imgShell.width(),"height":imgShell.height()}).prependTo(imgShell);
			imgCv=$('canvas');

			imgCanvas = oCanvas.create({
				canvas: imgCv[0],
				background: "#1a1a1a"
			});
			imgPic = imgCanvas.display.image({
				x:imgCv.width()/2,
				y:imgCv.height()/2,
				origin: { x: "center", y: "center" },
				image: this,
			});

			imgCanvas.addChild(imgPic);
			imgStep=1;
			imgRotation=0;
			if(os.ios) imgScale=0.3;
			else if(isS4) imgScale=imgScaleMax;
			else imgScale=0.5;
			imgScaleSet(imgPic);
			if(os.android) setTimeout(function(){
				imgCv[0].style.opacity = imgCv[0].style.opacity ? "" : "0.999";
			},250);

			$(".upload_loading").hide();
			addImgEvent(imgPic);

	}//end func
	
	



	//-------------------canvas操控
	
	//-------单指双指触控
	function imgShell_touchstart(e){
		
		if(event.touches.length==1){
			mutiTouch=false;
			posLast1=[event.touches[0].clientX,event.touches[0].clientY];
		}//end if
		else if(event.touches.length>=2 && os.ios){
			mutiTouch=true;
			posLast1=[event.touches[0].clientX,event.touches[0].clientY];
			posLast2=[event.touches[1].clientX,event.touches[1].clientY];
			disLast=getDis(posLast1,posLast2);
			degSt=degLast=getDeg(posLast1,posLast2);
		}//end if
		e.preventDefault();
	}//end func
	function imgShell_touchmove(e){
		
		if(!mutiTouch && event.touches.length==1){
			var pos=[event.touches[0].clientX,event.touches[0].clientY];
			e.data.obj.move(pos[0]-posLast1[0], pos[1]-posLast1[1]);
			posLast1=pos;
			imgCanvas.redraw();
			if(os.android) imgCv[0].style.opacity = imgCv[0].style.opacity ? "" : "0.999";
		}//end if
		else if(event.touches.length>=2 && os.ios){
			var pos1=[event.touches[0].clientX,event.touches[0].clientY];
			var pos2=[event.touches[1].clientX,event.touches[1].clientY];
			var dis=getDis(pos1,pos2);
			if(dis>disLast && Math.abs(dis-disLast)>0.5) imgScaleFunc(e.data.obj,1,0.01);
			else if(dis<disLast && Math.abs(dis-disLast)>0.5) imgScaleFunc(e.data.obj,-1,0.01);
			var deg=getDeg(pos1,pos2);
			var degDis=deg-degLast;
			if( degDis>15 || degDis<-15) degDis+=180;
			e.data.obj.rotate(degDis);
			imgCanvas.redraw();
			if(os.android) imgCv[0].style.opacity = imgCv[0].style.opacity ? "" : "0.999";
			posLast1=pos1;
			posLast2=pos2;
			disLast=dis;
			degLast=deg;
		}//end if

		e.preventDefault();
	}//end func

	function imgShell_touchend(e){
		if(event.touches.length>=1) mutiTouch=true;
		else mutiTouch=false;
		e.preventDefault();
	}//end func
	
	
	//图片缩放
	function imgScale_touchstart(e){
		
		clearInterval(imgScaleTimer);
		imgScaleTimer=setInterval(imgScaleFunc,33,e.data.obj,e.data.offset);
		e.preventDefault();
	}//end func
	
	function imgScale_touchend(e){
		
		clearInterval(imgScaleTimer);
		e.preventDefault();
	}//end func
	
	function imgScaleFunc(obj,offset,speed){
		speed=speed!=null?speed:0.01;
		imgScale+=speed*offset;
		imgScale=imgScale<=imgSaleMin?imgSaleMin:imgScale;
		imgScale=imgScale>=imgScaleMax?imgScaleMax:imgScale;
		imgScaleSet(obj);
	}//end func
	
	function imgScaleSet(obj){
		obj.scale(imgScale);
		imgCanvas.redraw();
		if(os.android) imgCv[0].style.opacity = imgCv[0].style.opacity ? "" : "0.999";
	}//end func
	
	
	
	//数学函数
	function getDis(pos1,pos2){
		var lineX=pos2[0]-pos1[0];
		var lineY=pos2[1]-pos1[1];
		return Math.sqrt(Math.pow(Math.abs(lineX),2)+Math.pow(Math.abs(lineY),2));
	}//end func
	
	function getDeg(pos1,pos2){
		var lineX=pos2[0]-pos1[0];
		var lineY=pos2[1]-pos1[1];
		return Math.atan(lineY/lineX)*180/Math.PI;
	}//end func
	