(function(window) {
	var _$ = window.$,
		_jquery = window.jquery;
	var jQuery = function() {
		return new jQuery.prototype.init();
	}
	jQuery.fn = jQuery.prototype = {
		init: function() {

		}
	}
	jQuery.extend = jQuery.fn.extend = function() {
		var length = arguments.length;
		var target = arguments[0] || {};
		var i = 1;
		if (typeof target !== "object") {
			target = {};
		}
		if (length == i) {
			target = this;
			i--;
		}
		for (; i < length; i++) {
			for (var name in arguments[i]) {
				target[name] = arguments[i][name];
			}
		}
		return target
	}
	jQuery.extend({
		//类数组转换为数组
		makeArray: function(arr) {
			var result = [];
			if (arr || arr.length >= 1) {
				return jQuery.merge(result, arr);
			}
		},
		//数组合并
		merge: function(arr1, arr2) {
			var i = arr1.length,
				l = arr2.length;
			var j = 0;
			if (typeof arr2.length == "number") {
				for (; j < l; j++) {
					arr1[i++] = arr2[j];
				}
			} else {
				while (arr2[j] !== undefined) {
					arr1[i++] = arr2[j++];
				}
			}
			arr1.length = i;
			return arr1;
		}
	})

	jQuery.prototype.init.prototype = jQuery.fn
	window.$ = window.jQuery = jQuery;
	$.noConflict = function() {
		window.$ = _$;
		console.log($)
	}

})(this)