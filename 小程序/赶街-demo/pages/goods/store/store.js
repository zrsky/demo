//index.js
//获取应用实例
const app = getApp()
var bmap = require("../../../utils/bmap-wx.min.js");
var wxMarkerData = [];  //定位成功回调对象 

Page({
  data: {
    address:{}, 
    flag: true,
    listData:[],
    shopName:'',
    areaName:'',
    photo:'',
    photoStatus:false,
    pageSize:10,
    pageNo:0,
  },

  //查询所有商品
  queryGoods(type) {
    let _this = this;
    const data = {
      appUserId:app.globalData.userId,
      pageNo:_this.data.pageNo,
      pageSize:_this.data.pageSize
    }
    app.postRequest(app.globalData.api.queryStoreGoods, data).then((res) => {
      if(res.data.code === "200" && res.data.success > 0) {
        let item = res.data.data;
        if(item.photo === '') {
          _this.setData({
            photoStatus:false
          })
        }
        _this.setData({
          shopName: item.shopName,
          areaName: item.codeName,
          photo: item.photo
        })
        if(item.pager.totalCount >0) {
          let data = item.pager.data,arr = _this.data.listData;
          if (type === 1) {
            arr = [];
          }
          if (data != null) {
            data.forEach((response) => {
              let item = response.data;
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
          if (_this.data.pageNo === 0) {
            //页面显示无商品的图片
          } else {
            wx.showToast({
              title: '已经滑到底了！！！',
            })
          }
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
        url: '../goodsDetail/goodsDetail?id=' + goods.bizId
      })
    }
  },

  //事件处理函数
  onLoad: function () {
    this.queryGoods(1);
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
    app.globalData.shareType = 1; 
    this.queryGoods(1);
  }
})
