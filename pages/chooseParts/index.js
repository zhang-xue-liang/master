const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodData: [],
    idArr:[],
    name:'',
    current: 1,
    size: 10,
    hasMoreData: true,
    list: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow(){
    this.setData({
      goodData: [],
      list: [],
      idArr: []
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
      console.log(response)
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
  choosePar(e){
    var id =e.currentTarget.dataset.id
    var name =e.currentTarget.dataset.name
    var ind = e.currentTarget.dataset.ind
    let index = this.data.idArr.indexOf(id)
    var check = "goodData["+ind+"].check"
    if (index > -1) {
      this.data.idArr.splice(index,1)
      this.setData({
        [check]:false
      })
    }else{
      this.data.idArr.push(id)
      this.setData({
        [check]:true
      })
    }
  },
  // 页面上拉触底事件
  onReachBottom() {
    console.log('gg')
    if (this.data.hasMoreData) {
      this.setData({
        current: this.data.current + 1
      })
      this.getList()
    }
  },
  // 搜索
  enter(){
    this.setData({
      goodData: []
    })
    this.getList()
  },
  // 点击确定
  confirm(){
    this.setData({
      list: []
    })
    this.data.idArr.forEach(item => {
      this.data.goodData.forEach(ite => {
        if(item === ite.id) {
          ite.num = 1
          this.data.list.push(ite)
        }
      })
    })
    wx.setStorage({
      key: 'bjList',
      data: this.data.list
    })
    wx.navigateTo({
      url: '/pages/receipt/index',
    })
    console.log(this.data.list)
  }
})