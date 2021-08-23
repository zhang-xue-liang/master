const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    logDetail: '',
    length: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow(){
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const data = currentPage.options;
    this.setData({
      id: data.id
    })
    this.getOrderLog()
  },
  // 获取进度详情
  getOrderLog(){
    const data = {
      workOrderId: this.data.id
    }
    this.setData({
      logDetail: []
    })
    WXAPI.getWorkOrderLog(data).then(response => {
      console.log(response)
      if (response.code === 0) {
        this.setData({
          logDetail: response.data.records
        })
        this.setData({
          length: response.data.records.length -1
        })
      }
    })
  },
  // 点击刷新
  shuaxin(){
    this.getOrderLog()
  },
  toNote() {
    wx.navigateTo({
      url: '/pages/note/index?id=' + this.data.id,
    })
  }
})