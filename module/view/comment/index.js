define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/comment/index.html');
	var list_tpl = require('text!../../../tpl/comment/view/list.html');
	var model = new M({
		pars: {
			"pageNo": "1"
		}
	});
	var commentSelf;
	var V = B.View.extend({
		model: model,
		template: H,
		isEnableLoadData: true,
		iTimer: null,
		isLoad: false,
		pageNo: 1,
		totalPage: 1,
		events: {
			"click .js-back": "goback"
		},
		initialize: function() {
			var t = this;
			commentSelf = this;
			t.listenToOnce(t.model, "change:data", function() {
				t.render();
				t.listenTo(t.model, "sync", function() {
					t.syncRender();
				});
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, data);
			t.totalPage = Number(data.totalPage);
			t.$el.show().html(html);
			t.bindEvent();
		},
		goback: function() {
			var t = this;
			if (window.history && window.history.length > 2) {
				window.history.back();
			} else {
				window.location.href = "#";
			}
		},
		syncRender: function() {
			var t = this,
				data = t.model.toJSON();
			t.isLoad = true;
			var _html = _.template(list_tpl, data);
			t.$el.find(".js-comment-list").append(_html);
			t.$el.find(".js-list-loading").hide();
			Jser.loadimages();
		},
		bindEvent: function() {
			var t = this;
			t.killScroll(true);
			$(window).on("scroll.comment", t.doScroll);
		},
		doScroll: function() {
			var t = commentSelf;
			if (!t.iTimer && t.isEnableLoadData && t.isLoad && (window.location.hash == "" || window.location.hash.indexOf("#comment/index") != -1)) {
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
				t.$el.find(".js-list-loading").show();
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
			if ((!t.isEnableLoadData && (window.location.hash == "" || window.location.hash.indexOf("#comment/index") != -1)) || !!isKill) {
				$(window).off('scroll.comment', t.doScroll);
				t.clearTime();
			}
		},
		overScroll: function() {
			var t = this;
			t.isEnableLoadData = false;
			t.$el.find(".js-list-loading").hide();
			t.isLoad = true;
			t.killScroll(true);
		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.isLoad = false;
			setTimeout(function() {
				t.model.set("pars", data);
			}, 3000);

		}
	});
	return function(pars) {
		model.set({
			action: 'resource/data/comment.json'
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})