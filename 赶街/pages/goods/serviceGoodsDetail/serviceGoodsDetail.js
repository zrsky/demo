// 服务类商品
const app = getApp();
var WxParse = require("../../../utils/wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: null,
    bizId: '',
    shareType: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      bizId: options.id
    });
    //获取分享类型
    let type = app.globalData.shareType;
    this.setData({
      shareType: type
    })
    this.getGoodsInfo();
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
  onShareAppMessage: function (res) {
    let _this = this;
    let userId = '';
    if (app.globalData.userId != '') {
      userId = app.globalData.userId;
    } else {
      userId = app.globalData.userInfo.userId;
    }
    //分享日志
    const data = {
      shareUserId: app.globalData.userInfo.userId,
      shareType: 3
    }
    app.postRequest(app.globalData.api.shareLog, data).then((res) => {
      console.log(res);
    })

    return {
      title: _this.data.goodsInfo.goodsTitle,
      desc: '',
      imageUrl: _this.data.goodsInfo.imgUrls[0],
      path: '/pages/entry/entry?userId=' + userId + "&bizId=" + _this.data.id + "&shareType=wxGoods&sourceType=" + _this.data.sourceType
    }
    // const _this = this;
    // const title = _this.data.goodsInfo.goodsTitle;
    // const imgUrl = _this.data.goodsInfo.imgUrls[0];
    // const bizId = _this.data.bizId
    // console.log(title);
    // return {
    //   title: title,
    //   imageUrl: imgUrl,
    //   path: `/pages/goods/serviceGoodsDetail/serviceGoodsDetail?id=${bizId}`}
    
  },
  /**
   * 获取服务类商品详情
   */
  getGoodsInfo() {
    const _this = this;
    const para = {
      // bizId: "SPGD2018062915531",
      bizId: _this.data.bizId
    }
    app.postRequest(app.globalData.api.queryGoodsDetails, para).then((res) => {
      if (res.data.code === "200" && res.data.success) {
        console.log(res.data.data);
        if (res.data.data != null) {
          _this.setData({
            goodsInfo: res.data.data
          })
          WxParse.wxParse('goodsDetails', 'html', res.data.data.goodsVO.infos, _this, 5);
        } else {
          wx.showToast({
            title: '暂无数据，重新加载',
          })
        }
      }
    })
  },
  /**
   * 联系我们
   */
  callSeller() {
    const _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.goodsInfo.goodsVO.sellerPhone
    })
  },
  /**
   * 立即报名
   */
  apply() {
    const _this = this;
    const gdBizId = _this.data.goodsInfo.goodsVO.bizId
    wx.navigateTo({
      url: `../apply/apply?gdBizId=${gdBizId}`,
    })
  },
  //跳转到首页
  jumpIndex() {
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
})