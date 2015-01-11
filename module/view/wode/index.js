define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/wode/index.html');

	var model = new M();
	var V = B.View.extend({
		model: model,
		template: H,		
		events: {
			
		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		changePars: function() {
			var t = this;
			t.model.fetchData();
		}
	});
	return function(pars) {
		model.set({
			action: 'resource/data/wode.json'
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})