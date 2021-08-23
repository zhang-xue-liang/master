const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    availableAmount: '',
    amount: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow(){
    this.getPrice()
  },
  // 获取余额
  getPrice() {
    WXAPI.getSaleWallet().then(response => {
      console.log(response)
      this.setData({
        availableAmount: response.data.availableAmount
      })
    })
  },
  // 点击全部
  handleAll(){
    this.setData({
      amount: this.data.availableAmount
    })
  },
  withdrawalNow() {
    const data = {
      amount: this.data.amount,
      applyUserId: '',
      applyUserName: '',
      mobile: '',
      name: '',
      wxAccount: ''
    }
    WXAPI.withdrawal(data).then(response => {
      console.log(response)
    })
  }
})