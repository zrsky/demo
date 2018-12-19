const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tradeNo: '',
    orderInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      tradeNo: options.tradeNo
    });
    this.getOrderInfo();
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
  
  },
  /**
   * 通过tradeNo查询订单
   */
  getOrderInfo() {
    const _this = this;
    const para = {
      // _this.data.tradeNo 4b4efc98-2e84-498f-bf80-7f7089cbc825
      tradeNo: _this.data.tradeNo,
      // token: '5afe6c6c-9eb2-4181-bca5-ec1f239b661e'
      token: app.globalData.token
    }
    app.postRequest(app.globalData.api.detailByOrderNo, para).then((res) => {
      console.log(res.data.data)
      if (res.data.code == '200' && res.data.success) {
        _this.setData({
          orderInfo: res.data.data
        })
      } else {
        wx.showToast({
          title: 'res.data.message',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  /**
   * 跳转订单详情
   */
  handelTodetail() {
    const tradeNo = this.data.orderInfo.tradeNo;
    const orderNo = this.data.orderInfo.orderNo;
    wx.reLaunch({
      url: `../../personal/myOrderDetail/myOrderDetail?tradeNo=${tradeNo}&orderNo=${orderNo}`,
    })
  },
  /**
   * 继续购物
   */
  goBuy() {
    wx.switchTab({
      url: '../goodsList/goodsList',
    })
  }
})