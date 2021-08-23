const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    show: false,
    current: 1,
    size: 10,
    hasMoreData: true,
    readStatus: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow(){
    this.getList()
  },
  showPop(){
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  // 全部标记已读
  confim() {
    const data = {
      type: 1
    }
    WXAPI.noticeRead(data).then(response => {
      console.log(response)
      if (response.code === 0) {
        this.onClose()
        this.setData({
          list: []
        })
        this.getList()
      } else {
        wx.showToast({
          title: request.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取消息列表
  getList() {
    const data = {
      notifyType: 1,
      readStatus: this.data.readStatus,
      workerId: '',
      current: this.data.current,
      size: this.data.size
    }
    WXAPI.getNotice(data).then(response => {
      const newList = response.data.records
      const oldList = this.data.list
      const allList = oldList.concat(newList)
      this.setData({
        list: allList
      })
      if (response.data.size * response.data.current >= response.data.total) {
        this.setData({
          hasMoreData: false
        })
      }
    })
  },
  // 筛选
  sectConfim(data){
    this.setData({
      readStatus: data.detail.data.typeAcId==='3'?'':data.detail.data.typeAcId,
      current: 1
    })
    this.setData({
      list: []
    })
    this.getList()
  },
  // 页面上拉触底事件
  onReachBottom(){
    if (this.data.hasMoreData) {
      this.setData({
        current: this.data.current + 1
      })
      this.getList()
    }
  }
})