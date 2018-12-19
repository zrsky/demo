// 添加收货地址
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressObj:{},
    region: [{
      provinceName: '',
      provinceCode: '',
      cityName: '',
      cityCode: '',
      countyName: '',
      countyCode: ''
    }],//省市区
    token:'',
    //表单校验
    checkName:'姓名不能为空',
    checkPhone:'',
    checkAreaStr:'省市县不能为空',
    checkAddress:'详细地址不能为空',
    checkNameStatus: false,
    checkPhoneStatus: false,
    checkAreaStrStatus: false,
    checkAddressStatus: false,
    action:''
  },
  //跳转到县选择页面
  jumpProvince() {
    setTimeout(()=>{this.jumpAddress()},500);
  },

  jumpAddress(){
    let addressObj = JSON.stringify(this.data.addressObj);
    wx.navigateTo({
      url: "../addressProvince/addressProvince?action=" + this.data.action + "&addressObj=" + addressObj + "&globRegion" + this.data.region,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //表单校验
  checkName(e) {
    if (e.detail.value === "") {
      this.setData({
        checkNameStatus:true,
      })
    } else {
      let addressObjName = "addressObj.name";
      this.setData({
        checkNameStatus:false,
        [addressObjName] : e.detail.value
      })
    }
  },
  checkPhone(e) {
    let addressObjPhone = "addressObj.telephone";
    if (e.detail.value === "") {
      this.setData({
        checkPhoneStatus: true,
        checkPhone: '手机号不能为空',
        [addressObjPhone]: e.detail.value
      })
    } else {
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(e.detail.value)) {
        this.setData({
          checkPhoneStatus: true,
          checkPhone: '手机号格式不正确',
          [addressObjPhone]: e.detail.value
        })
      } else {
        this.setData({
          checkPhoneStatus: false,
          [addressObjPhone]: e.detail.value
        })
      }
    }
  },
  checkAddress(e) {
    let addressObjAddress = "addressObj.address";
    if (e.detail.value === "") {
      this.setData({
        checkAddressStatus: true,
        [addressObjAddress]: e.detail.value
      })
    } else {
      this.setData({
        checkAddressStatus: false,
        [addressObjAddress]: e.detail.value
      })
    }
  },

  //新增地址
  addressAdd() {
    let _this = this,flag = true;
    //提交时校验name是否为空
    if (_this.data.addressObj.name === "" || _this.data.addressObj.name === undefined) {
      this.setData({
        checkNameStatus: true,
      })
      flag = false;
    }
    //提交时校验手机号
    let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (_this.data.addressObj.telephone === "" || _this.data.addressObj.telephone === undefined) {
      this.setData({
        checkPhoneStatus: true,
        checkPhone: '手机号不能为空'
      })
      flag = false;
    } else {
      if (!myreg.test(_this.data.addressObj.telephone)) {
        this.setData({
          checkPhoneStatus: true,
          checkPhone: '手机号格式不正确'
        })
        flag = false;
      }else{
        flag = true;
      }
    }
    //提交时校验省市县是否为空
    if (_this.data.addressObj.areaStr === "") {
      this.setData({
        checkAreaStrStatus: true,
      })
      flag = false;
    }
    //提交时校验address是否为空
    if (_this.data.addressObj.address === "" || _this.data.addressObj.address === undefined) {
      this.setData({
        checkAddressStatus: true,
      })
      flag = false;
    }
    if(flag) {
      let data = {
        name: _this.data.addressObj.name,
        showAddress: _this.data.addressObj.areaStr,
        telephone: _this.data.addressObj.telephone,
        address: _this.data.addressObj.address,
        postalCode: '',
        provinceCode: _this.data.region.provinceCode,
        cityCode: _this.data.region.cityCode,
        countyCode: _this.data.region.countyCode,
        provinceName: _this.data.region.provinceName,
        cityName: _this.data.region.cityName,
        countyName: _this.data.region.countyName,
        token:app.globalData.token,
        isDefault: 0
      },url = "";
      if(_this.data.action === "update") {
        data.addressId = _this.data.addressObj.addressId;
        url = app.globalData.api.updateAddress
      } else {
        url = app.globalData.api.addAddress
      }
      app.postRequest(url,data).then((res) => {
        if (res.data.code === "200" && res.data.success) {
          wx.navigateTo({
            url: '../addressList/addressList',
          })
        } else {
          wx.showToast({
            title: res.data.message,
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this,action = options.action;
    _this.setData({
      action:action
    })
    if (options.addressObj !== undefined && options.arr) {
      let arr = JSON.parse(options.arr);
      let areaStr = arr.provinceName + arr.cityName + arr.countyName,
        addressObjAreaStr = "addressObj.areaStr";
      _this.setData({
        region: arr,
        addressObj: JSON.parse(options.addressObj),
        [addressObjAreaStr]: areaStr
      })
    } else if (options.addressObj !== undefined){
      let areaStr = app.globalData.areaCode.provinceName + app.globalData.areaCode.cityName + app.globalData.areaCode.countyName,
        addressObjAreaStr = "addressObj.areaStr";
      _this.setData({
        region: app.globalData.areaCode,
        addressObj: JSON.parse(options.addressObj),
        [addressObjAreaStr]: areaStr
      })
    }
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