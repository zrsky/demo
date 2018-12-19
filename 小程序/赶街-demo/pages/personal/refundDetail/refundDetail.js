const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundInfo: null,
    days: '',
    hours: '',
    minutes: '',
    orderNo: '',
    tradeNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      orderNo: options.orderNo,
      tradeNo: options.tradeNo
    })
    this.getBackInfo();
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
   * 通过orderNo获取退款详情
   */
  getBackInfo() {
    const _this = this;
    const para = {
      orderNo: _this.data.orderNo,
      token: app.globalData.token
    }
    app.postRequest(app.globalData.api.queryBackInfo, para).then((res) => {
      if (res.data.code == '200' && res.data.success) {
        _this.setData({
          refundInfo: res.data.data
        })
        _this.timeCut(res.data.data.limitTime)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  /**
   *  剩余时间
   */
  timeCut(time) {
    const _this = this;
    const lastDate = parseInt(time / 3600 / 24);
    const lastHours = parseInt(time / 3600 % 24);
    const lastMinutes = parseInt(time / 60 % 60);
    _this.setData({
      days: lastDate,
      hours: lastHours,
      minutes: lastMinutes
    })
  },
  /**
   * 联系客服
   */
  callService() {
    wx.makePhoneCall({
      phoneNumber: '4000086600',
    })
  },
  /**
   * 撤消退款申请
   */
  close() {
    const _this = this;
    const tradeNo = _this.data.tradeNo;
    const para = {
      orderNo: _this.data.orderNo,
      token: app.globalData.token
    }
    app.postRequest(app.globalData.api.cancelBack, para).then((res) => {
      console.log(res.data.data);
      if (res.data.code == '200' && res.data.success) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000,
          mask: true
        });
        wx.navigateBack({
          delta: 1
        })
        // wx.redirectTo({
        //   url: `../myOrderDetail/myOrderDetail?tradeNo=${tradeNo}`,
        // })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  }
})