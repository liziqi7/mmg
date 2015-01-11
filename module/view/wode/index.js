define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/wode/index.html');

	var model = new M();
	var V = B.View.extend({
		model: model,
		template: H,		
		events: {
			"click .js-sure":"doSure"
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
			t.bindEvent();
		},
		changePars: function() {
			var t = this;
			t.model.fetchData();
		},
		bindEvent:function(){
			var t=this;
			t.$el.find(".js-name").blur(function(){

			}).focus(function(){
				t.$el.find(".js-sure").show();
			});
		},
		doSure:function(e){
			var t=this;
			var $elem=$(e.currentTarget);
			if($elem.hasClass("modified")){
				$elem.removeClass("modified").text("保存");
				t.$el.find(".js-name").removeAttr("disabled").focus();
			}else{
				$elem.addClass("modified").text("修改");
				t.$el.find(".js-name").attr("disabled",true).blur();
			}

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