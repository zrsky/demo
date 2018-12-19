// pages/goods/goodsList.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tradeNo: '',
    orderNo: '',
    orderInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const _this = this;
    _this.setData({
      tradeNo: options.tradeNo,
      orderNo: options.orderNo
    });
    _this.getOrderInfo();
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
   * 获取数据
   */
  getOrderInfo() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 2000)
    const _this = this;
    const para = {
      tradeNo: this.data.tradeNo,
      // orderNo: this.data.orderNo,
      token: app.globalData.token
    };
    console.log(para);
    app.postRequest(app.globalData.api.detailByOrderNo, para).then((res) => {
      console.log(res.data.data)
      if (res.data.code == '200' && res.data.success) {
        _this.setData({
          orderInfo: res.data.data
        })
      }else{
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
   * 复制
   */
  copy(e) {
    console.log(e);
    const _this = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.orderno || e.currentTarget.dataset.expressno,
      success:function(res) {
        wx.showToast({
          title: '复制成功',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  /**
   *  联系商家
   */
  callSeller(e) {
    console.log(e);
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  /**
   *  退款
   */
  refund(e) {
    const _this = this;
    const orderNo = _this.data.orderInfo.orderNo;
    const tradeNo = _this.data.orderInfo.tradeNo;
    const money = _this.data.orderInfo.buyerPayAmount;
    const orderStatus = _this.data.orderInfo.orderStatus;
    wx.navigateTo({
      url: `../refund/refund?orderNo=${orderNo}&money=${money}&orderStatus=${orderStatus}&tradeNo=${tradeNo}`
    })
  },
  /**
   * 支付
   */
  pay() {
    const _this = this;
    const para = {
      tradeNo: _this.data.tradeNo,
      token: app.globalData.token
    }
    wx.showLoading({
      title: '正在支付',
    })
    app.postRequest(app.globalData.api.payOrder, para).then((res) => {
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: 'MD5',
        paySign: res.data.data.paySign,
        success: function (res) {
          if (_this.data.currentTab == '0') {
            _this.getList(-1);
            wx.hideLoading();
          } else {
            _this.getList(1);
            wx.hideLoading();
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '已取消支付',
            icon: 'success'
          });
        },
        complete: function () {
          _this.setData({ selected: 0 });//取消选中
        }
      });
    })
  },
  /**
   * 取消订单
   */
  cancelOrders() {
    const para = {
      tradeNo: this.data.tradeNo,
      token: app.globalData.token
    };
    console.log(para);
    app.postRequest(app.globalData.api.cancelOrders, para).then((res) => {
      console.log(res.data.data)
      if (res.data.code == '200' && res.data.success) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000,
          mask: true
        })
        wx.navigateBack({
          delta: 1
        })
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
   * 确认收货
   */
  handelTake() {
    const _this = this;
    const para = {
      orderNo: _this.data.orderNo,
      token: app.globalData.token
    };
    console.log(para)
    app.postRequest(app.globalData.api.buyerSure, para).then((res) => {
      console.log(res.data.data)
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
})