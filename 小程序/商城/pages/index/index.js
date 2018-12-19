//index.js
//获取应用实例
const app = getApp(),
      dataRequest=require('../../utils/dataRequest.js'),
      utils=require('../../utils/util.js'),
      dataType=utils.dataType;

Page({
  data:{
  		recommend:[],
      showFlag:false,
  		msg:'',
      outLoginFlag:false,
  		animationData:"",
  		dishTotalNum:0,
  		dishTotalPrice:0.00,
   		indicatorDots:true,  //显示面板指示点
	    autoplay:true,     //自动切换
	    interval:5000,    //自动切换时间间隔
	    duration:1000,    //滑动动画时长
	    imgUrls:[]
  },
  onLoad() {
      
    this.initData();

  },


  onPullDownRefresh(){
    //  let _this=this;
   
    // // console.log(1);
    // // this.setData({
    // //   showFlag:false
    // // })
    //    _this.initData();
    //      _this.setData({
    //     showFlag:true
    //     })
    // wx.startPullDownRefresh({
    //   success(){
      
    //   }
    // })

    // wx.showNavigationBarLoading();

    // console.log(1)

    this.initData();
    wx.showToast({
         title:"数据刷新成功"
       })
    // wx.stopPullDownRefresh();
    // wx.hideNavigationBarLoading() //完成停止加载
    // wx.stopPullDownRefresh() //停止下拉刷新

  },

  callback(){
    [...arguments].forEach(function(val,key){
       val();
    })
  },
  initData(){
     let _this=this;
      _this.setData({
        outLoginFlag:true
      });
     dataRequest({
      urlParam:'/mes',
      callback(res){
        _this.setData({
          msg:res.mes
        })

        wx.setNavigationBarTitle({
          title: res.mes
        })
      }
     });
    dataRequest({
      urlParam:'/ad',
      callback(res){
        _this.setData({
          imgUrls:res.ad
        })
      }
     });
    dataRequest({
      urlParam:'/star',
      callback(res){
        _this.setData({
          recommend:res.menu
        })


      for(var i in _this.data.recommend){
        _this.data.recommend[i].btnNum=0;
      }


      _this.setData({
        recommend:_this.data.recommend
      });

      }
               });
 
  },
  adNvTo(event){
  let nvUrl=event.target.dataset.nvto;
  wx.navigateTo({
    url:'../indexWebview/indexWebview'
  })

  wx.setStorage({
    key:'imgUrl',
    data:nvUrl
  });
  },
  toMenuList(e){
    let param=`/menus?goods=${Number(e.target.id)}`;
    dataRequest({
      urlParam:param,
      callback(res){
        let menus=res.menus;
        wx.setStorage({
          key:'menus',
          data:menus
        });
      }
    });
   wx.navigateTo({
        url:'../menus/menus'
   }) 
  },
  btnNumUp(event){
  	let index=event.target.dataset.index;
  	this.data.recommend[index].btnNum+=1;
  	this.setData({
  		recommend:this.data.recommend
  	})
  	this.calTotalNum();
  },
  btnNumDown(event){
  	  let index=event.target.dataset.index;
  	  if(this.data.recommend[index].btnNum>=1){
  	  	this.data.recommend[index].btnNum-=1;
  	  	 this.setData({
  	  		recommend:this.data.recommend
  	  	})
  	  }
  	  this.calTotalNum();
  },
  calTotalNum(){
  	let totalNum=0,totalPrice=0;
  	for(let i in this.data.recommend){
  		totalNum+=this.data.recommend[i].btnNum
  		totalPrice+=Number((this.data.recommend[i].btnNum*this.data.recommend[i].price));
  		
  	}
  	this.setData({
  		dishTotalNum:totalNum,
  		dishTotalPrice:totalPrice.toFixed(2)
  	})
  },
  setStorage(){
    let _this=this;
    if(Number(this.data.dishTotalPrice)>0){
      let oldRecommend=[],re=_this.data.recommend;
      re.forEach(function(val,key){
        oldRecommend.push(val);
      })


      // console.log(oldRecommend);
      oldRecommend.forEach(function(val,key){
        if(val.btnNum==0){
          oldRecommend.splice(key);
         
        }

         wx.setStorage({
            key:'orderConfirm',
            data:oldRecommend
          })
        
      })
    wx.setStorage({
      key:'payTotal',
      data:_this.data.dishTotalPrice
    })
      wx.navigateTo({
      url: '../orderConfirm/orderConfirm'
     })
    }
    
  }

 
})
