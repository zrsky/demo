const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentAddress:{},//当前地址
    positionAddress:{},//定位地址
    historyAreaCode:[],//历史访问地址
    hotAreaCode:[],//热门县域
    searchAddress:[],//模糊查询出的地址
    searchBoxShow:false,//模糊查询结果框的显示隐藏
  },

  //input值改变
  chooseValue(e) {
    let _this = this;
    const data = {
      addressName : e.detail.value,
      city : ''
    }
    app.postRequest(app.globalData.api.addressSearch,data).then((res) => {
      let arr = [];
      if(res.data.success) {
        if (res.data.data.length > 0) {
          res.data.data.forEach((item) => {
            arr.push({
              name:item.addressName,
              code:item.addressCode,
              // parentName:item.parentName,
              // parentId:item.parentId
            })
          })
          _this.setData({
            searchBoxShow:true,
            searchAddress:arr
          })
        } else {
          _this.setData({
            searchBoxShow: true
          })
        }
      } else {
        _this.setData({
          searchBoxShow: true
        })
      }
    })
  },

  //选择地址
  chooseAddress(e) {
    let _this = this;
    let address = {
      name:e.currentTarget.dataset.text.name,
      code:e.currentTarget.dataset.text.code
    }
    //从微信缓存中拿取访问过的地址信息
    wx.getStorage({
      key: 'addressStorage',
      complete: function (res) {
        let item = res.data;
        //存入全局地址变量中
        app.globalData.currentAddress = address;
        //存入缓存
        item.unshift(address);
        //判断如果缓存地址数大于2，清除末位
        if (item.length > 2) {
          item.splice(2);
        }
        wx.setStorageSync('addressStorage', item);
        app.globalData.authorizationStatus = false;
        wx.switchTab({
          url: '../goods/goodsList/goodsList',
          success:function(e) {
            let page = getCurrentPages().pop(); 
            page.onLoad();
          } 
        })
      }
    });
  },

  //赋值当前地址信息/定位信息
  setCurrentAddress(){
    this.setData({
      currentAddress: app.globalData.currentAddress,
      positionAddress: app.globalData.positionAddress
    })
  },
  //历史访问县域
  historyAreaCode() {
    let _this = this;
    wx.getStorage({
      key: 'addressStorage',
      success: function(res) {    
        _this.setData({
          historyAreaCode:res.data
        })
      },
    })
  },

  //热门县域查询
  hotAddress() {
    let _this = this;
    const url = app.globalData.api.hotAddress,data={};
    app.getRequest(url, data).then((res) => {
      console.log(res);
      if(res.data.data.length>0) {
        let data = res.data.data,data1=[];
        for(let i=0;i<data.length;i++) {
          data1.push({
            name:data[i].orgName,
            code:data[i].countyCode
          })
        }
        _this.setData({
          hotAreaCode : data1
        })
      }
     
    })
  },

  addressSearch() {
    const url = app.globalData.addressSearch;
    app.getRequest(url, data).then((res) => {
      console.log(res);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.hotAddress();
    this.historyAreaCode();
    //存入全局地址变量中
    this.setCurrentAddress();
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