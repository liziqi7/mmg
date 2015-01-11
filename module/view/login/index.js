define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/login/index.html');

	var V = B.View.extend({
		template: H,
		events: {
			"click .js-back": "goback",
			"click .js-login-btn":"doLogin"
		},
		initialize: function() {
			var t = this;
			t.render();
		},
		//待优化
		render: function() {
			var t = this,
				data ={};
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		doLogin:function(){
			localStorage.setItem("login",1);
			window.location.href = "#index/index";
		},
		goback:function(){
			var t = this;
			if (window.history && window.history.length > 2) {
				window.history.back();
			} else {
				window.location.href = "#sign/index";
			}
		}
	});
	return function(pars) {
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})