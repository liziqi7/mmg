<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0,minimal-ui">
    <title>欢迎来到辣妈科技</title>
    <link rel="stylesheet" href="resource/css/code-index.css?123"/>
    <script type="text/javascript" src="module/lib/Jser.js"></script> 
    <script type="text/javascript" src="resource/js/jweixin-1.0.0.js"></script>
    <script type="text/javascript" src="resource/js/weixinshare.js"></script>
    <script type="text/javascript" src="module/lib/sea.js"></script>
    <script type="text/javascript" src="module/lib/seajs-text.js"></script>
    <script type="text/javascript">
     seajs.config({
            base: './module',
            alias: {
                //基础库
                'underscore': 'lib/underscore',
                'backbone': 'lib/backbone',
                '$': 'lib/jquery'
            }
    });
    var ST = {
        PATH:{
            ACTION:"http://www.lamakeji.com/mamago/index.php/",
            ROOT:"/api",
            IMAGE:"/resource/images/",
            UPLOAD:"",
            SHARE:"http://www.lamakeji.com/mamago/html/share/share.html",
            AJAXIMG:"http://www.lamakeji.com/mamago/uploads/"
        }
    }
    </script>
</head>
<body>
    <div class="wrap js-wrapper">
        <div id="js-wrap"></div>
        <ul class="nav flex-equal vishide" id="js-navs">
            <li class="on">
                <a href="#index/index">
                    <i class="nav-icon icon-index"></i>
                    <span class="nav-txt">首页</span>
                </a>
            </li>
            <li>
                <a id="js-qingdan-nav" href="#qingdan/index/idx:1"><i class="nav-icon icon-qingdan"></i><span class="nav-txt">清单</span></a>
            </li>
            <li>
                <a href="#go/index"><i class="nav-icon icon-go"></i><span class="nav-txt">go</span></a>
            </li>
            <li>
                <a href="#wode/index"><i class="nav-icon icon-wode"></i><span class="nav-txt">我的</span></a>
            </li>
        </ul>
        <div class="pop loading hide" id="js-loading">
            <div class="load-png">
                <img src="resource/images/shuxin.gif" style="vertical-align:middle">&nbsp;&nbsp;奋力加载中...</div>
        </div>
    </div>
    <div class="weixin_share js-weixin_share">
        <img src="resource/images/share.png" class="share" />        
    </div>
    <div class="tpl hide">
        <div id="js-pop-tpl">
            <div class="pop">
                <div class="pop-inner">
                    <div class="pop-msg js-pop-txt"></div>
                    <div class="pop-btn-box flex-equal">
                        <a href="javascript:;" class="js-close" data-uid="123456">好</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script  type="text/javascript">   
    seajs.use('app.js', function(app) {
        app.run();
         // loadlogin();
        loadwxconfig();
    });
    function hideLoad() {
        setTimeout(function() {
            $("#js-loading").hide();
        }, 300);
    };

    function scrollTop() {
        setTimeout(function() {
            window.scrollTo(0, 0);
        }, 100)
    };
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取当前月份的日期
        var d = dd.getDate();
        return y + "-" + m + "-" + d;
    }
    function loadlogin(){
        // location.href="http://www.lamakeji.com/mamago/index.php/weixin/getAuth";
        
        Jser.getJSON("http://www.lamakeji.com/mamago/index.php/weixin/authCallback?code=0210e8c12bbb6e2016c8c2d694ae708S&state=123","", function(data) {
            // setwxconfig(data);
            alert(JSON.stringify(data))
        }, function(data) {
            alert(JSON.stringify(data))
            // setwxconfig(data);
        }, "get", "json", true)
    }
    function doQingDanNav(){
        var xinxistatusindex=Jser.getItem("xinxistatus");
        // 备孕
        if(xinxistatusindex==0||xinxistatusindex==""){
            $("#js-qingdan-nav").attr("href","#qingdan/index/idx:1");
        }else if(xinxistatusindex==1){
            $("#js-qingdan-nav").attr("href","#qingdan/index/idx:3");
        }else{
            // 宝宝已出生
            $("#js-qingdan-nav").attr("href","#qingdan/index/idx:5");
        }
    }
    // 获取微信基本信息
    function loadwxconfig() {
        //http://www.lamakeji.com/mamago/index.php/weixin/getAuth
        Jser.getJSON("http://www.lamakeji.com/mamago/index.php/weixin/getShareSign","", function(data) {
            setwxconfig(data);
            // alert(JSON.stringify(data))
        }, function(data) {
            // alert(JSON.stringify(data))
            setwxconfig(data);
        }, "get", "json", true)
    };
    
    function setwxconfig(data){
        if (window.wx) {
                // wx.config(data);
                wx.config({
                 debug: false,
                 appId: data.share.app_id,
                 timestamp: data.share.timestamp,
                 nonceStr: data.share.noncestr,
                 signature: data.share.sign,
                 jsApiList: [
                     'onMenuShareTimeline',
                     'onMenuShareAppMessage'
                     // 'onMenuShareQQ',
                     // 'onMenuShareWeibo',
                     // 'getNetworkType'
                 ]
                });
                weixin6();
                // wx.error(function(res) {
                //    loadwxconfig();
                // });
            }
    }
    </script>
</body>

</html>