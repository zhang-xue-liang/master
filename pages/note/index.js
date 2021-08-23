const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    remarkContent: ''
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
    console.log(data)
    this.setData({
      id: data.id
    })
  },
  confim(){
    console.log(this.data.id)
    const data = {
      remarkContent: this.data.remarkContent,
      workOrderId: this.data.id
    }
    WXAPI.remarkWork(data).then(response => {
      console.log(response)
      if(response.code === 0){
        wx.showToast({
          title: response.data,
          icon: 'none',
          duration: 2000
        })
        this.goBack()
      } else {
        wx.showToast({
          title: response.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 返回上一页
  goBack(){
    var pages = getCurrentPages()
    var beforePage = pages[pages.length - 2]
    beforePage.onLoad()
    wx.navigateBack({
      delta: 1
    })
  }
})