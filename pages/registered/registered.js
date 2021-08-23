const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') 
const VALIDA = require("../../utils/validate.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    idCardPositive: '',
    idCardReverse: '',
    userInfo: {},
    time: '',
    tip: '选择所在地区',
    name: '',
    mobile: '',
    verificationCode: '',
    provinceName: '',
    provinceCode:'',
    cityName: '',
    cityCode:'',
    areaName: '',
    address: '',
    areaCode: '',
    token: wx.getStorageSync('access_token')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow(){
    this.setData({
      time: 0
    })
  },
  // 用户点击允许使用手机号
  getPhoneNumber: function(e) { 
    console.log(e.detail.iv)
    console.log(encodeURIComponent(e.detail.encryptedData))
    wx.login({
      success: res => {
        console.log(res.code)
        // 将上述3个参数传递后端解密并返回用户手机号
      }
    })
   
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    this.setData({userInfo: e.detail.userInfo})
    console.log(this.data.userInfo)
    this.login()
  },
  // 获取短信验证码
  getPhoneC() {
    if (VALIDA.validPhone(this.data.mobile)) {
      const data = {
        mobile: this.data.mobile
      }
      WXAPI.getPhoneCode(data).then(response => {
        console.log(response)
        if (response.code === 0) {
          this.setData({
            time: 60000,
            verificationCode: ''
          })
        } else {
          wx.showToast({
            title: response.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
    }
  },
  finish(){
    this.setData({
      time: 0
    })
  },
  // 展示选择地址弹出层
  showArea() {
    this.selectComponent('#areaPop').showArea()
  },
  // area组件传递得地区信息 type: Array
  areadata(e) {
    console.log(e.detail.data)
    this.setData({
      tip: e.detail.data[0].name + e.detail.data[1].name + e.detail.data[2].name,
      provinceName: e.detail.data[0].name,
      cityName: e.detail.data[1].name,
      areaName: e.detail.data[2].name,
      provinceCode: e.detail.data[0].code,
      cityCode: e.detail.data[1].code,
      areaCode: e.detail.data[2].code
    })
  },
  // 上传身份证正面照
  chooseIdCardPositive(){
    let header = {}
    const token = wx.getStorageSync('access_token')
    header.Authorization = 'Bearer ' + token
    header['TENANT-ID'] = 1
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://zxapi.xn--2qun03at5gw5o.top:443/admin/sys-file/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          header:header,
          name: 'file',
          success (res){
            const data = res.data
            const imgTemp =  JSON.parse(data).data
            that.setData({
              'idCardPositive':'https://zxapi.xn--2qun03at5gw5o.top:443' + imgTemp.url
            })
          }
        })
      }
    })
  },
  // 上传身份证反面照
  chooseIdCardReverse() {
    let header = {}
    const token = wx.getStorageSync('access_token')
    header.Authorization = 'Bearer ' + token
    header['TENANT-ID'] = 1
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://zxapi.xn--2qun03at5gw5o.top:443/admin/sys-file/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          header:header,
          name: 'file',
          success (res){
            const data = res.data
            const imgTemp =  JSON.parse(data).data
            that.setData({
              'idCardReverse':'https://zxapi.xn--2qun03at5gw5o.top:443' + imgTemp.url
            })
            console.log(that.data.idCardReverse,  imgTemp.url)
          }
        })
      }
    })
  },
  // 提交申请
  confim() {
    console.log(this.data)
    const saleWorkerApplyDTO  = {
      name: this.data.name,
      mobile: this.data.mobile,
      verificationCode: this.data.verificationCode,
      idCareFront: this.data.idCardPositive,
      idCardBack: this.data.idCardReverse,
      provinceName: this.data.provinceName,
      cityName: this.data.cityName,
      areaName: this.data.areaName,
      address: this.data.address,
      provinceCode:this.data.provinceCode,
      cityCode:this.data.cityCode,
      areaCode: this.data.areaCode,
    }
    console.log(saleWorkerApplyDTO )
    WXAPI.regeist(saleWorkerApplyDTO).then(response => {
      if(response.code === 0){
        // wx.switchTab({
        //   url: '/pages/index/index',
        // })
        WXAPI.getSHDetail().then(response => {
          if(response.code === 0){
            if(response.data) {
              if(response.data.checkStatus === 0){
                // 未认证，去注册
                wx.navigateTo({
                  url: '/pages/certification/index?id=0',
                })
              } else if(response.data.checkStatus === 1) {
                // 认证中
                wx.navigateTo({
                  url: '/pages/certification/index?id=1',
                })
                
              } else if(response.data.checkStatus === 2){
                // 认证通过
                wx.setStorageSync('username', request.data.data.wxName)
                wx.switchTab({
                  url: '/pages/index/index',
                })
              } else if(response.data.checkStatus === 3){
                // 认证失败
                wx.navigateTo({
                  url: '/pages/certification/index?id=3',
                })
              }
            } else {
              wx.navigateTo({
                url: '/pages/certification/index?id=3',
              })
            }
          } else {
            wx.showToast({
              title: response.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      } else{
        wx.showToast({
          title: response.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})