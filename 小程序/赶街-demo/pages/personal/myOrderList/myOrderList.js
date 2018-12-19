// pages/goods/goodsList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabbar
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    scrollLeft: 0,
    pageNo: 1,
    pageSize: 10,
    navList: [
      {
        text: '全部',
        id: -1
      }, {
        text: '待付款',
        id: 1
      },{
        text: '待发货',
        id: 2
      },{
        text: '待收货',
        id: 3
      },{
        text: '售后',
        id: 7
      }
    ],
    orderInfo: null,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /**
    * 获取系统信息
    */
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
    this.setData({
      id: options.id
    })
    if (options.id == '-1') {
      this.setData({
        currentTab: 0
      })
      this.getList(options.id);
    } else {
      this.setData({
        currentTab: options.id
      })
    }
    // console.log(options)
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
    // if (this.data.id == '-1') {
    //   this.setData({
    //     currentTab: 0
    //   })
    //   this.getList(this.data.id);
    // } else {
    //   this.setData({
    //     currentTab: this.data.id
    //   })
    // }
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
 * 滑动切换tab
 */
  bindChange: function (e) {
    const _this = this;
    _this.setData({ currentTab: e.detail.current });
    switch (e.detail.current) {
      case 0:
        _this.getList(-1);
        break;
      case 1:
        _this.getList(1);
        break;
      case 2:
        _this.getList(2);
        break;
      case 3:
        _this.getList(3);
        break;
      case 4:
        _this.getList(7);
        break;
    }
  },
  /**
  * 点击tab切换
  */
  swichNav: function (e) {
    var that = this;
    // console.log(e.target)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  a(e) {
    const _this = this;
    // console.log(e);
    if (_this.data.currentTab === e.target.dataset.index) {
      return false;
    } else {
      _this.setData({
        currentTab: e.target.dataset.index
      })
      // _this.getList(e.target.dataset.id);
    }
  },
  /**
   * 获取列表数据
   */
  getList(type) {
    const _this = this;
    const para = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      orderStatus: type,
      token: app.globalData.token,
    }
    app.postRequest(app.globalData.api.queryPartnerOrderStatus,para).then( (res) =>{
      if(res.data.code == '200' && res.data.success) {
        _this.setData({
          orderInfo: res.data.data.data
        });
      }
    })
  },
  /**
   * 跳转订单详情页
   */
  handelToDetail(e) {
    console.log(e);
    const tradeNo = e.currentTarget.dataset.tradeno;
    const orderNo = e.currentTarget.dataset.orderno;
    const orderStatus = e.currentTarget.dataset.orderstatus
    if (orderStatus == '7') {
      wx.navigateTo({
        url: `../refundDetail/refundDetail?tradeNo=${tradeNo}&orderNo=${orderNo}`
      })
    }else {
      wx.navigateTo({
        url: `../myOrderDetail/myOrderDetail?tradeNo=${tradeNo}&orderNo=${orderNo}`
      })
    }
  },
  /**
   * 跳转退款详情页
   */
  handelToRefund(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    const tradeNo = e.currentTarget.dataset.tradeno;
    wx.navigateTo({
      url: `../refundDetail/refundDetail?tradeNo=${tradeNo}&orderNo=${orderNo}`,
    })
  },
  /**
   * 确认收货
   */
  handelTake(e) {
    const _this = this;
    const tabIndex = _this.data.currentTab;
    const para = {
      orderNo: e.currentTarget.dataset.orderno,
      token: app.globalData.token
    };
    console.log(para);
    app.postRequest(app.globalData.api.buyerSure, para).then((res) => {
      console.log(res.data.data)
      if (res.data.code == '200' && res.data.success) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
        if (_this.data.currentTab == '0') {
          _this.getList(-1);
        } else {
          _this.getList(3);
        }
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
   * 支付
   */
  pay(e) {
    const _this = this;
    const para = {
      tradeNo: e.currentTarget.dataset.tradeno,
      token: app.globalData.token
    }
    wx.showLoading({
      title: '正在支付',
    })
    console.log(this.data.currentTab)
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
          }else {
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
  cancelOrders(e) {
    const tradeNo = e.currentTarget.dataset.tradeno;
    const tabIndex = this.data.currentTab;
    const para = {
      transNo: tradeNo,
      token: app.globalData.token,
    }
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
        if (tabIndex == 1) {
          this.getList(1)
        }else{
          this.getList(-1)
        }
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