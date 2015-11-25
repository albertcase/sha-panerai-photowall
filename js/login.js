// JavaScript Document

$(".login_btn").click(function(){
	var forbidden =	document.myform.password.value;
	/*if(forbidden=="00000000"){
		$(".forbidden").show();
	}else{*/
		usrLoginFun(document.myform.name.value,document.myform.password.value);
	//};
	
})



function testAnim(eventId,x,hideId,showId) {
    $(eventId).removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass();
	  $(hideId).hide();
	  $(showId).fadeIn();
    });
};

testAnim("lightSpeedIn");



function sett(){
	$("#errorPrompt").animate({"top":"-50px"}).removeClass("success");
}

function errorPrompt(success){
	if(success=="success"){
		$("#errorPrompt").addClass("success").animate({"top":"0"},function(){
			setTimeout('sett()',2500)	
        });
	}else{
		$("#errorPrompt").animate({"top":"0"},function(){
		    setTimeout('sett()',2500)	
        });
	}
	
}










function usrLoginFun(userName,userPassword){
	var username = document.myform.name.value;
	var password = document.myform.password.value;
	
	errorPrompt();
	if(username==""){
		document.myform.name.focus();
		$("#errorPrompt").html("Please enter your account!");
		testAnim("#animationSandbox_login","shake","","");
		return false;
	}else if(password==""){
		document.myform.password.focus();
		$("#errorPrompt").html("Please enter your password!");
		testAnim("#animationSandbox_login","shake","","");
		return false;
	}
	
	$.get("../login.php",{"uname": userName,"upassword":userPassword},function(result){
		var resultVal = JSON.parse(result);
		if(resultVal.Member[0].success==0){
			errorPrompt();
			$("#errorPrompt").html("Failed!");	
			testAnim("#animationSandbox_login","shake","","");
		}else{
			errorPrompt("success");
			$("#errorPrompt").html("Login success!");	
			window.location.href="../view.php";
		}
		
	})
}





