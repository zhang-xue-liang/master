const app = getApp()
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js')

Page({
	data: {
    show: false,
    wxlogin: true,
    username: '',
    avatar: '',
    orderData: {},
    settlementData: {},
    availableAmount: ''
  },
	onLoad() {
    wx.getStorage({
      key: 'username',
      success: (res) => {
        this.setData({username: res.data})
      }
    })
    wx.getStorage({
      key: 'avatar',
      success: (res) => {
        this.setData({avatar: res.data})
      }
    })
  },
  onUnload() {
  },
  onShow() {
    console.log('fffff', this)
    this.getOrderNumber()
    this.getPrice()
    this.getsettlement()
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },
  // 获取订单数量
  getOrderNumber() {
    const data = {
      path: 1,
      query: {}
    }
    WXAPI.getAllOrderNumber().then(response => {
      if (response.code === 0) {
        this.setData({
          orderData: response.data
        })
      } else {
        wx.showToast({
          title: response.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取余额
  getPrice() {
    WXAPI.getSaleWallet().then(response => {
      console.log(response)
      if(response.data !=null){
        this.setData({
          availableAmount: response.data.availableAmount
        })
      }
    })
  },
  // 获取结算信息
  getsettlement() {
    WXAPI.getSettlement().then(response => {
      if (response.code === 0) {
        this.setData({
          settlementData: response.data
        })
      } else {
        wx.showToast({
          title: response.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // 去我的钱包
  toWallet() {
    wx.navigateTo({
      url: '/pages/wallet/index',
    })
  },
  // 工单记录
  toGdRecord(){
    wx.navigateTo({
      url: '/pages/gdRecord/index',
    })
  },
  // 今日结算
  toSettlement(e) {
    wx.navigateTo({
      url: '/pages/settlement/index?id=' + e.currentTarget.dataset.id,
    })
  },
  // 知识库
  toKnowledge() {
    wx.navigateTo({
      url: '/pages/knowledge/index',
    })
  },
  // 隐私政策
  toAgreement(e) {
    wx.navigateTo({
      url: '/pages/agreement/index?id=' + e.currentTarget.dataset.id,
    })
  },
  // 备件
  toRepairSho() {
    wx.navigateTo({
      url: '/pages/repairShop/index',
    })
  },
  // 退出登录
  loginOut(){
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  // 退出登录
  confim() {
    wx.removeStorageSync('access_token')
    wx.reLaunch({
      url: '/pages/login/index'
    })
    this.onClose()
  },
  // 获取手机号
  getPhoneNumber: function(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: e.detail.errMsg,
        showCancel: false
      })
      return;
    }
    WXAPI.bindMobileWxa(wx.getStorageSync('token'), e.detail.encryptedData, e.detail.iv).then(res => {
      if (res.code === 10002) {
        this.setData({
          wxlogin: false
        })
        return
      }
      if (res.code == 0) {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
        this.getUserApiInfo();
      } else {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
})