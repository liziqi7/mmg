define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/qingdan/index.html');
	var list_tpl = require('text!../../../tpl/qingdan/view/list.html');
	window.global_qd_type = 0;
	var model = new M({
		action: 'product/productTypeUserList'
	});
	/* 
		-365,-280备孕~0周
		-280,-189 0~12周
		-189,-77 13~28周
		-77,0 29~40周
		0,30 出生~满月
		30,100 满月~百天
		100,182 百天~半岁
		182,365 半岁~一岁
		365,547 一岁~一岁半
		547,730 一岁半~两岁
		730,1095 两岁~三岁
	*/
	var qdmap = {
		"1": ["-365", "-280", "备孕", "0周", "1"],
		"2": ["-280", "-189", "0周", "12周", "2"],
		"3": ["-189", "-77", "13周", "18周", "3"],
		"4": ["-77", "0", "19周", "出生", "4"],
		"5": ["0", "30", "出生", "满月", "5"],
		"6": ["30", "100", "满月", "百天", "6"],
		"7": ["100", "182", "百天", "半岁", "7"],
		"8": ["182", "365", "半岁", "一岁", "8"],
		"9": ["365", "547", "一岁", "一岁半", "9"],
		"10": ["547", "730", "一岁半", "两岁", "10"],
		"11": ["730", "1095", "两岁", "三岁", "11"]
	};
	// var indexSelf;
	var V = B.View.extend({
		model: model,
		template: H,
		idx: "1",
		// iTimer: null,
		// isLoad: false, // 当加载数据的时候 禁止使用滑动加载 ,默认是false 即没有加载数据
		// totalSize: 6, // 每次显示的个数
		// page: 1, // 分页
		// totalPage: 1, // 总页数
		events: {
			"click .js-qd-left": "doLeft",
			"click .js-qd-right": "doRight",
			// "click .qd-top-btn": "doSwitchQingdan",
			"click .js-qd-checked": "doCheckdQingdan",
			// "click .js-dropdown": "doDropdown"
		},
		initialize: function() {
			var t = this;
			// indexSelf = this;
			t.listenTo(t.model, "sync", function() {
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
			t.idx = t.model.get("pars")["idx"];
			data.qdmap = qdmap[t.idx];
			var html = _.template(t.template, data);
			// t.totalPage = Number(data.totalPage);
			t.$el.show().html(html);
			Jser.loadimages(t.$el);
			// t.bindEvent();
			t.$el.find(".js-dropdown").change(function() {
				var type = $(this).find("option:selected").attr("data-type");
				t.doDropdown(type);
			});
		},
		doLeft: function() {
			var t = this;
			var idx = Number(t.idx);
			idx--;
			if (idx < 1) {
				idx = "11";
			}
			t.changePars({
				"ptmin": qdmap[idx][0],
				"ptmax": qdmap[idx][1],
				"idx": idx
			});
			global_qd_type = 0;
		},
		doRight: function() {
			var t = this;
			var idx = Number(t.idx);
			idx++;
			if (idx > 11) {
				idx = "1";
			}
			t.changePars({
				"ptmin": qdmap[idx][0],
				"ptmax": qdmap[idx][1],
				"idx": idx
			});
			global_qd_type = 0;
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
			// var t = this;
			// var $elm = $(e.currentTarget);
			// var type = $elm.attr("data-type");


		},
		doCheckdQingdan: function(e) {
			var $elm = $(e.currentTarget);
			var ptid = $elm.attr("data-ptid");
			$elm = $elm.parent();
			var _data = {
					"user_id": Jser.getItem('user_id'),
					"ptid": ptid
				},
				url = "product/productTypeUserAdd";
			if ($elm.hasClass("on")) {
				url = "product/productTypeUserDelete";
			}
			$elm.toggleClass("on");
			Jser.getJSON(ST.PATH.ACTION + url, _data, function(data) {
				
			}, function() {
				$elm.toggleClass("on");
			}, "post")
		},
		doDropdown: function(type) {
			var t = this;
			global_qd_type = type;
			t.model.fetchData();
		},
		bindEvent: function() {
			var t = this;
			t.finishScroll();
			$(window).off("scroll.qingdan").on("scroll.qingdan", t.doScroll);
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
				"user_id": Jser.getItem('user_id'),
				"ptmin": qdmap[pars.idx][0],
				"ptmax": qdmap[pars.idx][1],
				"idx": pars.idx
			}
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})