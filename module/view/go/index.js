define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/go/index.html');

	var model = new M({
		// action: 'http://myyglah.duapp.com/front/queryBeauticianWorks.action'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {

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
				data = t.model.toJSON();
			// data.data.beauticianID=t.model.get("pars").beauticianID;
			var html = _.template(t.template, data);
			t.$el.show().html(html);
			var h = Math.max($(document).height() - t.$el.height() - 20, 20);
			t.$el.find(".js-go-new").css("transform", "translateY(" + h + "px)");
			t.bindEvent();
			// Jser.loadimages();
		},
		bindEvent: function() {
			var t = this;
			var aLi = t.$el.find(".js-go-list li");
			var start = {},
				isScrolling;
			aLi.on("touchstart", function(event) {
				var touches = event.originalEvent.touches[0];
				start = {

					// get initial touch coords
					x: touches.pageX,
					y: touches.pageY,

					// store time to determine touch duration
					// 获取开始时间戳
					time: +new Date

				};
				$(this).on("touchmove", move);
				$(this).on("touchend", end);
				isScrolling = undefined;
				// event.stopPropagation();
				// event.preventDefault();
				// return false;
			});

			function move(event) {
				var touches = event.originalEvent.touches[0];
				delta = {
						x: touches.pageX - start.x,
						y: touches.pageY - start.y
					}
					// event.preventDefault();
					// event.stopPropagation();

				if (typeof isScrolling == 'undefined') {
					isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
				}
				if (!isScrolling && Math.abs(delta.x) > 20 && Math.abs(delta.y) < 10) {
					var direction = delta.x < 0;
					if (direction) {
						t.translate(this, -100, 400);
					} else {
						t.translate(this, 100, 400);
					}


				}

			}

			function end() {
				$(this).off("touchmove", move);
				$(this).off("touchend", end);
			}

		},
		translate: function(elem, dist, speed) {

			var style = elem && elem.style;
			if (!style) return;

			style.webkitTransitionDuration =
				style.MozTransitionDuration =
				style.msTransitionDuration =
				style.OTransitionDuration =
				style.transitionDuration = speed + 'ms';
			// 3D加速
			style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
			style.msTransform =
				style.MozTransform =
				style.OTransform = 'translateX(' + dist + 'px)';

		},
		doNew: function() {

		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.model.set("pars", data);
		},
		changeId: function(pars) {
			var t = this;
			var pars = {
				"beauticianID": pars.beauticianID,
				"worksID": pars.worksID,
			}
			t.changePars(pars);
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