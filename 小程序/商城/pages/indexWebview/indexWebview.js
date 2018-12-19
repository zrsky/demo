//index.js
//获取应用实例
const app = getApp(),
      dataRequest=require('../../utils/dataRequest.js');

Page({
  data:{
    imgUrl:''
  },
  onLoad() {
     wx.getStorage({
      key:'imgUrl',
      success(res){
        console.log(res);
      }
     }) 

  }
  
 
})
