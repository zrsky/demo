 const app = getApp();
 Page({
  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['退款', '退款退货'],//下拉列表的数据
    index: 0,//选择的下拉列表下标,
    currentNoteLen: 0,
    refundType: '',
    url: [],
    urls: [],
    chooseSize: false,
    animationData: {},
    items: [
      { value: '仅退款'},
      { value: '退款退货'},
    ],
    checked: true,
    lenMore: true,
    loading: false,
    reason: '',
    type: '',
    orderNo: '',
    orderStatus: '',
    tradeNo: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const _this = this;
    _this.setData({
      money: options.money,
      orderNo: options.orderNo,
      tradeNo: options.tradeNo,
      orderStatus: options.orderStatus
    });
    _this.init();
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
  
  },
  choose() {
    const _this = this;
    const url = _this.data.url
    const urls = _this.data.urls
    console.log(url.length);
    _this.setData({
      loading: true
    });
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // _this.setData({
        //   url: res.tempFilePaths[0]
        // })
        // console.log(res.tempFilePaths)
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)
        tempFilePaths.forEach( (item) => {
          wx.uploadFile({
            url: 'https://dev.51ganjie.cn/supplyDemand/uploadpic.do', //仅为示例，非真实的接口地址
            filePath: item,
            name: 'fileItem',
            header: {
              'content-type': 'multipart/form-data'
            },
            formData: {
              'user': 'test'
            },
            success: function (res) {
              _this.setData({
                loading: false
              });
              var data = JSON.parse(res.data).data;
              console.log(data);
              
              urls.push(data.attachmentUrl)
              console.log(urls);
              //do something
              url.push(item);
              _this.setData({
                url: url
              });
              if (url.length >= 3) {
                _this.setData({
                  lenMore: false
                })
              } else {
                _this.setData({
                  lenMore: true
                })
              }
            }
          })
        })
       
        
      }
    });
    
  },
  radioChange(e) {
    console.log(e);
    const _this = this;
    _this.setData({
      refundType: e.detail.value,
      type: e.currentTarget.dataset.type
    })
    // this.hideModal();
  },
  /**
   * 删除图片
   */
  del(e) {
    console.log(e);
    const url = this.data.url;
    const urls = this.data.urls;
    const index = e.currentTarget.dataset.index;
    url.splice(index,1);
    urls.splice(index, 1);
    this.setData({
      url: url,
      urls: urls
    })
    if (url.length < 3) {
      this.setData({
        lenMore: true
      })
    } else {
      this.setData({
        lenMore: false
      })
    } 
  },
  /**
   * 提交退款申请
   */
  commit() {
    const _this = this;
    const orderNo = _this.data.orderNo;
    const tradeNo = _this.data.tradeNo;
    const para = {
      orderNo: orderNo,
      reason: _this.data.reason,
      type: _this.data.type,
      img1: _this.data.urls[0] || '',
      img2: _this.data.urls[1] || '',
      img3: _this.data.urls[2] || '',
      token: app.globalData.token
    }
    console.log(para);
    app.postRequest(app.globalData.api.applyBack, para).then((res) => {
      console.log(res.data.data)
      if (res.data.code == '200' && res.data.success) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000,
          mask: true
        });
        wx.redirectTo({
          url: `../refundDetail/refundDetail?orderNo=${orderNo}&tradeNo=${tradeNo}`,
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  // 复制代码
  chooseSezi: function (e) {
    if (this.data.orderStatus == 2) {
      return;
    } else {
      // 用that取代this，防止不必要的情况发生
      var that = this;
      // 创建一个动画实例
      var animation = wx.createAnimation({
        // 动画持续时间
        duration: 500,
        // 定义动画效果，当前是匀速
        timingFunction: 'linear'
      })
      // 将该变量赋值给当前动画
      that.animation = animation
      // 先在y轴偏移，然后用step()完成一个动画
      animation.translateY(500).step()
      // 用setData改变当前动画
      that.setData({
        // 通过export()方法导出数据
        animationData: animation.export(),
        // 改变view里面的Wx：if
        chooseSize: true
      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export()
        })
      }, 200)
    }
    
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  /**
   * 填写退款原因
   */
  fillNote(e) {
    this.setData({
      currentNoteLen: e.detail.value.length,
      reason: e.detail.value
    })
  },
  init() {
    if (this.data.orderStatus == 2) {
      this.setData({
        refundType: '仅退款',
        type: 1
      })
    }
  }
})