define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/qdlist/index.html');

	var model = new M({
		// action: 'http://myyglah.duapp.com/front/queryBeauticianWorks.action'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-back": "goback",
			"click .js-qdlist-radio": "doRadio",
			"click .js-sure":"doSure"
		},
		initialize: function() {
			var t = this;
			t.render();
			// t.listenTo(t.model, "sync", function() {
			// 	t.render();
			// });
		},
		//待优化
		render: function() {
			var t = this,
				data = {} // t.model.toJSON();
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		goback: function() {
			var t = this;
			if (window.history && window.history.length > 2) {
				window.history.back();
			} else {
				window.location.href = "#shangpin/index/pid:" + t.model.get("pars")["pid"];
			}
		},
		doRadio: function(e) {
			var t = this;
			var $elem = $(e.currentTarget);
			var checked = Number($elem.attr("data-checked"));
			checked = checked ? 0 : 1;
			if (checked == 1) {
				t.$el.find(".qd-icon").removeClass("qd-icon-on");
				t.$el.find(".js-qdlist-radio").attr("data-checked", "0");
				$elem.find(".qd-icon").addClass("qd-icon-on");
				$elem.attr("data-checked", checked);
			}
		},
		doSure:function(){
			var t=this;
			Jser.alert("保存成功",function(){
				t.goback();
			});
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
		// 	pars: {
		// 		beauticianID: pars.beauticianID,
		// 		worksID: pars.worksID
		// 	}
		// });
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})