//index.js
//获取应用实例
const app = getApp()
var bmap = require("../../../utils/bmap-wx.min.js");
var wxMarkerData = [];  //定位成功回调对象 

Page({
  data: {
    address:{}, 
    flag: false,
    listData:[],
    pageSize:10,
    pageNo:0,
  },

  //地址定位切换
  addressSwitch() {
    var _this = this;
    //新建百度地图对象
    var BMap = new bmap.BMapWX({
      ak: "em0KzAqoQ9IBuzBoQc1dDWkOwcFkrAWw"
    });
    var success = function (data) {
      //通过百度api获取当前位置信息
      let addressData = {};
      addressData.name = data.originalData.result.addressComponent.district;
      addressData.code = data.originalData.result.addressComponent.adcode;
      app.globalData.positionAddress = addressData;
      let cancelData = {
        name: '请选择地址信息',
        code: '000000',
      };
      //从微信缓存中拿取访问过的地址信息
      wx.getStorage({
        key: 'addressStorage',
        success: function (res) {
          let item = res.data;
            _this.setData({
              address: item[0]
            });
            //存入全局地址变量中
            app.globalData.currentAddress = item[0];
            //查询商品
            _this.queryGoods(1);
        },
        fail: function (res) {
          //当前地址赋值
          _this.setData({
            address: addressData
          });
          //存入全局地址变量中
          app.globalData.currentAddress = addressData;
          //存入缓存
          let arr = [];
          arr.unshift(addressData);
          wx.setStorageSync('addressStorage', arr);
           //查询商品
          _this.queryGoods(1);
        }
      })
    }
    var fail = function (data) {
      wx.showToast({
        title: 'aaaa',
      })
    }
    BMap.regeocoding({
      fail: fail,
      success: success
    });
  },

  //查询所有商品
  queryGoods(type) {
    let _this = this;
    const data = {
      token:app.globalData.token,
      type:type,
      userBizId:app.globalData.userInfo.openId,
      areaCode: app.globalData.currentAddress.code,
      sortType:'',
      pageNo:_this.data.pageNo,
      pageSize:_this.data.pageSize
    }
    app.postRequest(app.globalData.api.queryGoodsPage, data).then((res) => {
      if(res.data.code === "200" && res.data.data.totalCount > 0) {
        let data = res.data.data.data,arr = _this.data.listData;
        if(type === 1) {
          arr = [];
        }
        if(data != null) {
          data.forEach((item) => {
            let image = item.imgUrl.split(','),addressArr = [];
            if(item.areaAdress != null) {
              if (item.areaAdress.indexOf(",") != -1) {
                addressArr = item.areaAdress.split(",");
                addressArr.pop();
              } else {
                addressArr = item.areaAdress;
              }
            }
            arr.push({
              bizId: item.bizId,
              img: image[0],
              name: item.goodsTitle,
              sellPoint: item.feature,
              price: item.platSalePrice,
              sales: item.saleQuantity,
              sourceType: item.sourceType,
              address: addressArr
            })
          })
          wx.stopPullDownRefresh();
          _this.setData({
            listData: arr
          })
        } else {
          if(_this.data.pageNo === 0) {
            //页面显示无商品的图片
          } else {
            wx.showToast({
              title: '已经滑到底了！！！',
            })
          }
        }
      } else {
        wx.showToast({
          title: res.data.message,
        })
      }
    })
  },

  jumpGoodDetail(e) {
    let goods = e.currentTarget.dataset.text;
    if(goods.sourceType === 7) {
      wx.navigateTo({
        url: '../serviceGoodsDetail/serviceGoodsDetail?id=' + goods.bizId
      })
    } else {
      wx.navigateTo({
        url: '../goodsDetail/goodsDetail?id=' + goods.bizId + "&shareType=wx"
      })
    }
  },

  //事件处理函数
  onLoad: function () {
    this.setData({
      address: app.globalData.currentAddress
    });
    this.addressSwitch();
  },
  onReady: function () {
  },

  //页面上拉触底事件处理
  onReachBottom:function () {
    let _this = this;
    _this.setData({
      pageNo:_this.data.pageNo + 1,
    })
    _this.queryGoods(2);
  },

  //页面下拉处理
  onPullDownRefresh:function () {
    let _this = this;
    _this.setData({
      pageNo:0
    })
    this.queryGoods(1);
  }
})
