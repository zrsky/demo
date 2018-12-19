const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gdBizId: '',
    sexitems: [
      { name: '1', value: '男', checked: 'true' },
      { name: '2', value: '女'},
    ],
    healthitems: [
      { name: '1', value: '健康', checked: 'true' },
      { name: '2', value: '残疾' },
    ],
    sex: '',
    health: '',
    name: '',
    showName: false,
    age: '',
    showAge: false,
    phone: '',
    showPhone: false,
    checkPhone: '',
    identity: '',
    showIdentity: false,
    checkIdentity: '',
    address: '',
    showAddress: false,
    mark: '',
    showMark: false,
    showImgOne: false,
    chooseImgOne: true,
    imgOneUrl: '',
    showImgTwo: false,
    chooseImgTwo: true,
    imgTwoUrl: '',
    showThree: false,
    chooseImgThree: true,
    imgThreeUrl: '',
    allUrl: [],
    loadingOne: false,
    loadingTwo: false,
    loadingThree: false,
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gdBizId: options.gdBizId
    });
    this.init();
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
  init() {
    const _this = this;
    const para = {
      // gdBizId: 'GD2018062915531'
      gdBizId: _this.data.gdBizId
    };
    app.postRequest(app.globalData.api.workSelect, para).then((res) => {
      if (res.data.code == '200' && res.data.success) {
        const listIds = res.data.data.listIds;
        if (listIds.indexOf(4) != -1) {
          _this.setData({
            show1: true,
            sex: '1'
          })
        };
        if (listIds.indexOf(5) != -1) {
          _this.setData({
            show2: true,
            health: '1'
          })
        };
        if (listIds.indexOf(6) != -1) {
          _this.setData({
            show3: true
          })
        };
        if (listIds.indexOf(7) != -1) {
          _this.setData({
            show4: true
          })
        };
        if (listIds.indexOf(8) != -1) {
          _this.setData({
            show5: true
          })
        };
        if (listIds.indexOf(9) != -1) {
          _this.setData({
            show6: true
          })
        }
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
  /**
   * 输入姓名
   */
  getName(e) {
    const _this = this;
    if (e.detail.value != '') {
      _this.setData({
        name: e.detail.value
      })
    }else{
      _this.setData({
        showName: true
      })
    }
  },
  hideName() {
    this.setData({
      showName: false
    })
  },
  /**
   * 选择性别
   */
  radioChangeSex: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  /**
   * 输入年龄
   */
  getAge(e) {
    const _this = this;
    if (e.detail.value != '') {
      _this.setData({
        age: e.detail.value
      })
    } else {
      _this.setData({
        showAge: true
      })
    }
  },
  hideAge() {
    this.setData({
      showAge: false
    })
  },
  /**
   * 输入手机号
   */
  getPhone(e) {
    const _this = this;
    const phoneExg = /^1[3|4|5|7|8][0-9]{9}$/;
    const phone = e.detail.value
    if (phone != '') {
      if (phoneExg.test(phone)) {
        console.log(phoneExg.test(phone));
        _this.setData({
          showPhone: false,
          phone: phone
        })
      }else {
        _this.setData({
          showPhone: true,
          checkPhone: '手机号格式错误',
        })
      }
    } else {
      _this.setData({
        showPhone: true,
        checkPhone: '请填写手机号',
      })
    }
  },
  hidePhone() {
    this.setData({
      showPhone: false,
    })
  },
  /**
   * 输入身份证
   */
  getIdentity(e) {
    const _this = this;
    const IdcardExg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
    const identity = e.detail.value
    if (identity != '') {
      if (IdcardExg.test(identity)) {
        _this.setData({
          showIdentity: false,
          identity: identity
        })
      } else {
        _this.setData({
          showIdentity: true,
          checkIdentity: '身份证号格式错误',
        })
      }
    } else {
      _this.setData({
        showIdentity: true,
        checkIdentity: '请填写身份证号',
      })
    }
  },
  hideIdentity() {
    this.setData({
      showIdentity: false,
    })
  },
  /**
  *  选择身体情况
  */
  radioChangeHealth(e) {
    this.setData({
      health: e.detail.value
    })
  },
  /**
  * 输入家庭住址
  */
  getAddress(e) {
    const _this = this;
    if (e.detail.value != '') {
      _this.setData({
        address: e.detail.value
      })
    } else {
      _this.setData({
        showAddress: true
      })
    }
  },
  hideAddress() {
    this.setData({
      showAddress: false
    })
  },
  /**
  * 输入家庭住址
  */
  getMark(e) {
    const _this = this;
    if (e.detail.value != '') {
      _this.setData({
        mark: e.detail.value
      })
    } else {
      _this.setData({
        showMark: true
      })
    }
  },
  hideMark() {
    this.setData({
      showMark: false
    })
  },
  /**
  * 上传第一张图
  */
  chooseOneImg() {
    const _this = this;
    const imgOneUrl = _this.data.imgOneUrl;
    const allUrl = _this.data.allUrl;
    _this.setData({
      loadingOne: true
    });
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // _this.setData({
        //   imgOneUrl: res.tempFilePaths[0],
        //   showImgOne: true,
        //   chooseImgOne: false
        // })
        // console.log(res.tempFilePaths[0])
        var tempFilePaths = res.tempFilePaths;
        tempFilePaths.forEach((item) => {
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
              var data = JSON.parse(res.data).data;
              console.log(data);
              _this.setData({
                loadingOne: false,
                imgOneUrl: data.attachmentUrl,
                showImgOne: true,
                chooseImgOne: false
              })
            }
          })
        })
      }
    });
  },
  /**
  * 上传第二张图
  */
  chooseTwoImg() {
    const _this = this;
    const imgTwoUrl = _this.data.imgTwoUrl;
    _this.setData({
      loadingTwo: true
    });
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // _this.setData({
        //   imgOneUrl: res.tempFilePaths[0],
        //   showImgOne: true,
        //   chooseImgOne: false
        // })
        // console.log(res.tempFilePaths[0])
        var tempFilePaths = res.tempFilePaths;
        tempFilePaths.forEach((item) => {
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
              var data = JSON.parse(res.data).data;
              console.log(data);
              _this.setData({
                loadingTwo: false,
                imgTwoUrl: data.attachmentUrl,
                showImgTwo: true,
                chooseImgTwo: false,
              })
            }
          })
        })
      }
    });
  },
  /**
  * 上传第三张图
  */
  chooseThreeImg() {
    const _this = this;
    const imgThreeUrl = _this.data.imgThreeUrl;
    _this.setData({
      loadingThree: true
    });
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // _this.setData({
        //   imgOneUrl: res.tempFilePaths[0],
        //   showImgOne: true,
        //   chooseImgOne: false
        // })
        // console.log(res.tempFilePaths[0])
        var tempFilePaths = res.tempFilePaths;
        tempFilePaths.forEach((item) => {
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
              var data = JSON.parse(res.data).data;
              _this.setData({
                loadingThree: false,
                imgThreeUrl: data.attachmentUrl,
                showImgThree: true,
                chooseImgThree: false,
              })
            }
          })
        })
      }
    });
  },
  delOne() {
    this.setData({
      imgOneUrl: '',
      showImgOne: false,
      chooseImgOne: true,
      allUrl: []
    })
    console.log(this.data.imgOneUrl);
  },
  delTwo() {
    this.setData({
      imgTwoUrl: '',
      showImgTwo: false,
      chooseImgTwo: true,
      allUrl: []
    })
  },
  delThree() {
    this.setData({
      imgThreeUrl: '',
      showImgThree: false,
      chooseImgThree: true,
      allUrl: []
    })
  },
  /**
  * 立即报名 提交信息
  */
  commit() {
    const _this = this;
    const allUrl = _this.data.allUrl
    const one = _this.data.imgOneUrl;
    const two = _this.data.imgTwoUrl;
    const three = _this.data.imgThreeUrl;
    if(one != '') {
      allUrl.push(one);
    }
    if (two != '') {
      allUrl.push(two);
    }
    if (three != '') {
      allUrl.push(three);
    }
    const para = {
      token: app.globalData.token,
      gdBizId: this.data.gdBizId,
      name: this.data.name,
      identity: this.data.identity,
      age: this.data.age,
      phone: this.data.phone,
      sex: this.data.sex,
      health: this.data.health,
      address: this.data.address,
      mark: this.data.mark,
      img: allUrl,
      shareId: app.globalData.userId
    }
    console.log(para);
    app.postRequest(app.globalData.api.workApplyShare, para).then((res) => {
      console.log(res.data.data)
      if (res.data.code == '200' && res.data.success) {
        this.setData({
          showModal: true
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
  preventTouchMove:function () {},
  /**
  * 继续报名
  */
  go: function () {
    this.setData({
      showModal: false,
      name: '',
      age: '',
      phone: '',
      sex: '1',
      health: '1',
      identity: '',
      address: '',
      mark: '',
      imgOneUrl: '',
      imgTwoUrl: '',
      imgThreeUrl: '',
      allUrl: []
    })
  },
  /**
  * 关闭  返回
  */
  close() {
    wx.navigateBack({
      delta: 2
    })
  }
})