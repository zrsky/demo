// //监听每个数据的变化
// function observe(data) {
//     if(!data || typeof data !== 'object') {
//         return;
//     }
//     Object.keys(data).forEach((item) => {
//         defineReactive(data, item, data[item]);
//     })
// }

// function defineReactive(data, key, val) {
//     var dep = new Dep();
//     //监听子属性
//     observe(val);
//     Object.defineProperty(data, key, {
//         get: function() {
//             Dep.target && dep.addSub(Dep.target);
//             return val
//         },

//         set: function(newVal) {
//             console.log('值发生改变了: ' + newVal);
//             val = newVal;
//             dep.notify();
//         }
//     })
// }


// // var data = {
// //     name: '张'
// // }

// // observe(data);
// // console.log(data.name)
// // data.name = '瑞'
// // console.log(data.name)

// function Dep() {
//     this.subs = []; //订阅者缓存列表
// }


// Dep.prototype = {
//     addSub: function(sub) {
//         this.subs.push(sub)
//     },
//     notify: function() {
//         this.subs.forEach((sub) => {
//             sub.update();
//         })
//     }
// }

// function Watcher(vm, exp, cb) {
//     this.vm = vm;
//     this.exp = exp;
//     this.cb = cb;
//     this.value = this.get();
// }

// Watcher.prototype = {
//     update: function() {
//         this.run();
//     },
//     run: function() {
//         var value = this.get(); //取到最新值
//         var oldVal = this.value;
//         if(oldVal !== value) {
//             this.value = value;
//             this.cb.call(this.vm, value, oldVal); //执行compile中绑定的回调函数， 更新视图
//         }
//     },
//     get: function() {
//         Dep.target = this; 
//         var value = this.vm.data[this.exp]; //触发getter  将自己添加在订阅器中
//         Dep.target = null;

//         return value;
//     }
// }

// function SelfVue (data, el, exp) {
//     this.data = data;
//     observe(data);
//     el.innerHTML = this.data[exp];
//     var w = new Watcher(this, exp, function(value) {
//         el.innerHTML = value;
//     });
//     return this;
// }


//监听数据变化
function observe(data) {
    if(!data || typeof data != 'object') {
        return
    }

    Object.keys(data).forEach((key) => {
        defineReactive(data, key, data[key])
    })
}

function defineReactive(data, key, val) {
    var dep = new Dep();
    observe(val);
    Object.defineProperty(data, {
        enumerable: true,
        configurable: false,  //不能再define
        get: function() {
            Dep.target && dep.addSubs(Dep.target)
            return val;
        },
        set: function(newVal) {
            if(val != newVal) {
                console.log('监听到值变化了: ' + val + '-->' + newVal);
                val = newVal
            }
        }

    })
}


//消息订阅器
function Dep() {
    this.subs = [];
}

Dep.prototype = {
    addSubs: function(sub) {
        this.subs.push(sub)
    },
    notify: function() {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}


//订阅者

function Watcher(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        var oldVal = this.value;
        var value = this.get(); //取到最新值
        if(oldVal != value) {
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        Dep.target = this;
        var value = this.vm[this.exp];
        Dep.target = null;
        return value;
    }
}


function selfVue(data, el, exp) {
    this.data = data;
    observe(data);
    el.innerHTML = this.data[exp];
    var w = new Watcher(this, exp, function(value) {
        el.innerHTML = value;
    })
}




