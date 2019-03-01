var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var a = 'helloworld';
a = 'sad';
var age = 23;
var stature = 1.61;
console.log(a);
console.log(age);
console.log(stature);
function tscript(name) {
    return name;
}
// var result:string = tscript('tscript')
// console.log('result: ' + result)
var getName = function (name) {
    return name;
};
var yangzi = '小胖';
function zhengXing() {
    // console.log(yangzi) //变量生命提升
    var yangzi = '张瑞';
    console.log(yangzi);
}
zhengXing();
var arr1 = [];
var arr2 = ['a', 'b'];
var arr3 = [true, false];
//元祖是一种特殊的数组，元祖类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
var arr4 = ['a', 10];
var something = "清早起来打开窗，心情美美的，我要出去找小姐姐，心情美美的。";
var xiaoJieJie = "小姐姐";
console.log(something.indexOf(xiaoJieJie));
console.log(something.substring(8));
console.log(something.replace('小姐姐', '小哥哥'));
console.log(something);
var d1 = new Date('2018/09/06 05:30:00');
var d2 = new Date('2018-09-06 05:30:00');
var d3 = new Date('2018-09-06T05:30:00');
console.log(d1);
console.log(d2);
console.log(d3);
var d = new Date(2018, 6, 12, 10, 10, 10);
console.log(d);
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;
console.log(c);
function createSquare(config) {
    var newSquare = { color: 'white', width: 12 };
    console.log(config);
}
var mySquare = {
    color: 'red',
    name: '正方形'
};
createSquare(mySquare);
var p1 = {
    x: 10,
    y: 20
};
var mySearch;
mySearch = function (source, subString) {
    var result = source.search(subString);
    return result > -1;
};
console.log(mySearch('asdasd', 'a'));
var Animal = /** @class */ (function () {
    function Animal(theName) {
        this.name = theName;
    }
    return Animal;
}());
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        return _super.call(this, '屁屁') || this;
    }
    Dog.prototype.getName = function () {
        console.log(this.name);
    };
    return Dog;
}(Animal));
var dog = new Dog();
dog.getName();
var Department = /** @class */ (function () {
    function Department(name) {
        this.name = name;
    }
    Department.prototype.printName = function () {
        console.log('Department name: ' + this.name);
    };
    return Department;
}());
var AccountingDepartment = /** @class */ (function (_super) {
    __extends(AccountingDepartment, _super);
    function AccountingDepartment() {
        return _super.call(this, 'Accounting and Auditing') || this;
    }
    AccountingDepartment.prototype.printMeeting = function () {
        console.log('The Accounting Department meets each Monday at 10am.');
    };
    AccountingDepartment.prototype.generateReports = function () {
        console.log('Generating accounting reports...');
    };
    return AccountingDepartment;
}(Department));
var department; // 允许创建一个对抽象类型的引用
// department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports();
