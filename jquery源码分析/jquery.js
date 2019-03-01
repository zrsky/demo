(function (window) {
	var _$ = window.$,
		_jquery = window.jquery;
	var jQuery = function () {
		return new jQuery.prototype.init();
	}
	jQuery.fn = jQuery.prototype = {
		init: function () {

		}
	}
	jQuery.extend = jQuery.fn.extend = function () {
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
		makeArray: function (arr) {
			var result = [];
			if (arr || arr.length >= 1) {
				return jQuery.merge(result, arr);
			}
		},
		//数组合并
		merge: function (arr1, arr2) {
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
	$.noConflict = function () {
		window.$ = _$;
		console.log($)
	}

})(this)


(function (window) {
	var jQuery = function () {
		return jQuery.prototype.init();
	}

	jQuery.prototype = jQuery.fn = {
		init: function () {

		}
	}

	jQuery.extend = jQuery.fn.extend = function () {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !isFunction(target)) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {

			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {

				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (jQuery.isPlainObject(copy) ||
							(copyIsArray = Array.isArray(copy)))) {

						if (copyIsArray) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = jQuery.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.prototype.init.prototype = jQuery.fn;

})(this)