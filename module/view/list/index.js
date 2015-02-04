define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/list/index.html');
	var list_tpl = require('text!../../../tpl/list/view/list.html');
	var model = new M({
		action: 'product/productListByFid'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-back": "goback",
			"click .js-share": "doShare",
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
			data.data.fdata = data.fdata;
			data.data.fid = t.model.get("pars")["fid"];
			data.data.guanzhu = t.model.get("pars")["guanzhu"];
			var html = _.template(t.template, data);
			t.$el.show().html(html);
			var _html = _.template(list_tpl, data);
			t.$el.find(".js-list-area").append(_html);
			Jser.loadimages(t.$el.find(".js-list-area"));
		},
		goback: function() {
			var t = this;
			if (window.history && window.history.length > 2) {
				window.history.back();
			} else {
				window.location.href = "#";
			}
		},
		doShare: function() {
			var t = this;
			var fid = t.model.get("pars")["fid"];
			var shareTitle = Jser.getItem("fid" + fid);
			var descContent = Jser.getItem("fdescribe" + fid) || "辣妈科技";
			var url = 'http://www.lamakeji.com/mamago/index.php/weixin/productShare?fid=' + fid + '&shareUserId=' + Jser.getItem("user_id") + '&tpid=4&topic=' + shareTitle + '&ftitle=' + descContent + '&from=singlemessage&isappinstalled=1';
			Jser.share({
				lineLink: url,
				shareTitle: shareTitle,
				descContent: descContent
			});
		},
		changePars: function(pars) {
			var t = this;
			t.model.set("pars", pars);
		}
	});

	return function(pars) {
		if (pars.guanzhu) {
			model.set({
				pars: {
					"fid": pars.fid,
					"guanzhu": pars.guanzhu
				}
			});
		} else if (pars.fid) {
			model.set({
				pars: {
					"fid": pars.fid
				}
			});
		}
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})