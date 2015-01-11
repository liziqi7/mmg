define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');	
	var H = require('text!../../../tpl/search/index.html');

	var list_tpl = require('text!../../../tpl/list/view/list.html');	

	var model = new M({
		action: 'resource/data/list.json'			
	});
	var searchSelf;
	var V = B.View.extend({
		model: model,
		template: H,
		isEnableLoadData: true,
		iTimer: null,
		isLoad: true,
		pageNo: 1,
		totalPage: 1,
		events: {
			"click .js-back": "goback",
			"click .js-search": "doSearch",
		},
		initialize: function() {
			var t = this;
			searchSelf = this;
			t.render();
			t.listenTo(t.model, "sync", function() {
				t.syncRender();
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, data);			
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
			t.totalPage =Number(data.totalPage);
			var _html = _.template(list_tpl, data);
			t.$el.find(".js-list-area").append(_html);
			Jser.loadimages(t.$el.find(".js-list-area"));
		},
		bindEvent: function() {
			var t = this;
			t.killScroll(true);
			$(window).on("scroll.search", t.doScroll);		
		},	
		doSearch:function(){
			var t=this;
			t.changePars({"pageNo":1});
		},	
		doScroll: function() {
			var t = searchSelf;
			if (!t.iTimer && t.isEnableLoadData && t.isLoad && window.location.hash.indexOf("#search/index") != -1) {
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
				t.$el.find(".js-list-loading").show();
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
			if ((!t.isEnableLoadData && window.location.hash.indexOf("#search/index") != -1) || !!isKill) {
				$(window).off('scroll.search', t.doScroll);
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
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})