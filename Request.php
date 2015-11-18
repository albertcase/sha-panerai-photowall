<?php
	session_start();
	include_once('./config/database.php');
	include_once('./config/Pdb.php');
	$_POST = $_REQUEST;
	$db = Pdb::getDb();
	$tag = false;
	if (isset($_POST['model'])) {

		switch ($_POST['model']) {

			case 'login':
				$_SESSION["user_id"] = 1;
				exit;
				break;

			case 'islogin':
				if (!isset($_SESSION["user_id"])) {
					print json_encode(array("code" => 0, "msg" => "未登录"));
					exit;
				}
				print json_encode(array("code" => 1, "msg" => "已登录"));
				exit;
				break;

			case 'oauth':
				$url = isset($_POST['url']) ? $_POST['url']: $tag = true;
				if($tag){
					Header('Location:/');
					exit;
				}
				$_SESSION['callback'] = $url;
				$re_url = urlencode('http://'.$_SERVER['HTTP_HOST'].'/Request.php?model=callback');
				Header("Location:http://paneraiwx.eweixin.biz/WeChat/OAuth2.aspx?re_url=". $re_url. "&wxscope=snsapi_userinfo");
				exit;
				break;

			case 'callback':
				$openid = $_POST['openid'];
				$access_token = $_POST['access_token'];
				$user = $db->getRow('SELECT * FROM user WHERE openid = '. $db->quote($openid), true);
				if (!$user) {
					$userInfo = file_get_contents("https://api.weixin.qq.com/sns/userinfo?access_token=". $access_token. "&openid=". $openid. "&lang=zh_CN");
					$userInfo = json_decode($userInfo, true);
					$nickname = json_encode(array('name' => $userInfo['nickname']));
					$sql = "INSERT INTO user SET openid = ". $db->quote($openid). ", nickname = ". $db->quote($nickname). ", headimgurl = ". $db->quote($userInfo['headimgurl']);
					$db->execute($sql);
					$_SESSION['user_id'] = $db->lastInsertId;
				} else {
					$_SESSION['user_id'] = $user['id'];
				}
				Header("Location:". $_SESSION['callback']);
				exit;
				break;

			case 'saveimg':
				if (!isset($_SESSION["user_id"])) {
					print json_encode(array("code" => 0, "msg" => "未登录"));
					exit;
				}
				$image = isset($_POST['image']) ? $_POST['image'] : $tag = true;		
				$content = isset($_POST['content']) ? $_POST['content'] : $tag = true;
				if ($tag) {
					print json_encode(array("code" => 2, "msg" => "请填写必填项"));
					exit;
				}
				$image = str_replace("data:image/jpeg;base64,", "", $image);
				$image = str_replace("data:image/png;base64,", "", $image);
				$image = str_replace(' ', '+', $image);
				$image = base64_decode($image);
				if (empty($image)) {
					print json_encode(array('code' => 3, 'msg' => '请上传图片'));
					exit;
				}
				$filename = date('His') . rand(100,999) . '.jpg';

				$folder = 'upload/base/'. date("Ymd"). '/';
				if (!is_dir($folder)) {        	
					if(!mkdir($folder, 0777, true))	
					{	
						throw new Exception('创造文件夹失败...');
					}
					chmod($folder, 0777);
				}

				$handle = fopen($folder. $filename, 'w');
				fwrite($handle, $image);
				fclose($handle);
				$img = $folder. $filename;

				$im = ImageCreateFromJpeg($img);
				imagefilter($im, IMG_FILTER_GRAYSCALE);
				//imagefilter($im, IMG_FILTER_BRIGHTNESS, 70);
				//imagefilter($im, IMG_FILTER_CONTRAST, 30);

				list($widthbg, $heightbg)=getimagesize($img);

				//相框
				$tpl = "imgs/mask.png";
				$bgtpl = ImageCreateFromPng($tpl);
				//imagefilter($bgtpl, IMG_FILTER_COLORIZE, 199, 186, 162);
				//imagefilter($bgtpl, IMG_FILTER_BRIGHTNESS, -50);
				//imagefilter($bgtpl, IMG_FILTER_CONTRAST, 50);
				list($widthtpl, $heighttpl) = getimagesize($tpl);

				//相框合成到背景
				imagecopyresized($im, $bgtpl, 0, 0, 0, 0, $widthbg, $heightbg, $widthtpl, $heighttpl); 
				//imagefilter($im, IMG_FILTER_COLORIZE, 0, 0, 0);
				//imagefilter($im, IMG_FILTER_GRAYSCALE);
				//生成图片
				$folder = 'upload/gray/'.date("Ymd").'/';
				if(!is_dir($folder)){        	
					if(!mkdir($folder, 0777, true))	
					{	
						throw new Exception('创造文件夹失败...');
					}
					chmod($folder,0777);
				}
				$fileName = $folder. time() . rand(100,999) . '.png';
				ImagePng($im, $fileName);
				
				//存储
				$sql = "INSERT INTO photo SET type = 'user', uid = ". $_SESSION["user_id"]. ", url = ". $db->quote($fileName). ",content = ". $db->quote($content). ", created = ". time();
				$db->execute($sql);
				print json_encode(array("code"=>1,"msg"=>$db->lastInsertId));
				exit;
				break;

			case 'photolist':
				$type = isset($_POST['type']) ? $_POST['type'] : $tag = true;
				if ($tag) {
					print json_encode(array("code" => 2, "msg" => "请填写必填项"));
					exit;
				}
				if ($type == 'user') {
					$where = "type = 'user'";
				} else if ($type == 'my') {
					$where = "uid = '". $_SESSION["user_id"]. "'";
				} else {
					$where = "1";
				}
				$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
				$row = isset($_POST['row']) ? intval($_POST['row']) : 10;
				$pageIndex = ($page - 1) * $row;
				$totalSql = "select count(*) from photo where $where";
				$total = $db->getOne($totalSql);
				$totalpage = ceil($total/$row);
				$sql = "select a.*,b.nickname,b.headimgurl from photo,user where photo.uid = user.id and $where order by photo.id desc limit $pageIndex,$row";
				$result = $db->getAll($sql, true);
				include_once('./config/emoji.php');
				for ($i = 0; $i < count($result); $i++) {
					$name = json_decode($result[$i]['nickname'], true);
					$result[$i]['nickname'] = emoji_unified_to_html($name['name']);
				}
				echo json_encode(array('code' => 1, 'msg' => $result, 'totalpage' => $totalpage, 'nowIndex' => $page, 'total' => $total));
				exit;
				break;

			case 'photolistbyid':
				$id = isset($_POST['id']) ? intval($_POST['id']) : $tag = true;
				if ($tag) {
					print json_encode(array("code" => 2, "msg" => "请填写必填项"));
					exit;
				}
				$sql = "select a.*,b.nickname,b.headimgurl from photo,user where photo.uid = user.id and photo.id = ".$id;
				$result = $db->getRow($sql, true);
				print json_encode(array("code" => 1, "msg" => $result));
				exit;
				break;

			case 'ballot':
				$id = isset($_POST['id']) ? intval($_POST['id']) : $tag = true;
				if ($tag) {
					print json_encode(array("code" => 2, "msg" => "请填写必填项"));
					exit;
				}
				$sql = "update photo set ballot = ballot + 1 where id = ".$id;
				$db->execute($sql);
				print json_encode(array("code" => 1, "msg" => "投票成功"));
				exit;
				break;

			case 'jssdk':
				$url = isset($_POST['url']) ? intval($_POST['url']) : $tag = true;
				if ($tag) {
					print json_encode(array("code" => 2, "msg" => "请填写必填项"));
					exit;
				}
				$request = "http://paneraiwx.eweixin.biz/weixinjs/SignWeiXinService.ashx?url=". $url;
				echo $result = file_get_contents($request);
				exit;
			default:
				# code...
				print json_encode(array("code"=>9999,"msg"=>"No Model"));
				exit;
				break;
		}
	}
	print "error";
	exit;