var a = 'helloworld'
a = 'sad'
var age:number = 23
var stature:number = 1.61
console.log(a)
console.log(age)
console.log(stature)


function tscript(name:string):string{
    return name
}
// var result:string = tscript('tscript')
// console.log('result: ' + result)


var getName = function(name:string):string{
    return name
}

var yangzi = '小胖'
function zhengXing():void{
    // console.log(yangzi) //变量生命提升
    var yangzi:string = '张瑞';
    console.log(yangzi)
}
zhengXing()

let arr1:number[] = []
let arr2:Array<string> = ['a','b']
let arr3:Array<boolean> = [true, false]
//元祖是一种特殊的数组，元祖类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
let arr4:[string,number] = ['a', 10];


let something:string = "清早起来打开窗，心情美美的，我要出去找小姐姐，心情美美的。"
let xiaoJieJie:string = "小姐姐"
console.log(something.indexOf(xiaoJieJie))
console.log(something.substring(8))
console.log(something.replace('小姐姐','小哥哥'))
console.log(something)

let d1:Date = new Date('2018/09/06 05:30:00')
let d2:Date = new Date('2018-09-06 05:30:00')
let d3:Date = new Date('2018-09-06T05:30:00')
console.log(d1)
console.log(d2)
console.log(d3)
let d:Date = new Date(2018,6,12,10,10,10)
console.log(d)


enum Color {Red, Green, Blue}
let c: Color = Color.Green
console.log(c)

interface SquareConfig {
    color: string,
    width?: number,
    [propName: string]: any
}

function createSquare(config: SquareConfig){
    let newSquare = {color: 'white', width: 12}
    console.log(config)
}
let mySquare = {
    color: 'red',
    name: '正方形'
}

createSquare(mySquare)

interface Point {
    readonly x: number,  //只读属性
    readonly y: number
}

let p1: Point = {
    x: 10,
    y: 20
}

interface SearchFunc {
    (source: string, subString: string):boolean
}

let mySearch: SearchFunc
mySearch = function(source: string, subString: string) {  //函数的参数名不需要与接口里的名字相匹配
    let result = source.search(subString)
    return result > -1
}

console.log(mySearch('asdasd', 'a'))
  class Animal {
    //   private name: string;
      protected name: string;
      constructor(theName: string) {
          this.name = theName
      }
  }

  class Dog extends Animal {
      constructor() {
          super('屁屁')
      }
      getName() {
          console.log(this.name)
      }
  }

  let dog = new Dog()
  dog.getName()

  abstract class Department {
      constructor(public name: string){

      }

      printName():void {
          console.log('Department name: ' + this.name)
      }

      abstract printMeeting(): void
  }

  class AccountingDepartment extends Department {

    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}



let department: Department; // 允许创建一个对抽象类型的引用
// department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports();