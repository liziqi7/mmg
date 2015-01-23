define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/add/index.html');

	var model = new M({
		// action: 'http://myyglah.duapp.com/front/queryBeauticianWorks.action'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-add-sure": "doAddSure"
		},
		initialize: function() {
			var t = this;
			t.render();
		},
		//待优化
		render: function() {
			var t = this;
			t.$el.show().html(t.template);
		},
		doAddSure: function() {
			var t = this;
			var val = $.trim(t.$el.find(".js-add-val").val());
			if (val.length != 0) {
				Jser.log("保存:" + val);
				t.$el.find(".js-add-error").hide();
				window.location.hash = "#go/index";
			} else {
				t.$el.find(".js-add-error").show().find("span").text("请填写go单名称");
			}
		},
		changePars: function() {
			var t = this;
			t.$el.find(".js-add-val").val("");
			t.$el.show();
		}
	});
	return function(pars) {
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})