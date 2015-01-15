define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');

	var H = require('text!../../../tpl/shangpin/index.html');

	// var Slider = require("view/shangpin/view/slider");


	var list_tpl = require('text!../../../tpl/shangpin/view/list.html');

	var model = new M({
		action: 'product/productByPid'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-back": "goback",
			"click .js-share": "doShare",
			"click .js-praise": "doPraise"
		},
		initialize: function() {
			var t = this;
			indexSelf = this;
			t.listenToOnce(t.model, "change:data", function() {
				t.render();
				// t.listenTo(t.model, "sync", function() {
				// 	t.syncRender();
				// });
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			data.data = data.data[0];
			if (!data.data.pictureList) {
				data.data.pictureList = [];
				data.data.pictureList.push(data.data.picture);
			}
			var html = _.template(t.template, data);
			t.$el.show().html(html);


			// 轮播图
			// new Slider({
			// 	el: t.$el.find(".js-slider-box")
			// });
			t.bindEvent();
			Jser.loadimages();
		},
		syncRender: function() {
			var t = this,
				data = t.model.toJSON();
			var _html = _.template(list_tpl, data);
			t.$el.find(".js-index-list").append(_html);
			Jser.loadimages();
		},
		goback: function() {
			var t = this;
			if (window.history && window.history.length > 2) {
				window.history.back();
			} else {
				window.location.href = "#";
			}
		},
		doShare: function() {
			var t = this;
			var fid = t.model.get("pars")["pid"];
			var url = ST.PATH.SHARE + "?fid=" + fid;
			Jser.share({
				imgUrl: "",
				lineLink: url,
				shareTitle: "妈咪口袋:" + Jser.getItem("fid" + fid),
				descContent: ""
			});
		},
		doPraise: function() {
			var t = this;
			var pid = t.model.get("pars")["pid"];
			var _data = {
				"pid": pid,
				"user_id": Jser.getItem("user_id")
			}
			Jser.getJSON(ST.PATH.ACTION + "product/productAddGood", _data, function(data) {
				// var data = {
				// 	code: 0
				// 	data: true
				// 	product_id: "178"
				// 	user_id: "3"
				// }
				if (Number(data.code) == 0) {
					var txt = "点赞";
					Jser.alert(txt);
				}

			}, function() {

			}, "post");
		},
		bindEvent: function() {
			var t = this;
			t.killScroll(true);
			$(window).on("scroll.index", t.doScroll);
			var $li = t.$el.find(".js-tab li");
			var $hlli = t.$el.find(".js-tab-highlight li");
			var $content = t.$el.find(".js-tab-content")
			$li.click(function() {
				if (!$(this).hasClass("on")) {
					var idx = $(this).index();
					var otherIdx = idx ? 0 : 1;
					$li.eq(otherIdx).removeClass("on");
					$hlli.eq(otherIdx).removeClass("on");
					$content.eq(otherIdx).hide();

					$(this).addClass("on");
					$content.eq(idx).show();
					$hlli.eq(idx).addClass("on");
				}
			});
		},
		doScroll: function() {
			var t = indexSelf;
			if (!t.iTimer && t.isEnableLoadData && t.isLoad && (window.location.hash == "" || window.location.hash.indexOf("#index/index") != -1)) {
				t.iTimer = setTimeout(function() {
					if ($(document).height() - $("body").scrollTop() - $(window).height() < 100) {
						t.loadData();
					}
					t.clearTime();
				}, 200);
			}
			t.killScroll();
		},
		loadData: function() {
			var t = this;
			t.pageNo++;
			if (t.pageNo <= t.totalPage) {
				var pars = {
					"pageNo": t.pageNo
				}
				t.changePars(pars);
			} else {
				t.overScroll();
			}
		},
		clearTime: function() {
			var t = this;
			if (t.iTimer) {
				clearTimeout(t.iTimer);
			}
			t.iTimer = null;
		},
		killScroll: function(isKill) {
			var t = this;
			if ((!t.isEnableLoadData && (window.location.hash == "" || window.location.hash.indexOf("#index/index") != -1)) || !!isKill) {
				$(window).off('scroll.index', t.doScroll);
				t.clearTime();
			}
		},
		overScroll: function() {
			var t = this;
			t.isEnableLoadData = false;
			t.$el.find(".js-list-loading").hide();
			t.isLoad = false;
			t.killScroll(true);
		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.model.set("pars", data);
		}
	});
	return function(pars) {
		model.set({
			pars: {
				"pid": pars.pid,
				"user_id": Jser.getItem('user_id')
			}
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})