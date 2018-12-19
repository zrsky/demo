// pages/goods/cart/cart.js
import {
	QuantityPanel
} from '../../../component/quantity/quantity';
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		pageNo: 1,
		pageSize: 5,
		total: 0,
		text: '加载中...',
		loading: false,
		position: 'fixed',
		marginTop: '60rpx',
		scrollTop: 0,
		animationData: {},
		totalPrice: 0,
		gsgBizId: [],
		checkAll: false,
		manage: false,
		cartData: [],
		scrollTop: 200,
		isShow: false

	},
	//监听页面滚动
	onPageScroll(e) {
		var _this = this;
		wx.createSelectorQuery().select('#cart').boundingClientRect(function(rect) {
			if (rect && rect.top > 0) {
				_this.setData({
					position: 'static',
					marginTop: '0rpx'
				})
			} else {
				_this.setData({
					position: 'fixed',
					marginTop: '60rpx'
				})
			}
		}).exec()
	},
	//事件函数
	goIndex() {
		wx.navigateTo({
			url: '../goodsList/goodsList',
		});
	},
	checkAll(e) {
		let checkAll = !this.data.checkAll;
		this.storeToggleChecked(checkAll);
		this.setData({
			checkAll: checkAll
		})
		if (!this.data.manage) {
			this.updateTotalPrice();
		}
	},
	//店铺是否选中
	storeToggleChecked(checkAll) {
		if (checkAll) {
			this.data.cartData.forEach((item, index) => {
				if (!item.disabled) {
					item.checked = true;
					item.children.forEach((son) => {
						if (!son.disabled) {
							son.checked = true;
						}
					})
				}
			});
		} else {
			this.data.cartData.forEach((item, index) => {
				if (!item.disabled) {
					item.checked = false;
					item.children.forEach((son) => {
						if (!son.disabled) {
							son.checked = false;
						}
					})
				}
			});
		}
		this.setData({
			cartData: this.data.cartData
		})
	},
	//点击时店铺是否勾选
	change(e) {
		let disabled = this.data.cartData[e.target.dataset.index].disabled;
		if (disabled) {
			return;
		}
		this.data.cartData[e.target.dataset.index].checked = !this.data.cartData[e.target.dataset.index].checked;
		this.setData({
			cartData: this.data.cartData
		});
		this.data.checkAll = true;
		this.data.cartData.forEach((value) => {
			if (!value.disabled && !value.checked) {
				this.data.checkAll = false;
			}
		})
		this.setData({
			checkAll: this.data.checkAll
		});
		this.goodCheckedByStore(e.target.dataset.index);
		if (!this.data.manage) {
			this.updateTotalPrice();
		}

	},
	// 点击时商品是否勾选
	change1: function(e) {
		var parentIdx = e.target.dataset.parentidx;
		var sonIdx = e.target.dataset.sonidx;
		let disabled = this.data.cartData[parentIdx].children[sonIdx].disabled;
		if (disabled) {
			return;
		}
		var checked = this.data.cartData[parentIdx].children[sonIdx].checked;
		this.data.cartData[parentIdx].children[sonIdx].checked = !checked;
		this.setData({
			cartData: this.data.cartData
		});
		this.storeCheckedByGood();
		// this.storeCheckedByGood(parentIdx);
		if (!this.data.manage) {
			this.updateTotalPrice();
		}
	},
	//根据商品判断店铺是否选中
	storeCheckedByGood(index) {
		let checked = false;
		this.data.cartData.forEach((item) => {
				item.checked = true;
				item.children.forEach((son) => {
					if (!son.disabled && !son.checked) {
						item.checked = false;
					}
					if (!son.disabled) {
						checked = true;
					}
				})
				if (!checked) {
					item.checked = false
				}
			})
			// this.data.cartData[index].checked = true;
			// this.data.cartData[index].children.forEach((item) => {
			//   if (!item.disabled && !item.checked) {
			//     this.data.cartData[index].checked = false;
			//   }
			//   if (!item.disabled) {
			//     checked = true;
			//   }
			// })
		this.setData({
			cartData: this.data.cartData
		});
		this.checkAllByStore();
	},
	//根据店铺判断商品是否选中
	goodCheckedByStore(index) {
		this.data.cartData[index].children.forEach((item) => {
			if (!item.disabled) {
				item.checked = this.data.cartData[index].checked;
			}
		})
		this.setData({
			cartData: this.data.cartData
		});
	},
	//根据店铺判断是否全选
	checkAllByStore() {
		let checked = false;
		this.data.checkAll = true;
		this.data.cartData.forEach((item) => {
			if (!item.disabled && !item.checked) {
				this.data.checkAll = false;
				return;
			}
			if (!item.disabled) {
				checked = true;
			}
		})
		if (!checked) {
			this.data.checkAll = false;
		}

		this.setData({
			checkAll: this.data.checkAll
		})
	},
	goodtap: function(event) {
		return false;
	},
	//计算总价格
	updateTotalPrice() {
		this.data.totalPrice = 0;
		this.data.cartData.forEach((item, index) => {
			if (!item.disabled) {
				item.children.forEach((item1, index1) => {
					if (!item1.disabled && item1.checked) {
						this.data.totalPrice += item1.price * item1.buyNum;
					}
				})
			}
		});
		this.setData({
			totalPrice: this.data.totalPrice.toFixed(2)
		});
	},
	//获取商品ID
	getgsgBizId() {
		this.data.gsgBizId = [];
		this.data.cartData.forEach((item, index) => {
			if (!item.disabled) {
				item.children.forEach((item1, index1) => {
					if (!item1.disabled && item1.checked) {
						this.data.gsgBizId.push(item1.gsgBizId);
					}
				})
			}
		})
		return this.data.gsgBizId.join(',');
	},
	//管理事件
	cartManage() {
		this.setData({
			manage: !this.data.manage
		})
		this.getCartListByEdit();
	},
	//删除事件
	delete() {
		let gsgBizId = this.getgsgBizId();
		let data = {
			token: app.globalData.token,
			gsgBizId: gsgBizId
		}
		if (!gsgBizId) {
			let text = '请选择商品';
			this.showToast(text);
			return;
		}
		app.postRequest(app.globalData.api.deleteCartGoods, data).then((res) => {
				if (res.data.code === "200" && res.data.success) {
					let text = '删除成功';
					this.showToast(text);
					this.getCartList(1);
				} else {
					let text = '删除失败';
					this.showToast(text);
				}
			})
			//  this.updateTotalPrice();
	},
	//下单
	submit() {
		let gsgBizId = this.getgsgBizId();
		let data = {
			token: app.globalData.token,
			checked: 1,
			gsgBizId: JSON.stringify(gsgBizId)
		}
		if (gsgBizId == "") {
			let text = '请选择商品';
			this.showToast(text);
			return;
		}
		this.checkGoodsInvalid();

	},
	//获取购物车id
	getBizIds() {
		let bizIds = [];
		this.data.cartData.forEach((item) => {
			item.children.forEach((son) => {
				if (son.checked) {
					bizIds.push(son.shopCartBizId)
				}
			})
		})
		return bizIds;
	},
	// 验证商品是否失效
	checkGoodsInvalid() {
		let bizIds = this.getBizIds();
		let data = {
			token: app.globalData.token,
			bizIds: bizIds
		};
		app.postRequest(app.globalData.api.checkInvalid, data).then((res) => {
			if (res.data.code === "200" && res.data.success && res.data.data) {
				let result = this.getCheckedGoods();
				wx.navigateTo({
					url: '../cartConfirmOrders/cartConfirmOrders?result=' + JSON.stringify(result),
				})
			} else if (res.data.code === "500" && !res.data.success && !res.data.data) {
				wx.showToast({
					title: res.data.message,
					icon: 'none',
					duration: 1000
				});
				this.getCartList(1);
			}
		})
	},

	//获取已勾选的商品
	getCheckedGoods() {
		if (this.data.cartData.length > 0) {
			let result = [],
				child;
			this.data.cartData.forEach((item) => {
				if (item.children && item.children.length > 0) {
					child = {};
					child.children = [];
					child.id = item.id;
					child.title = item.title;
					item.children.forEach((item1) => {
						if (item1.checked) {
							child.children.push(item1)
						}
					})
					if (child.children && child.children.length > 0) {
						result.push(child);
					}
				}
			});
			return result;
		}
	},
	//编辑时重新获取购物车列表
	getCartListByEdit() {
		if (this.data.manage) {
			this.data.cartData.forEach((item) => {
				if (item.children && item.children.length > 0) {
					if (item.disabled) {
						item.disabled = false;
					}
					item.children.forEach((item1) => {
						if (item1.disabled) {
							item1.disabled = false;
						}
					})
					if (item.checked) {
						item.children.forEach((item1) => {
							item1.checked = true;
						})
					}
				}
			});
		} else {
			// let flag = false;
			this.data.cartData.forEach((item) => {
				if (item.children && item.children.length > 0) {
					let checked = item.checked;
					item.disabled = true;
					item.checked = false;
					item.children.forEach((item1) => {
						if (item1.states == 0) {
							item1.disabled = true;
							item1.checked = false;

						} else {
							item.disabled = false;
							item.checked = checked;
							// flag = true;
						}
					})
				}
			});
			// if (!flag && this.data.checkAll == true) {
			//     this.data.checkAll = false;
			// }
			this.updateTotalPrice();
			this.storeCheckedByGood();
		}
		this.invalidGoodsByCheckAll();
		this.setData({
			cartData: this.data.cartData,
			checkAll: this.data.checkAll
		})
	},
	//管理时根据全选是否勾选失效商品
	invalidGoodsByCheckAll() {
		if (this.data.checkAll) {
			this.data.cartData.forEach((item, index) => {
				item.checked = !item.disabled ? true : false;
				item.children.forEach((son) => {
					son.checked = !son.disabled ? true : false;
				})
			});
		}
	},
	//获取购物车列表
	getCartList(type) {
		if (type == 1 || type == 0) {
			this.data.pageNo = 1;
			this.data.cartData = [];
		}
		let data = {
			token: app.globalData.token,
			pageNo: this.data.pageNo,
			pageSize: this.data.pageSize
		};
		app.postRequest(app.globalData.api.cartList, data).then((res) => {
			if (res.data.code === "200" && res.data.success) {
				if (res.data.data.data && res.data.data.data.length > 0) {
					let child, disabled;
					res.data.data.data.forEach((item, index) => {
						if (item.data && item.data.length > 0) {
							child = {};
							child.children = [];
							child.id = item.shareId;
							child.title = item.shareName;
							child.checked = false;
							child.disabled = true;
							item.data.forEach((item1) => {
								if (item1.states == 1) {
									child.disabled = false;
									disabled = false;
								} else if (item1.states == 0) {
									disabled = true;
								}
								child.children.push({
									id: item1.id,
									gsgBizId: item1.gsgBizId,
									title: item1.goodsTitle,
									imageUrl: item1.goodsImg,
									des: (item1.skuGroupStr).split(' '),
									price: item1.priceStr,
									buyNum: item1.quantity,
									inventory: item1.totalQuantity,
									checked: false,
									disabled: disabled,
									states: item1.states,
									goodsCode: item1.goodsBizId, //商品业务id
									activityId: item1.activityBizId,
									skuCode: item1.gsgBizId,
									sellerBizId: item1.shareBizId, //卖家业务id
									shopCartBizId: item1.bizId, //购物车id
									shareUserId: item1.moneyBizId, //商品分享人id
								})
							})
							this.data.cartData.push(child);
						}
					});
					this.setData({
						cartData: this.data.cartData,
						total: res.data.data.totalCount,
						checkAll: false
					});
					this.getCartListByEdit();
				} else {
					if (this.data.pageNo == 1) {
						this.setData({
							cartData: [],
							isShow: true,
						});
					}
				}
				if (this.data.pageNo !== 1) {
					this.setData({
						loading: false
					});
				}
				if (type == 0) {
					wx.hideNavigationBarLoading()
					wx.setNavigationBarTitle({
						title: '购物车'
					})
					wx.stopPullDownRefresh();
				}
			}
		})
	},
	showToast(text) {
		wx.showToast({
			title: text,
			icon: 'none',
			duration: 1000
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		//注册组件
		new QuantityPanel();
		// this.getCartList(1);
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
		this.getCartList(1);
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
	 * 页面上拉触底事件的处理函数
	 */
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		// 页数+1
		let pageNo = this.data.pageNo + 1;
		if (pageNo > Math.ceil(this.data.total / this.data.pageSize)) {
			wx.showToast({
				title: '已经滑到底了！！！',
				icon: 'none',
				duration: 1000,
			});
			return false;
		}
		this.setData({
			loading: true
		})
		this.data.pageNo = pageNo;
		this.getCartList();

	},


	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	//页面下拉处理
	onPullDownRefresh: function() {
		let _this = this;
		wx.showNavigationBarLoading()
		wx.setNavigationBarTitle({
			title: '加载中...'
		})
		this.getCartList(0);
	}
})