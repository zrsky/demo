const dataRequest=({ URL='https://test.laifumao.cn/v1',
					 urlParam='',
					 data={},
		             GTOKEN='fZypzpeUeOyh5O0fq9eG0uve5qagXJDmifZF',
		         	 callback})=>{
					     if(Object.prototype.toString.call(urlParam)=="[object String]"){
						 	wx.request({
									  url:`${URL}${urlParam}`, //仅为示例，并非真实的接口地址
									  data:data,
									  header: {
									      'content-type': 'application/json',
									      'G-TOKEN':GTOKEN
									  },
									  success(res) {
									   	callback(res.data); 
									  }
							})
						 }
						 // else if(Object.prototype.toString.call(urlParam)=="[object Array]"){
						 //     if(urlParam.length>0){//当传入urlparam为
						 //     	let len=urlParam.length,resArr=[];
						 //  //    	const promise = urlParam.forEach(function (key,value) {
						 //  //    			return new Promise(function(reslove,reject){
						 //  //    				wx.request({
							// 	// 			  url:`${URL}${key}`, //仅为示例，并非真实的接口地址
							// 	// 			  data:data,
							// 	// 			  header: {
							// 	// 			      'content-type': 'application/json',
							// 	// 			      'G-TOKEN':GTOKEN
							// 	// 			  },
							// 	// 			  success(res) {
							// 	// 			  	reslove(res);
							// 	// 			  }
							// 	// 		  });
						 //  //    			}).then(function(r){
						 //  //    				console.log(r);
						 //  //    			})
							// 	// });


						 //     }
						 // }

 }
 


module.exports=dataRequest;