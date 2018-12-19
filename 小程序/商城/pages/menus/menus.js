const app=getApp(),
      dataRequest=require('../../utils/dataRequest.js'),
      utils=require('../../utils/util.js'),
      dataType=utils.dataType;

Page({
	data:{
    totalNum:0,
    totalPrice:0.0,
    flag:[true,false],
    leftMenu:[],
    rightContent:[],
    menusBox:[],
    mark:0,
    indexCache:"",
    preTotalNum:"",
    preTotalPrice:''
	},
	onLoad(){
		// 初始化页面数据

     let _this=this,menusBox=[];
     wx.setNavigationBarTitle({
      title: '快餐'
     })
    // 1.读取左面菜单项
    wx.getStorage({
      key:'menus',
      success(res){
      for(let i=0,len=res.data.length;i<len;i++){
        // console.log(res.data[i]);
        menusBox.push({
          leftMenu:res.data[i],
          rightContent:[],
          totalPrice:0.0
         })
        }
        _this.setData({
          leftMenu:res.data,
          menusBox:menusBox
        })



     // console.log(_this.data.menusBox);

    // 2.读取左面菜单项对应的内容项
        let param=+res.data[0].id;
        _this.data.indexCache=0;
        _this.setData({//初始化indexCache
          indexCache:_this.data.indexCache
        });
        dataRequest({
          urlParam:'/menu?menus='+param,//初始化rightContent
          callback(res){
           _this.setData({
             rightContent:res.menu
        })

        

    
    // 3.初始化menusBox,在原来menus的基础上新增btnNum和itemPrice
            let rightContent=_this.data.rightContent
            for(let i in rightContent){
              rightContent[i].btnNum=0;
              rightContent[i].itemPrice=(rightContent[i].btnNum)*(rightContent[i].price)
            }
            _this.setData({
              rightContent:rightContent
            });
  // 4.把菜单项和右边的内容项组合到一块，放到menusBox中，记录购买状态（每次改变都更新menuBox）
            menusBox[0].rightContent=rightContent;


            _this.setData({
              menusBox:menusBox
            })

             console.log(_this.data.menusBox);
          }
        })
      }
    })
    
    
    
    // 5.点击左面菜单项读取menuBox对应项加载到页面
   
		
	},
	btnNumUp(event){
  	// this.data.recommend.btnNum+=1;
  	// console.log(this.data.recommend);
  	let index=event.target.dataset.index,
        rightContent=this.data.rightContent,
        mark=this.data.mark,
        menusBox=this.data.menusBox;
        // console.log(rightContent);
  	rightContent[index].btnNum+=1;
    menusBox[mark].rightContent=rightContent
  	this.setData({
  		rightContent:rightContent,
      menusBox:menusBox
  	})
  	this.calTotalNum();
    console.log(this.data.menusBox);
  },
  btnNumDown(event){
  	  let index=event.target.dataset.index,
          rightContent=this.data.rightContent,
          menusBox=this.data.menusBox,
          mark=this.data.mark;
  	  if(rightContent[index].btnNum>=1){
  	  	rightContent[index].btnNum-=1;
        menusBox[mark].rightContent=rightContent
  	  	 this.setData({
  	  		rightContent:rightContent,
          menusBox:menusBox
  	  	})
  	  }
  	  this.calTotalNum();
  },
  calTotalNum(){//important
  	let totalNum=0,
        totalPrice=0,
        preTotalNum=0,
        preTotalPrice=0;


    let [rightContent,mark,menusBox,preTotalNum, preTotalPrice]=this.data;

    
    // for(let i in rightContent){//计算preTotalNum和preTotalPrice
    //   preTotalNum+=rightContent[i].btnNum;
    //   preTotalPrice+=Number(rightContent[i].btnNum*rightContent[i].price);
    // } 

    console.log(preTotalNum)
    console.log(preTotalPrice)
  	for(let i in rightContent){
  		totalNum+=rightContent[i].btnNum;
  		totalPrice+=Number((rightContent[i].btnNum*rightContent[i].price));
  		
  	}
    totalNum+=preTotalNum;
    totalPrice+=preTotalPrice;
    menusBox[mark].totalNum=totalNum;
    menusBox[mark].totalPrice=Number(totalPrice).toFixed(2);
  	this.setData({
  		totalNum:totalNum,
  		totalPrice:Number(totalPrice).toFixed(2),
      menusBox:menusBox
  	})



  },
  changeMenu(event){
      // console.log(this.data.totalNum,"this.data.totalNum")
      // console.log(this.data.totalPrice,"this.data.totalPrice")

      // 在改变menu项时把此时在indexCache方法中把上一次的读取出来赋值给preRightContent对象
    let _this = this,
      indexCache = this.data.indexCache,
      myTarget = event.target,
      index = Number(myTarget.dataset.index),
      i = 0,
      flag = this.data.flag,
      id = Number(myTarget.id),
      menusBox = this.data.menusBox,
      this.data.mark = index,
      preTotalNum = this.data.preTotalNum,
      preTotalPrice = this.data.preTotalPrice;

    this.setData({
      indexCache: index
    });
    console.log("indexCache", indexCache);
    // console.log(myTarget.dataset.index);
    console.log("menusBox", menusBox);


    // 根据上次的indexCache把上次的所有的btnNum和btnPrice加到preTotalNum和preTotalPrice

    for (let pre = menusBox[indexCache].rightContent, len = pre.length, i; i < len; i++) {
      preTotalNum += pre[i].btnNum;
      preTotalPrice += (pre[i].btnNum * pre[i].price);
    }


    this.setData({
      preTotalNum: preTotalNum,
      preTotalPrice: preTotalPrice
    })
    if (menusBox[index].rightContent.length !== 0) {
      this.setData({
        rightContent: menusBox[index].rightContent
      })

    } else {
      console.log("重新请求数据");
      let param = '/menu?menus=' + id;

      dataRequest({
        urlParam: param,
        callback(res) {
          console.log(res);
          let rightContent = res.menu;
          for (let i in rightContent) {
            rightContent[i].btnNum = 0;
            rightContent[i].itemPrice = (rightContent[i].btnNum) * (rightContent[i].price)
          }

          _this.data.menusBox[index].rightContent = rightContent
          _this.setData({
            rightContent: rightContent,
            menusBox: _this.data.menusBox
          });

          console.log(_this.data.menusBox);
        }
      })
    }


    for (; i < flag.length; i++) {
      flag[i] = false;
      this.setData({
        flag: flag
      })
    }
    flag[index] = true;

    this.setData({
      flag: flag
    })
  }
})