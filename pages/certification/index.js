const WXAPI = require('apifm-wxapi')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    token: ''
  },
  onShow(){
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const data = currentPage.options;
    console.log(data, 'jjjj')
    this.setData({
      id: Number(data.id),
      token: wx.getStorageSync('access_token')
    })
  },
  // 去认证
  toReg(){
    wx.navigateTo({
      url: '/pages/agreement/index?id=0',
    })
  },
  // 刷新
  shuxin(){
    WXAPI.getSHDetail().then(response => {
      console.log('师傅详情接口返回数据',response)
      if(response.code === 0){
        if(response.data) {
          if(response.data.checkStatus === 2){
            // 认证通过
            wx.setStorageSync('username', request.data.data.wxName)
            wx.switchTab({
              url: '/pages/index/index',
            })
          } else {
            this.setData({
              id: Number(response.data.checkStatus)
            })
          }
        }
      }
    })
  }
})