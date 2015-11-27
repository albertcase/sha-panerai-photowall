<?php
session_start();
if(!isset($_SESSION['login_user'])){
	Header('Location:./login.html');
	exit;
}
include_once('./config/database.php');
include_once('./config/Pdb.php');
include_once('./config/Pager.class.php');
include_once('./config/emoji.php');
$db = Pdb::getDb();
$rowcount = $db->getOne("SELECT count(*) as num FROM photo where type='user'");

$nowindex = 1;
if(isset($_GET['page'])){
    $nowindex = $_GET['page'];
}else if(isset($_GET["PB_Page_Select"])){
	$nowindex = $_GET["PB_Page_Select"];
}
$page = new Pager(array("nowindex" => $nowindex, "total" => $rowcount, "perpage" => 30, "style" => "page_break"));
$sql = "SELECT photo.*,openid,nickname,headimgurl FROM photo,user where photo.uid=user.id and  type='user' ORDER BY status,id desc LIMIT $page->offset,30";
$rs = $db->getAll($sql,true);

for ($i = 0; $i < count($rs); $i++) {
	$name = json_decode($rs[$i]['nickname'], true);
	$rs[$i]['nickname'] = emoji_unified_to_html($name['name']);
}
?>
<!DOCTYPE html>
<html>
<head>
<title>沛纳海</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="css/main.css">
<link rel="stylesheet" type="text/css" href="css/jquery.dataTables.css">
<link rel="stylesheet" type="text/css" href="css/demo.css">
<link rel="stylesheet" type="text/css" href="css/emoji.css" />
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript">
function check(id){
	$.ajax({
		url:"./Request.php?model=status",
		type:"post",
		data:{"id":id},
		dataType:"json",
		success:function(data){
			if(data.msg==1){
				$("#check_"+id).val("approved");
			}else{
				$("#check_"+id).val("unapproved");
			}
		}
	})
}
</script>
</head>

<body>
	<div class="container">
		<section>

			<!-- <h1 style="margin-bottom:50px; text-align:center ;color:#fff;">Panerai-PhotoWall</h1> -->
			<div><img src="imgs/admin_header.jpg"></div>
            <strong class="total">Total : <?php echo $rowcount;?></strong>

			<table id="example" class="display dataTable no-footer" cellspacing="0" width="100%" role="grid" aria-describedby="example_info" style="width: 100%; margin-bottom:30px">
				<thead style="color:#fff">
				<tr role="row">
					<th>ID</th>
					<th>PROFILE</th>
					<th>NAME</th>
					<th>PICTURE</th>
					<th>CONTENT</th>
					<th>STATUS</th>
				</tr>
				</thead>

				<tbody>
				        
				<?php
				if(count($rs)==0){
					echo '<tr role="row" class="even"><td align="center" colspan=7>暂无数据</td></tr>';
				}else{
					for($i=0;$i<count($rs);$i++){
				?>
					<tr  role="row" class="<?php if($i%2==0) echo 'even'; else echo 'odd';?>">
					<td align="center"><?php echo $rs[$i]['id']; ?></td>
					<td align="center"><img src="<?php echo $rs[$i]['headimgurl']; ?>" width="50"></td>
					<td align="center"><?php echo $rs[$i]['nickname']; ?></td>
					<td align="center"><img class="wImg" src="<?php echo $rs[$i]['url']; ?>" width="100"></td>
					<td align="center"><?php echo $rs[$i]['content']; ?></td>
					<td align="center"><input  onclick="check(<?php echo $rs[$i]['id']?>)" id="check_<?php echo $rs[$i]['id']?>" style="cursor:pointer" type="button" value="<?php echo $rs[$i]['status']==1?'approved':'unapproved'; ?>"></td>
					</tr>

					<?php     
					}
				}
				?> 

				</tbody>

			</table>

			<center style="color: #fff;"><?php echo $page->show(5);?></center> 
			<strong style="color: #fff;">Total : <?php echo $rowcount;?></strong> 

		</section>
	</div>
	<div id="showpic">
		<div class="showPic_con"></div>
	</div>


	<script type="text/javascript">
		
		$(".wImg").click(function(){
			$("#showpic").show();
			var wimgSrc = $(this).attr("src");
			getBImg(wimgSrc);
		})
		function getBImg(imgsrc){
			var wimg = new Image();
			wimg.src = imgsrc;
			wimg.onload = function(){
				$(".showPic_con").html(wimg);
				$(".showPic_con").css({"margin-top": -parseInt($(".showPic_con").css("height"))/2})
			}
		}

		$("#showpic").click(function(event){
			$(this).hide();
			$(".showPic_con").html("");
			event.stopPropagation();
			return false;
		})

		$("#showpic img").click(function(event){
			event.stopPropagation();
			return false;
		})
		

	</script>


</body>
</html>