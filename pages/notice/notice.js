const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    GdNum: '',
    sysNum: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    this.getNum()
  },
  onLoad: function(options) {
    
  },
  getNum(){
    WXAPI.getNotifyListTotal().then(response => {
      console.log(response)
      this.setData({
        GdNum: response.data.commonTotal,
        sysNum: response.data.systemTotal,
      })
    })
  },
  toGdNotice() {
    wx.navigateTo({
      url: '/pages/gdNotice/index',
    })
  },
  toSystemNotice() {
    wx.navigateTo({
      url: '/pages/systemNotice/index',
    })
  }
})