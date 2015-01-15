define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/qingdan/index.html');
	var list_tpl = require('text!../../../tpl/qingdan/view/list.html');

	var model = new M({
		action: 'product/productTypeUserList'
	});
	var indexSelf;
	var V = B.View.extend({
		model: model,
		template: H,

		iTimer: null,
		isLoad: false, // 当加载数据的时候 禁止使用滑动加载 ,默认是false 即没有加载数据
		totalSize: 6, // 每次显示的个数
		page: 1, // 分页
		totalPage: 1, // 总页数

		events: {
			"click .qd-top-btn": "doSwitchQingdan",
			"click .js-qd-checked": "doCheckdQingdan",
			"click .js-dropdown": "doDropdown"
		},
		initialize: function() {
			var t = this;
			indexSelf = this;
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
		syncRender: function() {
			var t = this,
				data = t.model.toJSON();
			t.isLoad = false;
			var _html = _.template(list_tpl, data);
			t.$el.find(".js-qingdan-list").append(_html);
			Jser.loadimages(t.$el);
		},
		doSwitchQingdan: function(e) {
			var t = this;
			var $elm = $(e.currentTarget);
			var type = $elm.attr("data-type");
			t.model.set("pars", {
				"type": type,
				"pageNo": "1"
			})
		},
		doCheckdQingdan: function(e) {
			var $elm = $(e.currentTarget).parent();
			var checked = Number($elm.attr("data-checked"));
			checked = checked ? 0 : 1;
			$elm.toggleClass("on", checked);
			$elm.attr("data-checked", checked);
		},

		bindEvent: function() {
			var t = this;
			t.finishScroll();
			$(window).on("scroll.qingdan", t.doScroll);
		},
		doScroll: function() {
			var t = indexSelf,
				hash = window.location.hash;
			if (!t.iTimer && !t.isLoad && hash.indexOf("#qingdan/index") != -1) {
				t.iTimer = setTimeout(function() {
					var size = Jser.documentSize();
					if (size.fullHeight - size.scrollTop - size.viewHeight < 20) {
						t.loadData();
					}
					t.clearTime();
				}, 200);
			}
		},
		loadData: function() {
			var t = this;
			t.page++;
			if (t.page <= t.totalPage) {
				var pars = {
					"pageNo": t.page
				}
				t.isLoad = true;
				t.$el.find(".js-list-loading").show();
				t.changePars(pars);
			} else {
				t.finishScroll();
			}
		},
		clearTime: function() {
			var t = this;
			if (t.iTimer) {
				clearTimeout(t.iTimer);
			}
			t.iTimer = null;
		},
		finishScroll: function() {
			var t = this;
			t.$el.find(".js-list-loading").hide();
			$(window).off('scroll.qingdan', t.doScroll);
			t.clearTime();
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
				"user_id": Jser.getItem('user_id')
			}
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})