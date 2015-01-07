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
    getJSON: function(url, data, sfn, errfn, method, datatype) {
        data = data || {};
        var _data = "";
        if (typeof data == "string") {
            _data = "&iTime=" + (new Date()).getTime() + "&";
        } else {
            _data = data;
            _data.iTime = (new Date()).getTime();
        }
        $("#js-loading").hide();
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
                    var s = j.status || j.state,
                        flag = false;
                    switch (s.toLowerCase()) {
                        case "success":
                            flag = true;
                            break;
                        case "error":
                            Jser.log(j.info || j.message);
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
    alert: function(txt, callback) {
        var $pop = $("#js-pop-tpl").find(".pop").clone();
        var uid = Jser.getGUID();
        $pop.find(".js-pop-txt").text(txt);
        $pop.find(".js-close").attr("data-uid", uid);
        $pop.attr("id", "js-pop" + uid);
        $(".js-wrapper").append($pop);
        $(".js-close").one('click', function() {
            var uid = $(this).data("uid");
            $("#js-pop" + uid).remove();
            $(document).trigger("closepop" + uid);
            callback && callback();
        });
    }
}