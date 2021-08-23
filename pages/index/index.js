const WXAPI = require('apifm-wxapi')
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const check =  require('../../utils/auth.js')
var qqmapsdk;
const APP = getApp()

Page({
  data: {
    current: 1,
    size: 10,
    loca: '',
    hasMoreData: true,
    completeTime: '',
    createTime: '',
    customName: '',
    planTimeType: '',
    status: '',
    telephoneNumber: '',
    workOrderType: '',
    workerId: '',
    list: []
  },
  onShow(){
    check.checkHasLogined().then(res => {
      console.log(res)
      if(!res){
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }
    })
    qqmapsdk = new QQMapWX({//创建实例
      key: 'NRZBZ-ODT63-LQL3M-YIBYO-JRGUJ-4IBHP' //这里自己的key秘钥进行填充，该key是腾讯位置服务中申请的
    });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.selectComponent('#screeningPop').onClose()
    wx.getStorage({
      key: 'searchData',
      success: (res) => {
        console.log(res.data)
        this.setData({
          customName: res.data.customName,
          telephoneNumber: res.data.telephoneNumber,
          status: res.data.gdStatus,
          workOrderType: res.data.workOrderType,
          createTime: res.data.ceatTime,
          completeTime: res.data.completeTime,
        })
        console.log('3', res.data.isSearch)
        if (res.data.isSearch ===1){  
          console.log('1')
          this.setData({
            list: []
          })
          this.getList()
          wx.setStorage({
            key: 'searchData',
            data: []
          })
          this.setData({
            completeTime: '',
            createTime: '',
            customName: '',
            planTimeType: '',
            status: '',
            telephoneNumber: '',
            workOrderType: '',
            workerId: '',
          })
        } else {
          
        }
      },
      fail: (err) =>{
        // this.setData({
        //   list: []
        // })
        // this.getList()
      }
    })
    this.selectComponent('#gdTab').getNumber()
  },
  onLoad(){
    this.setData({
      list: []
    })
    this.getList()
  },
  getList() {
    const data = {
      size: this.data.size,
      current: this.data.current,
      completeTime: this.data.completeTime,
      createTime: this.data.createTime,
      customName: this.data.customName,
      planTimeType: this.data.planTimeType,
      status: this.data.status,
      telephoneNumber: this.data.telephoneNumber,
      workOrderType: this.data.workOrderType,
      workerId: this.data.workerId
    }
    if(!this.data.completeTime){
      delete data.completeTime
    }  if(!this.data.createTime){
      delete data.createTime
    }  if(!this.data.customName){
      delete data.customName
    }  if(!this.data.planTimeType){
      delete data.planTimeType
    }  if(this.data.status === '' || this.data.status === undefined || this.data.status === null){
      delete data.status
    }  if(!this.data.telephoneNumber){
      delete data.telephoneNumber
    }  if(!this.data.workOrderType){
      delete data.workOrderType
    }  if(!this.data.workerId){
      delete data.workerId
    }
    console.log(data)
    WXAPI.getGd(data).then(response => {
      const newList = response.data.records
      const oldList = this.data.list
      const allList = oldList.concat(newList)
      this.setData({
        list: allList
      })
      if (response.code === 0) {
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
  // 切换类型
  changeTab(e) {
    if (e.detail === 4) {
      this.setData({
        status: ''
      })
    } else {
      this.setData({
        status: e.detail
      })
    }
    this.setData({
      list: []
    })
    this.getList()
  },
  // 筛选
  search(e) {
    this.setData({
      status: e.detail.statusId,
      workOrderType: e.detail.typeId,
      planTimeType: e.detail.timeId
    })
    this.setData({
      list: []
    })
    this.getList()
    this.setData({
      completeTime: '',
      createTime: '',
      customName: '',
      planTimeType: '',
      status: '',
      telephoneNumber: '',
      workOrderType: '',
      workerId: '',
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
  // 展示侧边弹出层
  showScreening() {
    this.selectComponent('#screeningPop').showPop()
  },
  toOrderDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/orderDetail/index?code=' + e.currentTarget.dataset.code + '&workOrderId=' + e.currentTarget.dataset.id,
      //url: '/pages/orderDetail/index?code=' + 1234 + '&workOrderId=' + 1,
    })
  }
})