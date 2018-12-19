function defineReactive(data, key, val) {
	observe(val); //递归遍历所有子元素
	var dep = new Dep();
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,
		get: function() {
			if(Dep.target) { //判断是否要添加订阅者
				dep.addSub(Dep.target); //在这里添加一个订阅者
			}
			return val;
		},
		set: function(newVal) {
			if(val === newVal) return;
			val = newVal;
			console.log('值变化了');
			dep.notify();
		}
	})
}

Dep.target = null;
function observe(data) {
	if(!data || typeof data != 'object') return;
	Object.keys(data).forEach((key) => {
		defineReactive(data, key, data[key]);
	})
}

// var library = {
// 	book1: {
// 		name: '',
// 	},
// 	book2: "",
// };

// observe(library);
// library.book1.name = "vue权威指南";
// library.book2 = '没有书籍';
// console.log(library.book1.name);
// console.log(library.book2);


// 需要创建一个可以容纳订阅者的消息订阅器Dep，订阅器Dep主要负责收集订阅者，然后再属性变化的时候执行对应订阅者的更新函数著作权归作者所有。
function Dep() {
	this.subs = [];
}
Dep.prototype = {
	addSub: function(sub) {
		this.subs.push(sub);
	},
	notify: function() {
		this.subs.forEach((sub) => {
			sub.update();
		})
	}
}