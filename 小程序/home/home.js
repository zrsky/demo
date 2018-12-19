//index.js
//获取应用实例
const app = getApp()
var bmap = require("../../../utils/bmap-wx.min.js");
var wxMarkerData = [];  //定位成功回调对象 

Page({
  data: {
    address: {},
    flag: false,
    listData: [],
    category: [],
    categoryBizId: '',
    cateStatus: -1,
    pageSize: 10,
    pageNo: 0,
    payStatus: true,
    tabBar: [],
    recommendStatus: true,
    left: '0',
    result: [],
    progress: false
  },

  //图标滑动事件
  scroll(e) {
    // let scrollLeft = e.detail.scrollLeft;
    // let scrollWidth = e.detail.scrollWidth;
    //scroll-view的宽度
    // let width = 414;
    // let rate = e.detail.scrollLeft / (e.detail.scrollWidth - 414 );
    // let left = e.detail.scrollLeft / (e.detail.scrollWidth - 414) * 60 + 'rpx';
    console.log(this.rateWidth)
    this.setData({
      left: e.detail.scrollLeft / this.rateWidth
    });
  },

  getScrollWidth() {
    const _this = this;
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const query = wx.createSelectorQuery().in(_this)
    
    query.select('#categoryItem').boundingClientRect(function (res) {
      let length = _this.data.result.length >= 7 ? Math.ceil((_this.data.result.length + 1) / 2) : (_this.data.result.length + 1);
      console.log('length: ' + _this.data.result.length)
      console.log(windowWidth)
      console.log('width: ' + res.width)
      console.log(res.width * length - windowWidth)
      let scrollWidth = res.width * length - windowWidth;
      _this.rateWidth = scrollWidth / 50;
    }).exec()
  },
  //地址定位切换
  addressSwitch() {
    var _this = this;
    // //新建百度地图对象
    // var BMap = new bmap.BMapWX({
    //   ak: "em0KzAqoQ9IBuzBoQc1dDWkOwcFkrAWw"
    // });
    // var success = function (data) {
    //   //通过百度api获取当前位置信息
    //   let addressData = {};
    //   addressData.name = data.originalData.result.addressComponent.district;
    //   addressData.code = data.originalData.result.addressComponent.adcode;
    //   app.globalData.positionAddress = addressData;
    //   let cancelData = {
    //     name: '请选择地址信息',
    //     code: '000000',
    //   };
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
        _this.queryCategoryList();
        _this.queryGoods(1);
      },
      fail: function (res) {
        //当前地址赋值
        _this.setData({
          address: app.globalData.positionAddress
        });
        //存入全局地址变量中
        app.globalData.currentAddress = app.globalData.positionAddress;
        //存入缓存
        let arr = [];
        arr.unshift(app.globalData.positionAddress);
        wx.setStorageSync('addressStorage', arr);
        //查询商品
        _this.queryCategoryList();
        _this.queryGoods(1);
      }
    })
    // }
    // var fail = function (data) {
    //   // wx.showToast({
    //   //   title: '地址切换失败',
    //   // })
    // }
    // BMap.regeocoding({
    //   fail: fail,
    //   success: success
    // });
  },

  //选择商品类目
  chooseCategory(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index, text = e.currentTarget.dataset.text, id = e.currentTarget.dataset.id;
    if (index == -1) {
      // _this.setData({
      //   cateStatus: index,
      //   recommendStatus: true,
      //   pageNo: 0
      // })
      wx.navigateTo({
        url: `../goodsList/goodsList?cateStatus=${index}&id=${id}&recommendStatus=true`
      })
    } else {
      // _this.setData({
      //   cateStatus: index,
      //   categoryBizId: text.bizId,
      //   recommendStatus: false,
      //   pageNo: 0
      // })
      wx.navigateTo({
        url: `../goodsList/goodsList?cateStatus=${index}&recommendStatus=false&id=
        ${id}&categoryBizId=${text.bizId}`
      })
    }
    // _this.queryGoods(1);
    
  },

  //查询所有商品
  queryGoods(type) {
    let _this = this;
    const data = {
      token: app.globalData.token,
      type: type,
      userBizId: app.globalData.userInfo.openId,
      areaCode: app.globalData.currentAddress.code,
      pageNo: _this.data.pageNo,
      pageSize: _this.data.pageSize
    }
    if (_this.data.recommendStatus) {
      data.sortType = 'recommend'
    } else {
      data.sortType = ''
      data.categoryBizId = _this.data.categoryBizId
    }
    app.postRequest(app.globalData.api.queryGoodsPage, data).then((res) => {
      if (res.data.code === "200") {
        if (res.data.data.totalCount > 0) {
          let list = res.data.data.data, arr = _this.data.listData;
          if (type === 1) {
            arr = [];
          }
          if (list != null) {
            list.forEach((item) => {
              let image = item.imgUrl.split(','), addressArr = [];
              if (item.areaAdress != null) {
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
                address: addressArr,
                template: item.template
              })
            })
            wx.stopPullDownRefresh();
            _this.setData({
              listData: arr
            })
          } else {
            if (_this.data.pageNo === 0) {
              //页面显示无商品的图片
              _this.setData({
                listData: arr
              })
              wx.showToast({
                title: '暂无商品',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '已经滑到底了！！！',
                icon: 'none'
              })
            }
          }
        } else {
          _this.setData({
            listData: []
          })
          wx.showToast({
            title: '暂无商品',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //跳转到商品详情
  jumpGoodDetail(e) {
    let _this = this;
    if (_this.data.payStatus) {
      _this.setData({
        payStatus: false
      })
      let goods = e.currentTarget.dataset.text;
      if (goods.sourceType === 7) {
        wx.navigateTo({
          url: '../serviceGoodsDetail/serviceGoodsDetail?id=' + goods.bizId,
          complete() {
            _this.setData({
              payStatus: true
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '../goodsDetail/goodsDetail?id=' + goods.bizId + "&shareType=wx",
          complete() {
            _this.setData({
              payStatus: true
            })
          }
        })
      }
    }
  },

  //初始化底部导航
  initTabBar() {
    let _this = this;
    let tabBar = app.globalData.tabBar, index = 0;
    for (let i = 0; i < tabBar.length; i++) {
      if (!tabBar[i].active && i == index) {
        let t = tabBar[i].iconPath;
        tabBar[i].iconPath = tabBar[i].selectedIconPath;
        tabBar[i].selectedIconPath = t;
        tabBar[i].active = true;

      } else if (tabBar[i].active && i != index) {
        let t = tabBar[i].iconPath;
        tabBar[i].iconPath = tabBar[i].selectedIconPath;
        tabBar[i].selectedIconPath = t;
        tabBar[i].active = false;
      }
    }
    this.setData({
      tabBar: tabBar
    })
  },
  //跳转底部导航
  jumgPages(e) {
    let tabBar = e.currentTarget.dataset.text;
    wx.redirectTo({
      url: tabBar.pagePath,
    })
  },

  queryCategoryList() {
    let _this = this;
    const data = {
      token: app.globalData.token,
      areaCode: app.globalData.currentAddress.code
    };
    app.postRequest(app.globalData.api.queryCategoryList, data).then((res) => {
      if (res.statusCode == '200') {
        let result = [];
        let remd = {
          id: 'r1',
          index: -1,
          imgUrl: '../../../img/order/careChoose.png',
          name: "精选",
          num: 0,
          template: 1
        }
        result = res.data.data;
        let category = [];
        result.forEach((item, index) => {
          item.id = 'd' + index;
          item.index = index;
        })
        if (result.length >= 7) {
          let cLength = result.length, i = 0, z = 2;
          let cols = 2; //显示几列
          let num = 4;//一行显示满屏显示几个
          for (var j = 0; j < cols; j++) {
            category.push([]);
          }
          category[0].push(remd);
          result.forEach((item, index) => {
            category[i].push(item);
            if ((z % num) == 0 && z <= cols * num || z > cols * num) {
              i++;
              i = i >= cols ? 0 : i;
            }
            z++;
          })
        } else {
          category = result.slice();
          category.unshift(remd);
        }
        console.log(category)
        _this.setData({
          category: category,
          result: result,
          progress: true
        })
        _this.getScrollWidth();
      }
    })
  },

  //事件处理函数
  onLoad: function () {

  },

  onShow: function () {
    this.setData({
      address: app.globalData.currentAddress
    });
    this.addressSwitch();
    this.initTabBar();
  },

  //页面上拉触底事件处理
  onReachBottom: function () {
    let _this = this;
    _this.setData({
      pageNo: _this.data.pageNo + 1,
    })
    _this.queryGoods(2);
  },

  //页面下拉处理
  onPullDownRefresh: function () {
    let _this = this;
    _this.setData({
      pageNo: 0
    })
    this.queryGoods(1);
  }
})
