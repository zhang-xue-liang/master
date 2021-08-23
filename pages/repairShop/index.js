const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodData: [],
    name:'',
    current: 1,
    size: 10,
    hasMoreData: true
  },
  onShow(){
    this.setData({
      goodData: []
    })
    this.getList()
  },
  getList(){
    const data = {
      name: this.data.name,
      current: this.data.current,
      size: this.data.size
    }
    WXAPI.getSparePartsList(data).then(response => {
      if (response.code ===0){
        const newRecords = response.data.records
        const oldRecords = this.data.goodData
        const allRecords = oldRecords.concat(newRecords)
        this.setData({
          goodData: allRecords
        })
        if (response.data.size * response.data.current >= response.data.total) {
          this.setData({
            hasMoreData: false
          })
        }
      } else {
        wx.showToast({
          title: request.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 搜索
  enter(){
    this.setData({
      goodData: []
    })
    this.getList()
  },
  // 页面上拉触底事件
  onReachBottom() {
    if (this.data.hasMoreData) {
      this.setData({
        current: this.data.current + 1
      })
      this.getList()
    }
  },
  
})