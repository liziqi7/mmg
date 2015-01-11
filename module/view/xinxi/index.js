define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/xinxi/index.html');

	var V = B.View.extend({
		template: H,
		events: {
			"click .js-back": "goback"
		},
		initialize: function() {
			var t = this;
			t.render();
			t.bindEvent();
		},
		//待优化
		render: function() {
			var t = this,
				data = {};
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		bindEvent: function() {
			var t = this;
			var $li = t.$el.find(".js-xinxi-status li");
			$li.on("mousedown", function() {
				var index = $(this).index();
				$li.each(function(i) {
					if (index != i) {
						$(this).removeClass("on");
					}
				});
				$(this).toggleClass("on");
			});
			var $ligender = t.$el.find(".js-xinxi-gender li");
			$ligender.on("mousedown", function() {
				var index = $(this).index();
				$ligender.each(function(i) {
					if (index != i) {
						$(this).removeClass("on");
					}
				});
				$(this).toggleClass("on");
			});
		},
		goback: function() {
			var t = this;
			if (window.history && window.history.length > 2) {
				window.history.back();
			} else {
				window.location.href = "#";
			}
		}
	});
	return function(pars) {
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})