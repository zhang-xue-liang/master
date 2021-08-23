const WXAPI = require('apifm-wxapi')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
    id: ''
  },
  onShow(){
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const data = currentPage.options;
    this.setData({
      id: data.id
    })
    this.getList()
  },
  getList(){
    const data = {
      type: 0
    }
    WXAPI.agreement(data).then(response => {
      console.log(response)
      if(response.code === 0){
        this.setData({
          detail: response.data
        })
      }
    })
  },
  toReg(){
    wx.navigateTo({
      url: '/pages/registered/registered',
    })
  }
})