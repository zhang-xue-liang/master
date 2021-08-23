const WXAPI = require('apifm-wxapi')
const { imgBaseUrl } = require('../../utils/config')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
    attach: [],
    loading: false,
    filePath: '',
    show: false
  },
  onShow(){
    this.setData({
      loading: false,
      show: false
    })
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const data = currentPage.options;
    console.log('rrrrrrrrr',data)
    this.setData({
      detail: data.id,
      attach: JSON.parse(data.attach)
    })
    // wx.getStorage({
    //   key: 'knowledge',
    //   success: (res) => {
    //     this.setData({detail: res.data})
    //   }
    // })
    console.log(this.data,'lllllllll')
  },
  onClose(){
    console.log('bbbbbbbbbbbbbbbbbbbbbbbb')
    this.setData({
      show: false  
    })
  },
  // 下载附件
  downlod(e){
    console.log(e)
    var that = this
    this.setData({
      loading: true  
    })
    wx.downloadFile({
      url: imgBaseUrl+ e.currentTarget.dataset.url,
      success: function (res) {
        that.setData({
          loading: false,
          filePath: res.tempFilePath,
          show: true
        }) 
      }
    })
  },
  openFile(){
    var that = this
    this.onClose()
    wx.openDocument({   
      filePath: this.data.filePath,   
      success: function (res) {
        that.onClose()
      }
    })
  }
})