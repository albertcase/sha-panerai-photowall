<?php
    include_once('./config/database.php');
    include_once('./config/Pdb.php');
    include_once('./config/emoji.php');
    $_POST = $_REQUEST;
    $db = Pdb::getDb();
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    if (!$id) {
        Header("Location:/");
        exit;
    }
    $sql = "select a.*,b.nickname,b.headimgurl from photo a,user b where a.uid = b.id and a.id = ".$id;
    $result = $db->getRow($sql, true);
    if (!$result) {
        Header("Location:/");
        exit;
    }
    $name = json_decode($result['nickname'], true);
    $result['nickname'] = emoji_unified_to_html($name['name']);
?>
<!DOCTYPE HTML>
<html>
<head>
	<title>OFFICINE PANERAI</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="format-detection" content="telephone=no">
	<!--禁用手机号码链接(for iPhone)-->
	<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=0,minimum-scale=1.0,maximum-scale=1.0,minimal-ui" />
	<!--自适应设备宽度-->
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<!--控制全屏时顶部状态栏的外，默认白色-->
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="Keywords" content="">
	<meta name="Description" content="...">

	<link rel="stylesheet" type="text/css" href="css/reset.css" />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="stylesheet" type="text/css" href="css/emoji.css" />
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/iscroll.js"></script>
</head>
<body>



<div id="header">

    <a href="javascript:;" class="logo">
        <img src="../imgs/logo.png" width="100%" />
    </a>

    <!-- phone -->
    <div class="head_phone">
        <div class="menu">
            <div class="bit-1"></div>
            <div class="bit-2"></div>
            <div class="bit-3"></div>
        </div>

        <a href="rule.html" class="camera_icon">
            <img src="../imgs/camera_icon.png" />
        </a>
    </div>

    <!-- ipad -->
    <ul class="head_ipad">
        <li>
            <a href="index.html?type=all" title="臻品之墙">臻品之墙</a>
        </li>
        <li>
            <a href="index.html?type=home" title="魅力时计">魅力时计</a>
        </li>
    </ul>
    
</div>


<!-- menu -->
<div class="menuArea">
    <ul>
        <li>
            <a href="rule.html" title="开启探索之旅">开启探索之旅</a>
        </li>
        <li>
            <a href="index.html?type=all" title="臻品之墙">臻品之墙</a>
        </li>
        <li>
            <a href="index.html?type=home" title="魅力时计">魅力时计</a>
        </li>
        <li>
            <a href="index.html?type=user" title="我与沛纳海">我与沛纳海</a>
        </li>
        <li>
            <a href="http://www.panerai.com/cn/network/boutiques.html " target="_blank" title="亲临品鉴">亲临品鉴</a> 
        </li>
    </ul>
</div>


<!-- 微信分享提示 -->
<div class="wechatTips">
    <img src="../imgs/wechat_tips.png" />
    <a href="javascript:;" class="wechatTips_close">
        <img src="../imgs/close.png" width="80%" />
    </a>
</div>

<!-- 二维码提示 -->
<div class="qrcode">
    <div class="qrcode_con">
        <img src="../imgs/qrcode.png" width="100%" />
    </div>

    <a href="javascript:;" class="qrcode_close">
        <img src="../imgs/close.png" width="80%" />
    </a>
</div>




<div id="wrapp">
    <div id="scroller">

        <div class="inside_container">

            <div class="workInfo_Area">
                <div class="wa_header">
                    <span class="heart_icon">
                        <img src="../imgs/heart_icon.png" width="100%" />
                    </span> <em><?php echo $result['ballot']?></em> <span class="wechat_name"><?php echo $result['nickname']?></span>
                </div>
                <dl>
                    <dt>
                        <img src="<?php echo $result['url']?>" width="100%" />
                    </dt>
                    <dd>
                        <?php echo $result['content']?>
                    </dd>
                </dl>
            </div>
            

            <div class="infofooter">
                <a href="javascript:;" class="timeline_btn">
                     <img src="../imgs/timeline_btn.jpg" width="100%" />
                </a>
            </div>
            

        </div>

    </div>


</div>




<script type="text/javascript" src="js/public.js"></script>

<script type="text/javascript">
    $(".timeline_btn").click(function(){
        $(".wechatTips").show();
    })

    $(".wechatTips_close").click(function(){
        $(".wechatTips").hide();
    })

    $(".qrcode_close").click(function(){
        $(".qrcode").hide();
    })



</script>

</body>
</html>
