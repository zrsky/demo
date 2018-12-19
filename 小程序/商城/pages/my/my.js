const app=getApp();
Page({
	data:{
	 canIUse: wx.canIUse('button.open-type.getUserInfo'),
	 showFlag:false,
	 name:"",
	 headerImg:"",
	},
	onLoad(){
		   let _this=this;
		   wx.setNavigationBarTitle({
		      title: '我的'
		   })

		   this.getSetting();
		
	},
	getSetting(){
		 let _this=this;
		 wx.getSetting({
	      success(res){
	        if (res.authSetting['scope.userInfo']) {
	      
	          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
	          wx.getUserInfo({
	            success(res) {
	              console.log(res.userInfo)
	              _this.setData({
	        		name:res.userInfo.nickName,
	        		headerImg:res.userInfo.avatarUrl,
	        		showFlag:false
	        	  })
	            }
	          })
	        }
	        else{
	        	_this.setData({
	        		name:"",
	        		headerImg:"",
	        		showFlag:true
	        	})
	        }
	      }
	    })
	},
   bindGetUserInfo(e){
       this.getSetting();
   }	
})