<?php


header("Content-Type:text/html;charset=utf-8");
session_start(); // Starting Session

// Define $name and $password
$name=$_GET['uname'];
$password=$_GET['upassword'];


/* json */
$json ="";
$data =array(); 
class Member 
{
public $success;
}
$Member = new Member();


if ($name=='admin'&&$password=='panerai') {
	$_SESSION['login_user']=$name; // Initializing Session
	$Member->success = 1;
	//header("location: report.php"); // Redirecting To Other Page
} else {
	$Member->success = 0;
}


$data[]=$Member;
$json = json_encode($data);
echo "{".'"Member"'.":".$json."}";

?>