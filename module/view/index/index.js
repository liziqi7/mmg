define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/index/index.html');
	var list_tpl = require('text!../../../tpl/index/view/list.html');
	var model = new M({
		pars: {
			"pageNo": "1"
		}
	});
	var indexSelf;
	var V = B.View.extend({
		model: model,
		template: H,
		isEnableLoadData: true,
		iTimer: null,
		isLoad: true,
		pageNo: 1,
		totalPage: 1,
		events: {

		},
		initialize: function() {
			var t = this;
			indexSelf = this;
			t.render();
			// t.listenToOnce(t.model, "change:data", function() {
			// 	t.render();
			// 	t.listenTo(t.model, "sync", function() {
			// 		t.syncRender();
			// 	});
			// });
		},
		//待优化
		render: function() {
			var t = this,
				data ={};// t.model.toJSON();
			var html = _.template(t.template, data);
			// t.totalPage = data.totalPage;
			t.$el.show().html(html);
			t.bindEvent();
			// t.syncRender();
		},
		syncRender: function() {
			var t = this,
				data = t.model.toJSON();
			var _html = _.template(list_tpl, data);
			t.$el.find(".js-list").append(_html);
			Jser.loadimages(".js-list");
		},
		bindEvent: function() {
			var t = this;
			t.killScroll(true);
			$(window).on("scroll", t.doScroll);
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
				$(window).off('scroll', t.doScroll);
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
		// model.set({
		// 	action: 'http://myyglah.duapp.com/front/index.action?pageNo=0'
		// });
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})