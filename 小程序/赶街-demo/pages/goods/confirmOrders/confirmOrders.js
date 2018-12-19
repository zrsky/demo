// pages/goods/goodsList.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsImgUrl:'',
    addressStatus:false,
    name:'',
    price:0,
    num:1,
    amountPrice:0,
    inventory:0,
    addressId:'',
    userName:'',
    userPhone:'',
    addressName:'',
    addressInfo:null,
    orderGoods:{},
    skuCode:'',
    skuStr: {},
    imageId:'',
    goodsCode:'',
    activityId:'',
  },

  //数量 减
  MinusPrice() {
    let _this = this;
    if (_this.data.num >1 ) {
      _this.setData({
        num: _this.data.num-1,
      })
    }
    _this.calculate();
  },

  //数量 加
  addPrice() {
    let _this = this;
    if (_this.data.num < _this.data.inventory) {
      _this.setData({
        num: _this.data.num+1,
      })
    }
    _this.calculate();
  },

  //input onblur事件
  calcNum(e) {
    let _this = this;
    let val = parseInt(e.detail.value);
    if (val > 1) {
      _this.setData({
        num: val
      })
    } else {
      _this.setData({
        num: 1
      })
    }
    _this.calculate();
  },

  //计算总金额
  calculate() {
    this.setData({
      amountPrice: this.data.num * this.data.price
    })
  },

  jumpAddressList() {
    console.log(1);
    wx.navigateTo({
      url: '/pages/goods/addressList/addressList'
    })
  },

  //查询默认收货地址
  queryDefaultAddress() {
    let _this = this;
    const data = {
      token:app.globalData.token
    }
    app.postRequest(app.globalData.api.queryDefaultAddress,data).then((res) => {
      if(res.data.code === "200" && res.data.success && res.data.data !== null) {
        let item = res.data.data;
        _this.setData({
          userName: item.name,
          userPhone: item.telephone,
          addressName: item.provinceName + item.cityName + item.countyName + item.address,
          addressInfo: item
        })
      } else {
        _this.setData({
          addressStatus:true
        })
      }
    })
  },

  //根据地址id查询收货地址
  queryAddressById() {
    let _this = this;
    const data = {
      token: app.globalData.token,
      addressId: _this.data.addressId
    }
    app.postRequest(app.globalData.api.queryAddressById,data).then((res) => {
      if (res.data.code === "200" && res.data.success) {
        let item = res.data.data;
        _this.setData({
          userName: item.name,
          userPhone: item.telephone,
          addressName: item.provinceName + item.cityName + item.countyName +item.address,
          addressInfo: item
        })
      } else {
        wx.showToast({
          title: '选择地址失败',
        })
      }
    })
  },

  //提交订单
  orderSubmit(e) {
    let _this = this,skuStr = "",imageId="";
    _this.data.skuStr.forEach((res) => {
      skuStr += res.skuName
    })
    let goodsArr = [{
      amount: _this.data.num,
      goodsCode:_this.data.goodsCode,
      skuCode:_this.data.skuCode,
      skuGroupStr:skuStr,
      imageId:_this.data.imageId,
      activityId:_this.data.activityId,
      goodsTitle:_this.data.name,
      priceStr:_this.data.price,
      goodsImgUrl:_this.data.goodsImgUrl,
      form_id: e.detail.formId
    }]
    if(_this.data.addressInfo !== null) {
      const data = {
        takeAddress: JSON.stringify(_this.data.addressInfo),
        token: app.globalData.token,
        orderGoods: JSON.stringify(goodsArr),
        shareUserId: app.globalData.userId
      }
      console.log(goodsArr);
      app.postRequest(app.globalData.api.bookOrders, data).then((res) => {
        if (res.data.code === "200" && res.data.success) {
          console.log(res);
          let obj = JSON.stringify({
            userName: _this.data.userName,
            userPhone: _this.data.userPhone,
            addressName: _this.data.addressName,
            goodsImgUrl: _this.data.goodsImgUrl,
            name: _this.data.name,
            skuStr: _this.data.skuStr,
            orderNo: res.data.data,
            price: _this.data.price
          })
          wx.navigateTo({
            url: '../payOrder/payOrder?obj=' + obj,
          })
        } else {
          wx.showToast({
            title: '提交订单失败',
          })
        }
      })
    }else {
      wx.showToast({
        title: '请先选择地址',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this,goods = app.globalData.goods;
    _this.setData({
      name: goods.goodsTitle,
      skuCode: goods.skuCode,
      skuStr: goods.skuStr,
      price: goods.price,
      num: goods.num,
      inventory: goods.inventory,
      amountPrice: goods.num * goods.price,
      goodsImgUrl: goods.img[0],
      goodsCode: goods.goodsCode,
      activityId: goods.activityId,
      imageId: goods.imageId
    })
    if(options.addressId !== undefined) {
      _this.setData({
        addressId : options.addressId
      })
      _this.queryAddressById();
    } else {
      //查询默认地址
      _this.queryDefaultAddress();
    }
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
  
  }
})