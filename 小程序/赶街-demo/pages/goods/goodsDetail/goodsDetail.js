// 商品详情
const app = getApp();
var WxParse = require("../../../utils/wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:false, //弹框显示状态
    image:[],//轮播图
    price:'',//平台销售价
    name:'',//商品名称
    sellPointer:'',//商品卖点
    sales:'',//销售量
    inventory:'',//库存
    colorFlag:false,//按钮颜色
    sku:[],//页面显示sku
    skuModel:[],//页面缓存sku(用于sku选择)
    skuGroups:[],
    skuCode:'',
    skuStr:{},//用户选择的sku模板
    chooseSize: false,
    animationData: {},
    goodsCode: "",
    num:1,
    id:'',
    imageId:'',
    shareType:'',
    sourceType:''
  },

  //跳转到首页
  jumpFirst() {
    wx.reLaunch({
      url: '../goodsList/goodsList',
    })
  },

  //跳转到店铺页
  jumpStore() {
    wx.navigateTo({
      url: '../store/store?id=' + app.globalData.userId,
    })
  },

  //联系我们
  contact() {
    wx.makePhoneCall({
      phoneNumber: '4000086600',
      success(){
      }
    })
  },

  //数量 减
  MinusPrice() {
    let _this = this;
    if (_this.data.num > 1) {
      _this.setData({
        num: _this.data.num - 1,
      })
    }
  },

  //数量 加
  addPrice() {
    let _this = this;
    if (_this.data.num < _this.data.inventory) {
      _this.setData({
        num: _this.data.num + 1,
      })
    }
  },

  //input onblur事件
  calcNum(e) {
    let _this = this;
    let val = parseInt(e.detail.value);
    if (val > 1) {
      _this.setData({
        num:val
      })
    } else {
      _this.setData({
        num: 1
      })
    }
  },

  //规格选择
  chooseSku: function () {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(500).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 5)
  },
  
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(500).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },

  //根据sku选择的值改变价格
  chooseSkuVal(e) {
    let _this = this,flag = false,skuModel= _this.data.skuModel;
    //定义临时sku对象
    let skuObj = {
      skuVal : e.currentTarget.dataset.text.bizId,
      skuPVal : e.currentTarget.dataset.text.gsnBizId,
      skuName : e.currentTarget.dataset.text.val
    }
    //循环sku前端模板
    for(let i=0;i<skuModel.length;i++) {
      //如果选中的sku父级与模板中的相对应，则修改
      if(skuModel[i].skuPVal === skuObj.skuPVal) {
        skuModel[i].skuVal = skuObj.skuVal;
        skuModel[i].skuName = skuObj.skuName;
        flag = true;
      }
    }
    if(!flag) {
      skuModel.push(skuObj);
    }
    _this.setData({
      skuModel: skuModel
    })
    console.log(_this.data.skuModel);
    //循环sku后端模板
    let flag1 = false,price = 0;
    let skuGroups = _this.data.skuGroups;
    for(let i=0;i<skuGroups.length;i++) {
      let num = 0;
      for(let j=0;j<skuModel.length;j++) {
        if (skuGroups[i].skuValGroupBizId.indexOf(skuModel[j].skuVal) > -1){
          flag1 = true;
          num ++;
        } else {
          flag1 = false;
          break;
        }
      }
      if (flag1 && num === _this.data.sku.length) {
        _this.setData({
          price: skuGroups[i].platSalePriceStr,
          skuCode: skuGroups[i].bizId
        })
      }
    }
  },

  formSubmit() {
    let _this = this;
    if(_this.data.skuModel.length!=_this.data.sku.length) {
      wx.showToast({
        title: '请先选择商品规格',
      })
    } else {
      let obj = {
        goodsTitle: _this.data.name,
        skuCode: _this.data.skuCode,
        skuStr: _this.data.skuModel,
        num: _this.data.num,
        price: _this.data.price,
        img: _this.data.image,
        imageId: _this.data.imageId,
        inventory: _this.data.inventory,
        activityId:_this.data.id,
        goodsCode: _this.data.goodsCode
      }
      app.globalData.goods = obj;
      wx.navigateTo({
        url: '../confirmOrders/confirmOrders',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    //获取商品id
    const data = {
      bizId: options.id
    }
    _this.setData({
      id: options.id
    })
  //获取分享类型
    let type = app.globalData.shareType;
    _this.setData({
      shareType: type
    })
    app.postRequest(app.globalData.api.queryGoodsDetails,data).then((res) => {
      console.log(res.data.code)
        if(res.data.code==="200" && res.data.success) {
          if(res.data.data != null) {
            let item = res.data.data;
            //富文本
            WxParse.wxParse('goodsDetails', 'html', item.goodsVO.infos, _this, 5);
            _this.setData({
              image: item.imgUrls,
              imageId: item.goodsVO.imgUrl,
              price: item.platSalePriceMix,
              name: item.goodsTitle,
              sellPointer: item.feature,
              sales: item.saleQuantity,
              inventory: item.totalQuantity,
              sku: item.goodsVO.skuNameVOList,
              skuGroups: item.goodsVO.skuGroups,
              goodsCode: item.goodsVO.bizId,
              sourceType:item.sourceType
            })
          } else {
            wx.showToast({
              title: '暂无数据，重新加载',
            })
          }
        }
       
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _this = this;
    let userId = '';
    if(app.globalData.userId!='') {
      userId = app.globalData.userId;
    } else {
      userId = app.globalData.userInfo.userId;
    }
    //分享日志
    const data = {
      shareUserId:app.globalData.userInfo.userId,
      shareType:3
    }
    app.postRequest(app.globalData.api.shareLog,data).then((res) => {
      console.log(res);
    })
    
    return {
      title: _this.data.name,
      desc: '',
      imageUrl: _this.data.image[0],
      path: '/pages/entry/entry?userId=' + userId + "&bizId=" + _this.data.id + "&shareType=wxGoods&sourceType=" + _this.data.sourceType
    }
  }
})