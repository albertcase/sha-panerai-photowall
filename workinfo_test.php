<?php
    session_start();
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
    $sql = "select  a.*,b.nickname,b.headimgurl from (select * from photo  where id =".$id.") a left join user b on a.uid = b.id";
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
	<title>沛纳海</title>
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

    <script type="text/javascript">
        function isPC(){  
           var userAgentInfo = navigator.userAgent;  
           var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
           var flag = true;  
           for (var v = 0; v < Agents.length; v++) {  
               if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
           }  
           return flag;  
        }

        if(isPC()){
            window.location.href = "pc.html";
        }
    </script>

	<link rel="stylesheet" type="text/css" href="css/reset.css" />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="stylesheet" type="text/css" href="css/emoji.css" />
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script type="text/javascript" src="js/iscroll.js"></script>
</head>
<body>
<div class="disable"></div>


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

        <a href="rule.html" onclick="ga('send', 'event', '按钮', '点击', 'camera')" class="camera_icon">
            <img src="../imgs/camera_icon.png" />
        </a>
    </div>

    <!-- ipad -->
    <ul class="head_ipad">
        <li>
            <a href="index.html?type=all" onclick="ga('send', 'event', 'link', '点击', 'menu_wall_ipad')" title="臻品之墙">臻品之墙</a>
        </li>
        <li>
            <a href="index.html?type=home" onclick="ga('send', 'event', 'link', '点击', 'menu_collection_ipad')" title="魅力时计">魅力时计</a>
        </li>
    </ul>
    
</div>


<!-- menu -->
<div class="menuArea">
    <ul>
        <li>
            <a href="rule.html" onclick="ga('send', 'event', 'link', '点击', 'menu_start')" title="开启探索之旅">开启探索之旅</a>
        </li>
        <li>
            <a href="index.html?type=all" onclick="ga('send', 'event', 'link', '点击', 'menu_wall')" title="臻品之墙">臻品之墙</a>
        </li>
        <li>
            <a href="index.html?type=home" onclick="ga('send', 'event', 'link', '点击', 'menu_collection')" title="魅力时计">魅力时计</a>
        </li>
        <li>
            <a href="index.html?type=user" onclick="ga('send', 'event', 'link', '点击', 'menu_mine')" title="我与沛纳海">我与沛纳海</a>
        </li>
        <li>
            <a href="http://www.panerai.com/cn/network/boutiques.html " target="_blank" title="亲临品鉴">亲临品鉴</a> 
        </li>
    </ul>
</div>


<?php
if ($_SESSION['user_id'] == $result['uid']) {    
?>
    <!-- 自己的 -->
    <!-- 微信分享提示 -->
    <div class="wechatTips" style="display:none;">
        <img src="../imgs/wechat_tips.png" />
        <a href="javascript:;" class="wechatTips_close">
            <img src="../imgs/close.png" width="80%" />
        </a>
    </div>

<?php
} else {
?>
    
<?php
}
?>



<!-- 二维码提示 -->
<div class="qrcode">
    <div class="qrcode_con">
        <img src="../imgs/qrcode.png" width="100%" />
    </div>

    <a href="javascript:;" class="qrcode_close">
        <img src="../imgs/close.png" width="80%" />
    </a>
</div>



 <div class="activeTips">
    <div class="activeTips_con">
        <img src="../imgs/ruleTips.png" class="ruleTipsContent" />
    </div>
    

    <div class="rulefooter">
        <a href="javascript:;" class="pupclose">
            <img src="../imgs/close.png" width="100%" />
        </a>
    </div>
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
                <?php
                if ($_SESSION['user_id'] == $result['uid']) {    
                ?>
                    <!-- 自己的 -->
                    <a href="javascript:;" class="timeline_btn">
                         <img src="../imgs/timeline_btn.jpg" width="100%" />
                    </a>

                <?php
                } else {
                ?>
                    <a href="rule.html" onclick="ga('send', 'event', '按钮', '点击', 'upload');" class="upload_btn">
                        <img src="../imgs/upload_btn.jpg" width="100%" />
                    </a>
                <?php
                }
                ?>

            </div>
            
        </div>

    </div>


</div>





<script type="text/javascript" src="js/public.js"></script>

<script type="text/javascript">
    ajaxfun("POST", "/Request.php?model=subscribe", "", "json", subscribefunc);

    function subscribefunc(data){
        if(data.result == "success" && data.jsonResponse == 0){
            $(".qrcode").show();
        }
    }
    
    // 投票
    var ballotdPushData = {
        "id": "<?php echo $id;?>"
    };

    $(".heart_icon").click(function(){
        
        if($(this).hasClass("hover")) return false;

        $(this).addClass("hover");
        
        ajaxfun("POST", "/Request.php?model=ballot", ballotdPushData, "json", ballotdCallback);
    })

    function ballotdCallback(data){
        var curPraise = $(".heart_icon").siblings("em").html();
        if(data.code == 1){
            $(".heart_icon").siblings("em").html(parseInt(curPraise)+1);
            alert("点赞成功！");
        }else{
            //console.log(data.msg);
        }
    } 

    $(".pupclose").click(function(){
        $(".activeTips").hide();
    })
    


    $(".timeline_btn").click(function(){
        $(".wechatTips").show();
        ga('send', 'event', '按钮', '点击', 'share');
    })

    $(".wechatTips_close").click(function(){
        $(".wechatTips").hide();
    })

    $(".qrcode_close").click(function(){
        $(".qrcode").hide();
    })

    
</script>


<?php
if ($_SESSION['user_id'] == $result['uid']) {    
?>
    <script type="text/javascript">
        $(function(){
            shareData = {
                title: '登临“臻品之墙”，分享你与沛纳海的 故事！',
                desc: '我的照片刚刚登上了沛纳海的“臻品之墙” 期待你的参与哦。',
                link: window.location.href,
                imgUrl: 'http://' + window.location.host + '/imgs/share.jpg'
            };
            editShare();
        })
    </script>

<?php
} else {
?>
    
<?php
}
?>


<script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-67689322-3', 'auto');
      ga('send', 'pageview');
</script>



</body>
</html>
