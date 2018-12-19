// 添加收货地址
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    code:'',
    action:'',
    region: [],
    addressObj:{}
  },
  //查询所有市
  queryProvince() {
    let _this = this;
    const data = {
      parentId:_this.data.code,
      addressLevel: 2
    }
    app.postRequest(app.globalData.api.queryAddressLinkage,data).then((res) => {
      console.log(res);
      if(res.data.code === "200" && res.data.success) {
        _this.setData({
          region:res.data.data
        })
      } else {
        //请求错误处理
      }
    })
  },
  //跳转到city页面
  jumpCity(e) {
    let code = e.currentTarget.dataset.text.addressCode,
      name = e.currentTarget.dataset.text.addressName;
    app.globalData.areaCode.cityName = name;
    app.globalData.areaCode.cityCode = code;
    wx.redirectTo({
      url: '../addressCounty/addressCounty?code=' + code + '&action=' + this.data.action +
            "&addressObj=" + JSON.stringify(this.data.addressObj),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      code:options.code,
      action: options.action,
      addressObj:JSON.parse(options.addressObj)
    })
    this.queryProvince();
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