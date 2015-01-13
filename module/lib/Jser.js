window.Jser = {
    _guid: 1,
    /**
    获取唯一GUID
    * @return {Number} 返回唯一GUID
    * @static
    */
    getGUID: function() {
        return Jser._guid++;
    },
    loadimages: function(el) {
        el = el || "body";
        var lazy = $(el).find("[data-src]");
        lazy.each(function(i) {
            loadImg.call(this);
        });

        function loadImg() {
            var t = this;
            var source = t.getAttribute("data-src");
            var img = new Image();
            img.src = source;
            img.onload = function() {
                t.setAttribute("src", source);
                $(t).removeAttr("data-src");
            }
            img.onerror = function() {
                t.setAttribute("src", "resource/images/loadimg.png")
            }
        }
    },
    log: function(str) {
        window.console && window.console.log(str);
    },
    infoError: {
        "1": "系统出错",
        "100": "注册用户名已存在",
        "101": "登陆用户名不存在",
        "102": "登陆密码错误",
        "110": "该用户已对该商品点过赞"
    },
    setItem: function(key, name) {
        window.localStorage.setItem(key, name);
    },
    getItem: function(key) {
        return window.localStorage.getItem(key) || "";
    },
    getJSON: function(url, data, sfn, errfn, method, datatype) {
        var t = this,
            _data = "";
        data = data || {};
        if (typeof data == "string") {
            _data = "&iTime=" + (new Date()).getTime() + "&";
        } else {
            _data = data;
            _data.iTime = (new Date()).getTime();
        }
        $("#js-loading").show();
        $("body").queue(function() {
            $.ajax({
                type: method || "get",
                dataType: datatype || 'json',
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                url: url,
                data: _data || "",
                error: function(e, xhr, opt) {
                    $("#js-loading").hide();
                    $("body").dequeue();
                    if (xhr == "abort") {
                        Jser.log("abort");
                        return;
                    } else {
                        e.url = url;
                        e.data = _data;
                        Jser.log("e:" + e + "xhr:" + xhr + "opt:" + opt);
                        errfn && errfn(e);
                    }
                },
                success: function(j) {
                    $("#js-loading").hide();
                    $("body").dequeue();
                    if (!j) Jser.log("no value has returned!")
                    var s = Number(j.code),
                        txt,
                        flag = false;
                    if (s != 0 && t.infoError[s]) {
                        txt = t.infoError[s];
                        Jser.alert(txt);
                    }
                    switch (s) {
                        case 0:
                            flag = true;
                            break;
                        case 1:
                            Jser.log("code:" + j.code + " " + txt);
                            break;
                    }
                    if (flag) {
                        sfn && sfn(j);
                    } else {
                        errfn && errfn(j);
                    }
                }
            });
        });
    },
    checklogin: function(data) {
        if (data.code == 100) {

        }
    },
    error: function(elem, txt) {
        $(elem).show().find("span").text(txt);
        scrollTop();
    },
    alert: function(txt, callback) {
        var $pop = $("#js-pop-tpl").find(".pop").clone();
        var uid = Jser.getGUID();
        $pop.find(".js-pop-txt").html(txt);
        $pop.find(".js-close").attr("data-uid", uid);
        $pop.attr("id", "js-pop" + uid);
        $(".js-wrapper").append($pop);
        $(".js-close").one('click', function() {
            var uid = $(this).data("uid");
            $("#js-pop" + uid).remove();
            $(document).trigger("closepop" + uid);
            callback && callback();
        });
        return uid;
    },
    confirm: function(txt, ok, cancel, callback) {
        var $pop = $("#js-pop-tpl").find(".pop").clone();
        var uid = Jser.getGUID();
        $pop.find(".js-pop-txt").html(txt);
        $pop.find(".js-close").attr("data-uid", uid).html("取消");
        var $clone = $pop.find(".js-close").clone();
        $clone.addClass("js-ok").html("好");
        $pop.find(".js-close").parent().append($clone);
        $pop.attr("id", "js-pop" + uid);
        $(".js-wrapper").append($pop);
        $pop.find(".js-close").one('click', function() {
            var uid = $(this).data("uid");
            $("#js-pop" + uid).remove();
            $(document).trigger("closepop" + uid);
            cancel && cancel();
        });
        $pop.find(".js-ok").one('click', function() {
            $(document).trigger("okpop" + uid);
            ok && ok();
        });
        callback && callback($pop);
        return uid;
    },
    share: function(params) {
        if ($.isEmptyObject(params)) {
            $.extend(WeiXinShare, params);
        }
        this.showShare();
    },
    showShare: function() {
        $(".js-weixin_share").show().on("mousedown.share", this.hideShare);
    },
    hideShare: function() {
        $(".js-weixin_share").hide().off("mousedown.share");
    }
}