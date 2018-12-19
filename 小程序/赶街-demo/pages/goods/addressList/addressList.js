// pages/goods/goodsList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    addressList:[],
    isCenter:false
  },

  //跳转至添加地址页面2
  jumpAddressAdd() {
    wx.redirectTo({
      url: "../addressAdd/addressAdd?action=add",
    })
  },

  //跳转至添加地址页面（修改）
  jumpAddressUpdate(e) {
    let addressObj = e.currentTarget.dataset.text;
    let arr = {
      provinceName : addressObj.provinceName,
      provinceCode : addressObj.provinceCode,
      cityName : addressObj.cityName,
      cityCode : addressObj.cityCode,
      countyName : addressObj.countyName,
      countyCode : addressObj.countyCode
    }
    let addressObjReal = JSON.stringify(addressObj);
    let arrReal = JSON.stringify(arr);
    wx.navigateTo({
      url: "../addressAdd/addressAdd?action=update&addressObj=" + addressObjReal + "&arr=" + arrReal, 
    })
  },

  //查询所有收获地址
  queryAddressList() {
    let _this = this;
    const data = {
      token: app.globalData.token
    }
    app.postRequest(app.globalData.api.queryAddress,data).then((res) => {
        if(res.data.code === "200"&&res.data.success) {
          _this.setData({
            addressList : res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.message,
          })
        }
    })
  },

  //设置默认
  chooseRadio(e) {
    let _this = this;
    let addressId = e.currentTarget.dataset.text.addressId;
    const data = {
      addressId : addressId,
      isDefault : 1,
      token: app.globalData.token
    }
    app.postRequest(app.globalData.api.defaultAddress, data).then((res) => {
      if (res.data.code === "200" && res.data.success) {
        _this.queryAddressList();
      }
    })
  },

  //删除收货地址
  deleteAddress(e) {
    let _this = this;
    wx.showModal({
      title: '是否删除该收货地址？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          let addressId = e.currentTarget.dataset.text.addressId;
          const data = {
            addressId: addressId,
            isDefault: 1,
            token: app.globalData.token
          }
          app.postRequest(app.globalData.api.deleteAddress, data).then((res) => {
            if (res.data.code === "200" && res.data.success) {
              wx.showToast({
                title: '删除成功',
              })
              _this.queryAddressList();
            }
          })
        }else if (res.cancel) {

        }
      }
    })
  },

  //跳转至确认订单模块
  jumpConfirmOrders(e) {
    let addressId = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: '../confirmOrders/confirmOrders?addressId=' + addressId,
    })
  },

  jumpPersonal() {
    wx.switchTab({
      url: "../../personal/personalCenter/personalCenter",
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if (options.isCenter == 'isCenter') {
      _this.setData({
        isCenter: true
      })
    }
    _this.queryAddressList();
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
    return {
      title:'微信小',
      desc:'见覅诶房间诶',
      path:'/page/goods/goodsList.wxml'
    }
  }
})