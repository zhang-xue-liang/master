const WXAPI = require('apifm-wxapi')
const { error } = require('../../utils/toast')
const APP = getApp()
const VALIDA = require("../../utils/validate.js")
const { imgBaseUrl } = require('../../utils/config')

Page({
  data: {
    opiTime: '',
    code: '',
    workOrderId:'',
    workerLocation : '',
    show: false,
    type: '',
    currData: new Date().getTime(),
    currTime: '00:00',
    formatterData(type, value) {
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
    formatterTime(type, value){
      if (type === 'hour') {
        return `${value}时`;
      } 
      if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
    tab_data: [],
    activeId: 1,
    detail: {},
    canpin: {},
    beijian: {},
    huizhi:{},
    logDetail: {},
    pictures: [],
    video: '',
    videoPop: false,
    hzPic: [],
    bJtype: [],
    typeFil: ''
  },
  onLoad: function(e) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const data = currentPage.options;
    this.setData({
      code: data.code,
      workOrderId: data.workOrderId
    })
    this.getBJ()
    this.getHz()
  },
  onShow(){
    this.getSparePartsType()
    this.getDetail()
    this.getOrderLog()
    const date = VALIDA.transformTime(new Date().getTime())
    this.setData({
      currTime: date.slice(9,14)
    })
    wx.setStorage({
      key: 'singPic',
      data: ''
    })
  },
  // 获取备件类型
  getSparePartsType(){
    const data = {}
    WXAPI.getSparePartsType(data).then(response => {
      console.log('gggggggggggggggggggggg',response)
      this.setData({
        bJtype: response.data.records,
        typeFil: function (id) {
          console.log('hhhhhhhhhhhhhh')
          this.data.bJtype.find((item) => {
            if(item.id === id){
              return item.name
            }
          })
        }
      })

      response.data.records.find((item) => {
        return item.id === 8
      })
    })
  },
  // 备件类型筛选
  typeFilt(id){
    console.log('mmmmmmmmmmmmmmmmmmm')
    // this.data.bJtype.find((item) => {
      
    //   return item.id === id
    // })
  },
  // 获取工单详情
  getDetail(){
    const data = {
      id: this.data.workOrderId
    }
    this.setData({
      detail: ''
    })
    WXAPI.getGdDetail(data).then(response => {
      if (response.code === 0){
        this.setData({
          detail: response.data,
          video: imgBaseUrl + response.data.video
        })
        // 根据workerAcceptType判断tab
        if (response.data.workerAcceptType === 3){
          this.setData({
            tab_data: [
              {name:'工单', id:1},
              {name:'产品', id:2},
              {name:'备件', id:3},
              {name:'回执', id:4},
              {name:'评价', id:5},
            ]
          })
        } else {
          this.setData({
            tab_data: [
              {name:'工单', id:1},
              {name:'产品', id:2},
              {name:'备件', id:3},
              {name:'评价', id:5},
            ]
          })
        }
        if(response.data.picture){
          const list = []
          const lis = response.data.picture.split(',')
          lis.forEach((item) => {
            const it = imgBaseUrl + item
            list.push(it)
          })
          this.setData({
            pictures: list
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
  // 获取工单进度
  getOrderLog(){
    const data = {
      workOrderId: this.data.workOrderId
    }
    WXAPI.getWorkOrderLog(data).then(response => {
      if (response.code === 0) {
        this.setData({
          logDetail: response.data.records[0]
        })
      }
    })
  },
  // 修改计划时间
  editTime() {
    if(this.data.detail.workerAcceptType === 1){
      this.setData({
        show: true,
        type: 'TIME1'
      })
    }  
    if(this.data.detail.workerAcceptType === 0 || this.data.detail.workerAcceptType === null) {
      error('暂未接受工单')
    }
  },
  // 看大图
  previewImage(e){
    var curren=e.target.dataset.src
    wx.previewImage({
      current: curren,
      urls: this.data.pictures
    })
  },
  // 播放视频
  playVideo(){
    this.setData({
      videoPop: true
    })
  },
  onVideoClose(){
    this.setData({
      show: false
    })
  },
  onClose(){
    this.setData({
      videoPop: false
    })
  },
  // 确认选择年月日
  confirmData(e){
    const data = VALIDA.transformTime(e.detail)
    this.setData({
      ceatTime: data.slice(0,9)
    })
  },
  confirmTime(e){
    this.setData({
      currTime: e.detail
    })
  },
  // 点击下一步
  next(){
    if(this.data.type === 'TIME1') {
      this.setData({
        type: 'TIME2'
      })
    } else if(this.data.type === 'TIME2'){
      
    }
  },
  // 点击上一步
  previous(){
    if(this.data.type === 'TIME2') {
      this.setData({
        type: 'TIME1'
      })
    }
  },
  // 确定修改计划时间
  confimEditPlanTime(){
    //console.log(this.data.ceatTime,this.data.currTime)
    const data = {
      time: this.data.ceatTime + ' ' + this.data.currTime,
      workOrderId: Number(this.data.workOrderId)
    }
    WXAPI.editPlanTime(data).then(response => {
      if (response.code === 0){
        this.setData({
          show: false
        })
        wx.showToast({
          title: response.data,
          icon: 'none',
          duration: 2000
        })
        this.getDetail()
      } else {
        wx.showToast({
          title: response.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 导航
  openLacation(e) {
    var arr = new Array()
    arr = this.data.detail.workOrderLocation.split(',')
    const latitude = Number(arr[1])
    const longitude = Number(arr[0])
    console.log(arr)
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  // 联系客户
  call(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  // 查看处理进度
  toPlan() {
    wx.navigateTo({
      url: '/pages/plan/index?id=' + this.data.detail.id
    })
  },
  // 切换类型
  changeStatus(e) {
    this.setData({ activeId: e.currentTarget.dataset.id})
    if(e.currentTarget.dataset.id === 2){
      // 获取产品信息
      const data = {
        workOrderId: this.data.workOrderId
      }
      WXAPI.getCP(data).then(response => {
        this.setData({
          canpin: response.data[0]
        })
      })
    } else if(e.currentTarget.dataset.id === 3){
      // 获取备件信息
      
    } else if(e.currentTarget.dataset.id === 4 ){
      // 获取回执信息
      
    }
  },
  // 获取备件信息
  getBJ(){
    const data = {
      code: this.data.code
    }
    WXAPI.getBJ(data).then(response => {
      this.setData({
        beijian: response.data
      })
      wx.setStorage({
        key: 'bjList',
        data: response.data
      })
    })
  },
  // 获取回执信息
  getHz(){
    const data = {
      workOrderCode: this.data.code
    }
    WXAPI.getHZ(data).then(response => {
      this.setData({
        huizhi: response.data,
        hzPic: response.data.enclosure.split(',')
      })
    })
  },
  // 回执附件看大图
  hzPreviewImage(e){
    var curren=e.target.dataset.src
    wx.previewImage({
      current: curren,
      urls: this.data.hzPic
    })
  },
  // 拒绝工单
  jvjue(){
    console.log(this.data.detail)
    wx.navigateTo({
      url: '/pages/refuse/index?workOrderId=' + this.data.detail.id 
    })
  },
  // 接受工单
  jiesou(){
    const data = {
      workOrderId : this.data.workOrderId
    }
    WXAPI.agreeWorkOrder(data).then(response => {
      if(response.code === 0){
        wx.showToast({
          title: response.data,
          icon: 'none',
          duration: 2000
        })
        this.getDetail()
      } else {
        wx.showToast({
          title: response.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 开始工作
  beginWork(){
    if(this.data.workerLocation){
      const data = {
        workOrderCode: this.data.detail.code,
        workerLocation: this.data.workerLocation
      }
      WXAPI.startWork(data).then(response => {
        console.log(response)
        if(response.code === 0){
          this.getDetail()
        } else {
          wx.showToast({
            title: response.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      this.getLocation()
    }
  },
  // 去创建回执
  toCreatHz(){
    wx.navigateTo({
      url: '/pages/receipt/index?clientId=' + this.data.detail.clientId + '&clientAddress=' + this.data.detail.address 
      + '&clientTelephone=' + this.data.detail.clientMobile + '&clientName=' + this.data.detail.clientName
      + '&workOrderCode=' + this.data.detail.code + '&receiptId=' + this.data.workOrderId + '&content=' +  this.data.detail.serviceType
    })
  },
  // 获取位置信息
  getLocation(){
    var that = this
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                // wx.openSetting({
                //   success: function (dataAu) {
                //     console.log('ggggg',dataAu)
                //     if (dataAu.authSetting["scope.userLocation"] == true) {
                //       wx.showToast({
                //         title: '授权成功',
                //         icon: 'success',
                //         duration: 1000
                //       })
                //       //再次授权，调用wx.getLocation的API
                //       console.log('00')
                //       wx.getLocation({
                //         type: 'wgs84',
                //         success (res) {
                //           console.log(res)
                //           const latitude = String(res.latitude)
                //           const longitude = String(res.longitude)
                //           that.setData({
                //             workerLocation: latitude + longitude
                //           })
                //         }
                //       })
                //     } else {
                //       wx.showToast({
                //         title: '授权失败',
                //         icon: 'none',
                //         duration: 1000
                //       })
                //     }
                //   }
                // })

                wx.getLocation({
                  type: 'wgs84',
                  success (res) {
                    console.log(res)
                    const latitude = String(res.latitude)
                    const longitude = String(res.longitude)
                    that.setData({
                      workerLocation: latitude + longitude
                    })
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          console.log('11')
          wx.getLocation({
            type: 'wgs84',
            success (res) {
              const latitude = String(res.latitude)
              const longitude = String(res.longitude)
              that.setData({
                workerLocation: latitude+ longitude
              })
            }
          })
        } else {
          //调用wx.getLocation的API
          console.log('22')
          wx.getLocation({
            type: 'wgs84',
            success (res) {
              const latitude = String(res.latitude)
              const longitude = String(res.longitude)
              that.setData({
                workerLocation: latitude+ ','+ longitude
              })
              console.log('bbbbbbbbbbb',latitude+ longitude)
            }
          })
        }
      }
    })
  }
})