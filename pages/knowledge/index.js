const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    current: 1,
    size: 10,
    hasMoreData: true,
  },

  onLoad(){
    this.setData({
      list: []
    })
    this.getList()
  },
  // 获取列表
  getList(){
    const data = {
      type: 0,
      current: this.data.current,
      size: this.data.size
    }
    WXAPI.getKnowledge(data).then(response => {
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
  // 页面上拉触底事件
  onReachBottom(){
    if (this.data.hasMoreData) {
      this.setData({
        current: this.data.current + 1
      })
      this.getList()
    }
  },
  toDetail(e){
    console.log(e)
    wx.setStorage({
      key: 'knowledge',
      data: e.currentTarget.dataset.id.content
    })
    wx.navigateTo({
      url: '/pages/knowledgeDetail/index?id=' + e.currentTarget.dataset.id.content +'&attach=' + e.currentTarget.dataset.id.attach,
    })
  }
})