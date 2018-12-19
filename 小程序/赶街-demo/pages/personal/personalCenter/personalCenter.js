const app = getApp();
// pages/goods/goodsList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    // photo: '../../../img/common/head.png',
    name: '一棵小白菜',
    pendingPaymentCount: '',                // 待付款订单数
    pendingDeliveredCount: '',              // 待发货订单数
    deliveredCount: '',                     // 待收货订单数
    afterSaleCount: ''                      // 售后订单数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.userInfoReadyCallback = res => {
    //   this.setData({
    //     userInfo: res.userInfo,
    //     hasUserInfo: true
    //   })
    // },
    
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
    this.init();
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
   * 初始化数据
   */
  init() {
    const _this = this;
    const para = {
      token: app.globalData.token
    }
    // console.log(para);
    _this.setData({
      userInfo: app.globalData.userInfo
    })
    app.postRequest(app.globalData.api.queryMineShopCount,para).then( (res) =>{
      console.log(res);
      if(res.data.code == '200' && res.data.success) {
        _this.setData({
          pendingPaymentCount: res.data.data.pendingPaymentCount,
          pendingDeliveredCount: res.data.data.pendingDeliveredCount,
          deliveredCount: res.data.data.deliveredCount,
          afterSaleCount: res.data.data.afterSaleCount
        })
      }
    })
   
  },
  /**
   * 查看订单
   */
  handelOrder(e) {
    const id = e.currentTarget.dataset.id
     wx.navigateTo({
       url: `../myOrderList/myOrderList?id=${id}`,
     })
  },
  /**
   * 地址管理
   */
  addressManage() {
    wx.navigateTo({
      url: '../../../../../../goods/addressList/addressList? =isCenter',
    })
  },
  /**
   * 联系客服
   */
  callService() {
    wx.makePhoneCall({
      phoneNumber: '4000086600',
    })
  }
})