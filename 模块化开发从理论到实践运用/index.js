(function(root) {
	var modMap = {}; //缓存
	function requirejs(deps, callback) {
		console.log(deps)
		console.log(deps.length)
		if (deps.length === 0) {
			callback();
		}
		var depsLen = deps.length;
		var params = [];
		for (var i = 0; i < depsLen; i++) {
			(function(j) {
				loadMod(deps[i], function(param) {
					console.log(param)
					depsLen--;
					params[j] = param;
					if (depsLen === 0) {
						callback.apply(null, params);
					}
				})
			})(i)
		}
	}

	function loadMod(name, callback) {
		if (!modMap[name]) {
			modMap[name] = {
				status: 'loading'
			};
			//加载模块
			loadScript(name, function() {
				console.log(modMap[name].deps)
				requirejs(modMap[name].deps, function() {
					//执行当前被加载的模块
					execMod(name, callback);
				})
			});
		}
	}

	function loadScript(name, callback) {
		var doc = document;
		var node = doc.createElement('script');
		node.src = name + ".js";
		doc.body.appendChild(node);
		node.onload = function() {
			callback();
		}
	}

	function define(name, deps, callback) {

		modMap[name] = modMap[name] || {};
		modMap[name].deps = deps;
		modMap[name].status = "loaded";
		modMap[name].callback = callback;
		console.log(name)
	}

	function execMod(name, callback) {
		var exp = modMap[name].callback(); //exp接口对象
		modMap[name].exports = exp;
		callback(exp);
	}
	root.requirejs = requirejs;
	root.define = define;
})(this)