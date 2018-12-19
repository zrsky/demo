//app.js
const utils=require("utils/util.js"),
      dataType=utils.dataType;
App({
  https:{
    URL:'https://test.laifumao.cn/v1',
    GTOKEN:'fZypzpeUeOyh5O0fq9eG0uve5qagXJDmifZF'
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [],_this=this;
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 登录
     wx.getStorage({
      key:'G-SESSION',
      success(res){
       if(dataType(res.data)=="Undefined"){
          _this.login();
       }else{
        console.log(res.data)
       }
      },
      fail(res){
        _this.login();
      }
     })
    // debugger
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log(2)
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(3);
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  login(){
      wx.login({
      success(res){

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code=res.code,_this=this;
        if (res.code) {
          // 发起网络请求
          wx.request({
            url:'https://test.laifumao.cn/v1/login?code='+res.code,
            header:{
              'content-type': 'application/json',
              'G-TOKEN':'fZypzpeUeOyh5O0fq9eG0uve5qagXJDmifZF'
            },
            success(res){
              console.log(res);
              let SESSION=res.data.session;
              wx.setStorage({
                key:"G-SESSION",
                data:SESSION
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})