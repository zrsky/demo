const app=getApp(),
	  dataRequest=require('../../utils/dataRequest.js'),
	  utils=require('../../utils/util.js'),
	  dataType=utils.dataType,
	  base64=require('../../utils/base64.js');
Page({
	data:{
		orderConfirm:[],
		payTotal:'',
		value:["住院部",'1'],
		names:[],
		nums:[],
		floors:[],
		ids:[],
		name:'',
		num:'',
		id:'',
		note:'',
		tel:'',
		detailSite:'',
		finalData:""
	},
	onLoad(){
		this.initData();
	},
	 login(){
	  let _this=this;
      wx.login({
      success(res){

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code=res.code;
        if (res.code) {
          // 发起网络请求
          wx.request({
            url:'https://test.laifumao.cn/v1/login?code='+res.code,
            header:{
              'content-type': 'application/json',
              'G-TOKEN':'fZypzpeUeOyh5O0fq9eG0uve5qagXJDmifZF'
            },
            success(res){
              let SESSION=res.data.session;
              wx.setStorageSync("G-SESSION",SESSION);
              _this.subToserver(SESSION,_this.data.finalData);

              // console.log(_this.data.finalData);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
   },
	initData(){
	   let _this=this;
	     wx.setNavigationBarTitle({
	      title: '确认订单'
	     })
	   wx.getStorage({
	   		key:'orderConfirm',
	   		success(data){
	   			_this.setData({
	   				orderConfirm:data.data
	   			})
	   		}
	   });
	   wx.getStorage({
	   		key:'payTotal',
	   		success(data){
	   			_this.setData({
	   				payTotal:data.data
	   			})
	   		}
	   })

	   dataRequest({
	   	urlParam:'/site',
	   	callback(res){

	   		let names=[],nums=[],floors=res.floor,ids=[];

	   		for(let i=0,len=floors.length;i<len;i++){

	   			names.push(floors[i].name);
	   			nums.push(floors[i].num);
	   			ids.push(floors[i].id);
	   		}

	   		_this.setData({
	   			names:names,
	   			nums:nums,
	   			ids:ids,
	   			floors:floors
	   		})
	   	}
	   })
	},
	bindChange(e){
		const val = e.detail.value
		console.log(val);
	     this.setData({
	      name: this.data.names[val[0]],
	      num: this.data.nums[val[1]],
	      id:this.data.ids[val[0]]
	    })
	},
	changeNote(e){
		this.setData({
			note:e.detail.value
		})

	},
	changeTel(e){
        this.setData({
        	tel:e.detail.value
        })

	},
	changeDetailSite(e){
		this.setData({
			detailSite:e.detail.value
		})
	},
    subToserver(finalData){
    	let _this=this;
	    try {
			  let value = wx.getStorageSync('G-SESSION'),GSESSION="";
              console.log(finalData);
			  if (value) {
			  		console.log(value);
			        GSESSION=value;
				 	wx.request({
						url:`${app.https.URL}/pay?data=${finalData}`,
						header:{
							'G-TOKEN':app.https.GTOKEN,
							'G-SESSION':GSESSION,
							'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
					        "Accept": "application/json;charset=utf-8"
						},
						success(res){
							console.log(res);
							res.data.status==2&&_this.login();
						    dataType(res.data.status)=="Undefined"&&
						    wx.requestPayment({
											   'timeStamp': res.data.timeStamp,
											   'nonceStr': res.data.nonceStr,
											   'package': res.data.package,
											   'signType': 'MD5',
											   'paySign': res.data.paySign,
											   'success':function(res){
											   	console.log(res);
											   },
											   'fail':function(res){
											   }
											})
						}
				  })
			  }
		    } catch (e) { 

		    	console.log("提交到服务器失败");
		 
		    }
    },
	submit(){
		let _this=this,
			GSESSION="",
			orderConfirm=this.data.orderConfirm,
			len=orderConfirm.length,
			idParam='',
			floorParam=Number(`${this.data.id}`),
			noParam=Number(`${this.data.num}`),
			infoParam=`${this.data.name}${this.data.num}层${this.data.detailSite}`,
			phoneParam=`${this.data.tel}`,
			noteParam=`${this.data.note}`,
			pricePram=`${this.data.payTotal}`,
			ordersParam=[],
			dataParam={};
			

		for(let i=0;i<len;i++){
			ordersParam[i]={
				               id:Number(`${orderConfirm[i].id}`),
				               num:Number(`${orderConfirm[i].btnNum}`)
				           };
		}

		idParam="id_num="+idParam.slice(0,-1);

         dataParam={
			phone:phoneParam,
			note:noteParam,
			site:{
				floor:floorParam,
				no:noParam,
				info:infoParam
			},
			orders:ordersParam
	     };

	     console.log('处理前',base64.encoder(JSON.stringify(dataParam)));

		let finalData=encodeURIComponent(base64.encoder(JSON.stringify(dataParam)));
		console.log('处理后',finalData);
		this.setData({
			finalData:finalData
		})
		this.subToserver(finalData);
	
	}
})