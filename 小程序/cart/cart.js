// pages/goods/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkAll: false,
    cartData: [{
        id: 1,
        title: '张瑞的赶街店',
        children: [{
            id: 11,
            title: '日式和风声波式便携电动牙刷日式和风声波式便携电动牙刷日式和风声波式便携电动牙刷',
            des: '静雅黑',
            price: '198',
            buyNum: 2,
            checked: false
          },
          {
            id: 12,
            title: '日式和风声波式便携电动牙刷',
            des: '静雅黑',
            price: '198',
            buyNum: 2,
            checked: false
          }
        ],
        checked: false
      },
      {
        id: 2,
        title: '张瑞的赶街店',
        children: [{
            id: 21,
            title: '日式和风声波式便携电动牙刷',
            des: '静雅黑',
            price: '198',
            buyNum: 2,
            checked: false
          },
          {
            id: 22,
            title: '日式和风声波式便携电动牙刷',
            des: '静雅黑',
            price: '198',
            buyNum: 2,
            checked: false
          }
        ],
        checked: false
      }
    ],
    scrollTop: 100,
    items: [{
        name: 'USA',
        value: '美国'
      },
      {
        name: 'CHN',
        value: '中国',
        checked: 'true'
      },
      {
        name: 'BRA',
        value: '巴西'
      },
      {
        name: 'JPN',
        value: '日本'
      },
      {
        name: 'ENG',
        value: '英国'
      },
      {
        name: 'TUR',
        value: '法国'
      },
    ]
  },
  //事件函数
  goIndex() {
    wx.navigateTo({
      url: '../goodsList/goodsList',
    });
  },
  lower() {

  },
  checkAll(e) {
    this.setData({
      checkAll: !this.data.checkAll
    })
    console.log(this.data.checkAll);
    this.storeToggleChecked(this.data.checkAll);
  },
  //店铺是否选中
  storeToggleChecked(checkAll) {
    if (checkAll) {
      this.data.cartData.forEach((item, index) => {
        item.checked = true;
        item.children.forEach((son) => {
          son.checked = true;
        })
      });
    } else {
      this.data.cartData.forEach((item, index) => {
        item.checked = false;
        item.children.forEach((son) => {
          son.checked = false;
        })
      });
    }
    this.setData({
      cartData: this.data.cartData
    })
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e)
    if (e.detail.value.length == this.data.cartData.length) {
      this.setData({
        checkAll: true
      });
    } else {
      this.setData({
        checkAll: false
      })
    }
  },
  change(e) {
    console.log(e)
    this.goodCheckedByStore(e.target.dataset.index)

  },
  checkboxChange1: function(e) {
    console.log('checkbox1发生change事件，携带value值为：', e)
    var index = e.target.dataset.parentidx;
    // this.data.cartData.forEach((item1,index1) => {

    this.data.cartData[index].children.forEach((item2, index2) => {
      item2.checked = false;
      e.detail.value.forEach((item, index) => {
        if (item == item2.id) {
          item2.checked = true;
          return;
        }
      })
    })
    // })
    this.setData({
      cartData: this.data.cartData
    });
    this.storeCheckedByGood();
  },
  change1(e) {
    console.log(e)
  },
  //根据商品判断店铺是否选中
  storeCheckedByGood() {
    this.data.cartData.forEach((item, index) => {
      item.checked = true;
      item.children.forEach((item1, index1) => {
        if (!item1.checked) {
          item.checked = false;
        }
      })
    })
    this.setData({
      cartData: this.data.cartData
    });
    this.checkAllByStore();
    console.log('checkAll: ' + this.data.checkAll)
  },
  //根据店铺判断商品是否选中
  goodCheckedByStore(index) {
    var checked = this.data.cartData[index].checked;
    this.data.cartData[index].checked = !checked;

    this.data.cartData[index].children.forEach((item) => {
      item.checked = !checked;
    })
    this.setData({
      cartData: this.data.cartData
    });
  },
  //根据店铺判断是否全选
  checkAllByStore() {
    this.data.checkAll = true;
    this.data.cartData.forEach((item) => {
      if (!item.checked) {
        this.data.checkAll = false;
        return;
      }
    })
    this.setData({
      checkAll: this.data.checkAll
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})