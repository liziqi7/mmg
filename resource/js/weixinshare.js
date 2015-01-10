var global_origin = window.location.origin || (window.location.protocol + '//' + window.location.hostname);
var WeiXinShare = {
  imgUrl: global_origin + "/image/icon.png", //注意必须是绝对路径
  lineLink: global_origin + "/", //同样，必须是绝对路径  
  shareTitle: document.title, //分享title
  descContent: document.title, //分享给朋友或朋友圈时的文字简介
  appid: "", //apiID，可留空
  img_width: "300",
  img_height: "300"
}

function shareFriend() {
  WeixinJSBridge.invoke('sendAppMessage', {
    "appid": WeiXinShare.appid,
    "img_url": WeiXinShare.imgUrl,
    "img_width": WeiXinShare.img_width,
    "img_height": WeiXinShare.img_height,
    "link": WeiXinShare.lineLink,
    "desc": WeiXinShare.descContent,
    "title": WeiXinShare.shareTitle
  }, function(res) {
    //_report('send_msg', res.err_msg);
  })
}

function shareTimeline() {
  WeixinJSBridge.invoke('shareTimeline', {
    "img_url": WeiXinShare.imgUrl,
    "img_width": WeiXinShare.img_width,
    "img_height": WeiXinShare.img_height,
    "link": WeiXinShare.lineLink,
    "desc": WeiXinShare.descContent,
    "title": WeiXinShare.shareTitle
  }, function(res) {
    //_report('timeline', res.err_msg);
  });
}

function shareWeibo() {
    WeixinJSBridge.invoke('shareWeibo', {
      "content": WeiXinShare.descContent,
      "url": WeiXinShare.lineLink,
    }, function(res) {
      //_report('weibo', res.err_msg);
    });
  }
  // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
  // 发送给好友
  WeixinJSBridge.on('menu:share:appmessage', function(argv) {
    shareFriend();
  });
  // 分享到朋友圈
  WeixinJSBridge.on('menu:share:timeline', function(argv) {
    shareTimeline();
  });
  // 分享到微博
  WeixinJSBridge.on('menu:share:weibo', function(argv) {
    shareWeibo();
  });
}, false);