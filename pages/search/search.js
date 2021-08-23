const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const VALIDA = require("../../utils/validate.js")
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    customName: '',
    telephoneNumber: '',
    gdStatus: '',
    workOrderType: '',
    show: false,
    type: '',
    ceatTime: '',
    completeTime: '',
    statusTip: '选择工单状态',
    typeTip: '请选择工单类型',
    time1Tip: '选择创建时间进行搜索',
    time2Tip: '选择完成时间进行搜索',

    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } 
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    currCreatTime: new Date().getTime(),
    currCompleteTime: new Date().getTime(),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  // 点击选择工单状态
  chooseStatus() {
    this.setData({
      show: true,
      type: 'STATUS'
    })
  },
  // 点击选择工单类型
  chooseType() {
    this.setData({
      show: true,
      type: 'TYPE'
    })
  },
  // 选择创建时间
  chooseCreatTime() {
    this.setData({
      show: true,
      type: 'TIME1'
    })
  },
  // 选择完成时间
  chooseCompleteTime(){
    this.setData({
      show: true,
      type: 'TIME2'
    })
  },
  // 确认选择创建时间
  confirmCreatTime(e){
    const data = VALIDA.transformTime(e.detail)
    this.setData({
      ceatTime: data.slice(0,9),
      time1Tip: data.slice(0,9),
    })
    this.cancelCreatTime()
  },
  // 确认选择完成时间
  confirmCompleteTime(e){
    const data = VALIDA.transformTime(e.detail)
    console.log(VALIDA.transformTime(e.detail))
    this.setData({
      completeTime: data.slice(0,9),
      time2Tip: data.slice(0,9),
    })
    this.cancelCreatTime()
  },
  // 取消选择创建时间
  cancelCreatTime() {
    this.setData({
      show: false
    })
  },
  // 确认选择
  confim(e) {
    if (e.currentTarget.dataset.type === 'STATUS'){
      if(e.currentTarget.dataset.value === '4'){
        this.setData({
          statusTip: '全部',
          gdStatus: '4'
        })
      } else if(e.currentTarget.dataset.value === '0'){
        this.setData({
          statusTip: '待接受',
          gdStatus: '0'
        })
      } else if(e.currentTarget.dataset.value === '1'){
        this.setData({
          statusTip: '已接受',
          gdStatus: '1'
        })
      } else if(e.currentTarget.dataset.value === '2'){
        this.setData({
          statusTip: '进行中',
          gdStatus: '2'
        })
      } else if(e.currentTarget.dataset.value === '3'){
        this.setData({
          statusTip: '已完成',
          gdStatus: '3'
        })
      }
    }if (e.currentTarget.dataset.type === 'TYPE'){
      if(e.currentTarget.dataset.value === '4'){
        this.setData({
          typeTip: '全部',
          workOrderType: '4'
        })
      } else if(e.currentTarget.dataset.value === '0'){
        this.setData({
          typeTip: '安装',
          workOrderType: '0'
        })
      } else if(e.currentTarget.dataset.value === '1'){
        this.setData({
          typeTip: '维修',
          workOrderType: '1'
        })
      }
    }
    console.log(e.currentTarget.dataset)
    this.onClose()
  },
  //
  onClose() {
    this.setData({
      show: false
    })
  },
  // 点击立即搜索
  search() {
    const option = {
      customName: this.data.customName,
      telephoneNumber: this.data.telephoneNumber,
      gdStatus: this.data.gdStatus,
      workOrderType: this.data.workOrderType,
      ceatTime: this.data.ceatTime,
      completeTime: this.data.completeTime,
      isSearch: 1
    }
    wx.setStorage({
      key: 'searchData',
      data: option
    })
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})