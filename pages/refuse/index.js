const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    workOrderId: '',
    remarkContent: ''
  },
  onShow(){
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const data = currentPage.options;
    this.setData({
      workOrderId: data.workOrderId
    })
  },
  confim(){
    const data = {
      refuseRemark: this.data.remarkContent,
      workOrderId: this.data.workOrderId
    }
    WXAPI.refuseWorkOrder(data).then(response => {
      if(response.code === 0){
        wx.showToast({
          title: response.data,
          icon: 'none',
          duration: 2000
        })
        wx.navigateTo({
          url: '/pages/index/index'
        })
      } else {
        wx.showToast({
          title: response.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})