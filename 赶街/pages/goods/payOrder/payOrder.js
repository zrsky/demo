/* 订单支付 */
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    userPhone:'',
    addressName: '',
    goodsImgUrl: '',
    name: '',
    skuStr: '',
    tradeNo: '',
    price: '',
    payStatus:true
  },
  //取消支付
  cancelOrder() {
    let _this = this;
    wx.redirectTo({
      url: '../../personal/myOrderDetail/myOrderDetail?tradeNo=' + _this.data.tradeNo,
    })
  },
  //支付
  payOrder() {
    let _this = this;
    if(_this.data.payStatus){
      _this.setData({
        payStatus:false
      })
      const data = {
        tradeNo: _this.data.tradeNo,
        amount:_this.data.price,
        token:app.globalData.token 
      }
      app.postRequest(app.globalData.api.payOrder,data).then((res) => {
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          success: function (res) {
            wx.redirectTo({
              url: '../payOrderResult/payOrderResult?tradeNo=' + _this.data.tradeNo,
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '已取消支付',
              icon: 'success'
            });
          },
          complete: function () {
            _this.setData({
              payStatus:true
            })
          }
        });
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this,obj = JSON.parse(options.obj);
    _this.setData({
      userName: obj.userName,
      userPhone: obj.userPhone,
      addressName: obj.addressName,
      goodsImgUrl: obj.goodsImgUrl,
      name: obj.name,
      skuStr: obj.skuStr,
      tradeNo: obj.orderNo,
      price: obj.price
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
  
  }
})