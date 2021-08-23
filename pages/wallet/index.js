const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: "0",
    walletData: {
      availableAmount: '',
      frozenBalance: ''
    },
    hasMoreData: '',
    current: 1,
    size: 10,
    incomeData: [],
    withdrawalData: [],
    fineData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(this.data.active === '0')
  },
  onShow(){
    this.getPrice()
    this.getSouRu()
  },
  onChange(e) {
    this.setData({active: e.currentTarget.dataset.idx})
    if (e.currentTarget.dataset.idx === '0') {
      this.setData({
        incomeData: [],
        current: 1
      })
      this.getSouRu()
    } else if(e.currentTarget.dataset.idx === '1') {
      this.setData({
        withdrawalData: [],
        current: 1
      })
      this.getTiXian()
    } else {
      this.setData({
        fineData: [],
        current: 1
      })
      this.getFine()
    }
  },
  // 获取余额
  getPrice() {
    WXAPI.getSaleWallet().then(response => {
      console.log(response)
      this.setData({
        walletData: response.data
      })
      console.log(this.walletData.availableAmount)
    })
  },
  // 获取收入记录
  getSouRu(){
    const data = {
      current: this.data.current,
      size: this.data.size
    }
    WXAPI.getRevenueRecord(data).then(response => {
      console.log(response)
      const newList = response.data.records
      const incomeData = this.data.incomeData
      const allList = incomeData.concat(newList)
      this.setData({
        incomeData: allList
      })
      if (response.data.size * response.data.current >= response.data.total) {
        this.setData({
          hasMoreData: false
        })
      }
    })
  },
  // 获取提现记录
  getTiXian(){
    const data = {
      current: this.data.current,
      size: this.data.size
    }
    WXAPI.getRevengetRevenueRecord(data).then(response => {
      const newList = response.data.records
      const withdrawalData = this.data.withdrawalData
      const allList = withdrawalData.concat(newList)
      this.setData({
        withdrawalData: allList
      })
      if (response.data.size * response.data.current >= response.data.total) {
        this.setData({
          hasMoreData: false
        })
      }
    })
  },
  // 罚款记录
  getFine(){
    const data = {
      current: this.data.current,
      size: this.data.size
    }
    WXAPI.getFine(data).then(response => {
      console.log(response)
      const newList = response.data.records
      const fineData = this.data.fineData
      const allList = fineData.concat(newList)
      this.setData({
        fineData: allList
      })
      if (response.data.size * response.data.current >= response.data.total) {
        this.setData({
          hasMoreData: false
        })
      }
    })
  },
  // 去提现
  toTX() {
    wx.navigateTo({
      url: '/pages/withdrawal/index',
    })
  },
  // 页面上拉触底事件
  onReachBottom(){
    if (this.data.hasMoreData) {
      this.setData({
        current: this.data.current + 1
      })
      if (this.data.active === '0') {
        this.getSouRu()
      } else if(this.data.active === '1') {
        this.getTiXian()
      } else {
        this.getFine()
      }
    }
  }
})