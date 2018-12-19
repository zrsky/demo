// 授权页面
const app = getApp();
var bmap = require("../../utils/bmap-wx.min.js");
var wxMarkerData = [];  //定位成功回调对象 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: false,
    statusLocation: false,
    type: '1',
    bizId: '',
    sourceType: 0
  },

  //打开授权弹框
  openAuthorize() {
    let _this = this;
    _this.setData({
      status: false,
      statusLocation: false
    })
    wx.openSetting({
      success: (res) => {
        _this.setData({
          status: false,
          statusLocation: false
        })
      },
      fail: (res) => {

      },
      complete: (res) => {
        _this.getUserInfo();
      }
    })
  },

  //取消授权弹框
  exitAuthor() {
    this.setData({
      statusLocation: false,
    })
  },

  // 获取用户信息
  getUserInfo() {
    var _this = this;
    wx.getSetting({
      withCredentials: true,
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          //授权获取地理位置
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              //获取当前定位地址信息
              var BMap = new bmap.BMapWX({
                ak: "em0KzAqoQ9IBuzBoQc1dDWkOwcFkrAWw"
              });
              var success = function (data) {
                //通过百度api获取当前位置信息
                let addressData = {};
                addressData.name = data.originalData.result.addressComponent.district;
                addressData.code = data.originalData.result.addressComponent.adcode;
                app.globalData.positionAddress = addressData;
                wx.getUserInfo({
                  success: res => {
                    //向后台传code，iv，encryptedData获取token
                    const url = app.globalData.api.login,
                      data = {
                        code: app.globalData.code,
                        iv: res.iv,
                        encryptedData: res.encryptedData,
                        type: _this.data.type,
                        areaCode: app.globalData.positionAddress.code,
                        id: app.globalData.userId
                      };
                    console.log(app.globalData.code);
                    //授权
                    app.postRequest(url, data).then((res) => {
                      console.log(res);
                      if (res.data.data.token != "") {
                        console.log(res.data.data.token);
                        app.globalData.token = res.data.data.token;
                        // 可以将 res 发送给后台解码出 unionId
                        app.globalData.userInfo = res.data.data.userInfo;
                        //判断分享入口（2.商品分享 3.店铺分享）
                        console.log(app.globalData.shareType);
                        console.log(_this.data.sourceType);
                        if (app.globalData.shareType == 2 || app.globalData.shareType == 3) {
                          if (_this.data.sourceType == 7) {
                            wx.redirectTo({
                              url: '../goods/serviceGoodsDetail/serviceGoodsDetail?id=' + _this.data.bizId,
                            })
                          } else {
                            wx.redirectTo({
                              url: '../goods/goodsDetail/goodsDetail?id=' + _this.data.bizId,
                            })
                          }
                        } else if (app.globalData.shareType == 4) {
                          wx.redirectTo({
                            url: '../goods/store/store?id=' + app.globalData.userId,
                          })
                        } else {
                          wx.switchTab({
                            url: '../goods/goodsList/goodsList',
                          })
                        }
                        // wx.switchTab({
                        //   url: '../personal/personalCenter/personalCenter',
                        // })

                        // wx.navigateTo({
                        //   url: '../goods/store/store',
                        // })
                        // wx.navigateTo({
                        //   url: '../personal/myOrderList/myOrderList',
                        // })
                      } else {
                        wx.showToast({
                          title: res.data.data.message,
                        })
                      }
                    })
                  }
                })
              }
              var fail = function (data) {
                wx.showToast({
                  title: '地址定位失败',
                })
              }
              BMap.regeocoding({
                fail: fail,
                success: success
              });
            },
            fail() {
              _this.setData({
                status: true,
                statusLocation: true
              })
            }
          })
        } else {
          _this.setData({
            status: true
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.login({
      success: res => {
        console.log(res);
        app.globalData.code = res.code;
      }
    })
    //判断是否携带userId
    if (options.userId === undefined) {
      _this.setData({
        type: '2'
      })
    } else {
      _this.setData({
        type: '1',
      })
      app.globalData.userId = options.userId;
      console.log(app.globalData.userId);
      //判断分享方式
      //1.wx分享方式
      if (options.shareType == 'wxGoods') {
        app.globalData.shareType = 2;
        _this.setData({
          bizId: options.bizId,
          sourceType: options.sourceType
        })
      }
      //2.app商品分享方式
      if (options.shareType == 'goods') {
        app.globalData.shareType = 3;
        _this.setData({
          bizId: options.bizId,
          sourceType: options.sourceType
        })
      }
      //1.app店铺分享方式
      if (options.shareType == 'store') {
        app.globalData.shareType = 4;
      }
    }
    //执行函数
    _this.getUserInfo();
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