//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // this.login();
  },
  //公用属性
  globalData: {
    url: 'https://dev.51ganjie.cn/',
    // url: 'http://192.168.0.139:9005/',
    // url: 'https://m.51ganjie.cn/',
    shareType:1,//分享方式
    userInfo: null,//用户信息
    userId:'',//用户userId
    appUserId:'',//店铺id
    code: null,//登录code
    currentAddress:{},//当前选择地址
    positionAddress:{},//定位位置
    areaCode:{
      provinceName:'',
      provinceCode:'',
      cityName:'',
      cityCode:'',
      countyName:'',
      countyCode:''
    },//选择收货地址模板
    goods:{},//下单商品详情
    api: {
      login: 'WxDecode.do', //微信授权登录，获取token
      addressSearch: 'organization/fuzzySearch.do',//县域模糊查询
      hotAddress: 'organization/oldestOrganization.do',//热门县域
      queryGoodsPage: 'special/share/queryPage.do',//分页查询所有商品
      queryStoreGoods: 'appShop/queryAppShopHomeWX.do',//分页查询店铺内所有商品
      queryGoodsDetails: 'appShop/detailByBizId.do',//查看商品详
      shareLog: 'goods/comment/addShareLog.do',//分享日志
      queryAddress: 'address/queryAllShoppingAddress.do',//查询用户所有收货地址
      deleteAddress: 'address/deleteShoppingAddress.do',//删除收货地址
      addAddress: 'address/addShoppingAddress.do',//添加收货地址
      updateAddress: 'address/editShoppingAddress.do',//修改收货地址
      defaultAddress: 'address/setDefaultShoppingAddress.do',//设为默认地址
      queryAddressLinkage: 'address/queryAddressForFourLinkage.do',//选择收货地址
      queryDefaultAddress: 'address/queryDefaultShoppingAddress.do',//查询默认地址
      queryAddressById: 'address/queryAddressById.do',//根据地址id查询地址
      bookOrders: 'orders/special/bookOrdersJs.do',//下单
      payOrder: 'payment/weixinMiniPay.do',//支付
      queryMineShopCount: '/appShop/queryMineShopCount.do',//查询各类型订单数量 
      queryPartnerOrderStatus: 'orders/special/queryPartnerOrderStatus.do',//查看订单列表
      detailByOrderNo: 'orders/special/detailByOrderNo.do',// 订单详情
      buyerSure: 'orders/special/buyerSure.do',//确认收货
      cancelOrders: 'orders/special/cancelOrders.do',// 取消订单
      weixinJsPay: 'payment/weixinJsPay.do',// 微信支付
      applyBack: 'orders/special/applyBack.do',// 申请退款
      queryBackInfo: 'orders/special/queryBackInfo.do', // 退款详情
      cancelBack: 'orders/special/cancelBack.do', // 取消退款
      workSelect: 'work/workSelect.do',// 招工表单查询
      workApplyShare: 'work/workApplyShare.do'// 提交报名信息
    },
    token: ""
  },
  //封装的request方法
  wxPromisify(fn) {
    return function (obj = {}) {
      return new Promise((resolve, reject) => {
        obj.success = function (res) {
          //成功
          resolve(res)
        }
        obj.fail = function (res) {
          //失败
          reject(res)
        }
        fn(obj)
      })
    }
  },

  getRequest(url, data) {
    let urlReal = this.globalData.url + url;
    var getRequest = this.wxPromisify(wx.request);
    return getRequest({
      url: urlReal,
      method: 'GET',
      data: data,
      header: {
        'Content-Type': 'application/json'
      }
    })
  },
  postRequest(url, data) {
    let urlReal = this.globalData.url + url;
    var postRequest = this.wxPromisify(wx.request);
    return postRequest({
      url: urlReal,
      method: 'POST',
      data: data,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
    })
  },
})