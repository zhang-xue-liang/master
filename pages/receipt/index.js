const WXAPI = require('apifm-wxapi')
const { error } = require('../../utils/toast')
const drawQrcode  = require('../../utils/weapp.qrcode.js');
const { imgBaseUrl, uploadUrl } = require('../../utils/config')
var qrcode;
const APP = getApp()

Page({
  data: {
    imgalist: [
      imgBaseUrl + '/admin/sys-file/zx5j/da787a9a4af34de7abd83c7195c84cfc.png',
      imgBaseUrl +'/admin/sys-file/zx5j/f33c8f4c3e364634b3b03b219dcf673e.png',
      imgBaseUrl +'/admin/sys-file/zx5j/cfceb713b5bf4b4988dff94280aa7882.png'
    ],
    uploadImgList: [],
    order: {},
    discountFee: 0,
    number: '',
    saleWorkOrderReceipt :{},
    bjList: [],
    totalFee:'',
    singPic: '',
    show: false,
    showPay: false,
    apiList: [],
    btntip: ''
  },
  onLoad: function(e) {
   
  },
  onShow(){
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const data = currentPage.options;
    this.setData({
      order: data
    })
    wx.getStorage({
      key: 'singPic',
      success: (res) => {
        this.setData({singPic: res.data})
      }
    })
    wx.getStorage({
      key: 'bjList',
      success: (res) => {
        this.setData({bjList: res.data})
        this.handelTotal()
        // debugger
        console.log('nnnnnn',res.data,this.data.bjList)
      }
    })
    
  },
  // 上传图片
  uplodImg() {
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
              uploadImgList: that.data.uploadImgList.concat('https://zxapi.xn--2qun03at5gw5o.top:443' + imgTemp.url)
            })
            console.log(that.data.uploadImgList, 'bbbbbbbb')
          }
        })
      }
    })
  },
  // 删除上传的图片
  delImg(e) {
    this.data.uploadImgList.splice(e.currentTarget.dataset.id,1)
    console.log(e.currentTarget.dataset.id,this.data.uploadImgList)
    this.setData({
      uploadImgList: this.data.uploadImgList
    })
  },
  // 预览示例图
  previewImage(e) {
    var current=e.target.dataset.src
    wx.previewImage({
      current: current, 
      urls: this.data.imgalist
    })
  },
  // 预览上传的图片
  previewUplodImg(e) {
    var current=e.target.dataset.src
    wx.previewImage({
      current: current, 
      urls: this.data.uploadImgList
    })
  },
  // 选择备件
  toChoose() {
    wx.navigateTo({
      url: '/pages/chooseParts/index',
    })
  },
  // 删除备件
  delBJ(e){
    console.log('删除备件',e,this.data.bjList)
    this.data.bjList[e.currentTarget.dataset.key1].list.splice(e.currentTarget.dataset.key2,1)
    this.setData({
      bjList: this.data.bjList,
      discountFee: 0
    })
    wx.setStorage({
      key: 'bjList',
      data: this.data.bjList
    })
    this.handelTotal()
  },
  // 减备件数量
  cutNUm(e){
    console.log(this.data.bjList[Number(e.currentTarget.dataset.key1)].list[Number(e.currentTarget.dataset.key2)].number)
    if (this.data.bjList[Number(e.currentTarget.dataset.key1)].list[Number(e.currentTarget.dataset.key2)].number > 1){
      this.data.bjList[Number(e.currentTarget.dataset.key1)].list[Number(e.currentTarget.dataset.key2)].number = this.data.bjList[Number(e.currentTarget.dataset.key1)].list[Number(e.currentTarget.dataset.key2)].number - 1
    } else {
      error('最低1件')
    }
    this.setData({
      bjList: this.data.bjList
    })
    this.handelTotal()
  },
  // 加备件数量
  addNUm(e){
    console.log(this.data.bjList[0], this.data.bjList[Number(e.currentTarget.dataset.id)].num + 1)
    this.data.bjList[Number(e.currentTarget.dataset.id)].num = this.data.bjList[Number(e.currentTarget.dataset.id)].num + 1
    console.log(this.data.bjList)
    this.setData({
      bjList: this.data.bjList
    })
    this.handelTotal()
  },
  // 输入折扣费用
  discountFeeChange(){
    this.handelTotal()
  },
  // 计算总价
  handelTotal(){
    var total = 0
    var list = []
    this.data.bjList.forEach(item => {
      item.list.forEach(ite => {
        total += ite.priceValue*ite.number
        list.push({
          number: ite.number,
          id: ite.id
        })
      })
    })
    this.setData({
      totalFee: total - Number(this.data.discountFee),
      apiList: list
    })
    if(this.data.totalFee > 0){
      this.setData({
        btntip: '支付'
      })
    } else{
      this.setData({
        btntip: '完成'
      })
    }
  },
  // 去客户签字
  toSignature() {
    wx.navigateTo({
      url: '/pages/signature/index',
    })
  },
  // 选择支付方式
  choosePay(){
    console.log(this.data.totalFee)
    if(this.data.totalFee > 0){
      this.setData({
        show: true
      })
    } else {
      this.creathuizhi()
    } 
  },
  onClose(){
    this.setData({
      show: false
    })
  },
  onPayClose(){
    this.setData({
      showPay: false
    })
  },
  // 无备件创建回执
  creathuizhi(){
    if(this.data.uploadImgList.length <3){
      error('附件需3张图片')
    } else {
      const data = {
        content: Number(this.data.order.content),
        customId: this.data.order.clientId,
        customSignature: this.data.singPic,
        enclosure: this.data.uploadImgList.join(','),
        saleSparePartsOrderDTO: {
          clientName: this.data.order.clientName,
          clientTelephone: this.data.order.clientTelephone,
          receiptId: this.data.order.receiptId,
          workOrderCode: this.data.order.workOrderCode,
        },
        workOrderCode: this.data.order.workOrderCode,
        
      }
      WXAPI.creatHZ(data).then(response => {
        if(response.code===0){
          wx.navigateTo({
            url: '/pages/orderDetail/index?code=' + this.data.order.workOrderCode + '&workOrderId=' + this.data.order.receiptId,
          })
        } else {
          error(response.msg)
        }
      })
    }
  },
  // 支付
  pay(e){
    console.log(this.data.uploadImgList)
    if(this.data.uploadImgList.length <3){
      error('附件需3张图片')
    } else {
      const data = {
        content: Number(this.data.order.content),
        customId: this.data.order.clientId,
        customSignature: this.data.singPic,
        discountFee: this.data.discountFee,
        enclosure: this.data.uploadImgList.join(','),
        saleSparePartsOrderDTO: {
          clientName: this.data.order.clientName,
          clientTelephone: this.data.order.clientTelephone,
          list: this.data.apiList,
          price: this.data.totalFee,
          receiptId: this.data.order.receiptId,
          workOrderCode: this.data.order.workOrderCode,
        },
        settlementMode: Number(e.currentTarget.dataset.id),
        settlementType: 0,
        totalFee: this.data.totalFee,
        workOrderCode: this.data.order.workOrderCode,
        
      }
      WXAPI.creatHZ(data).then(response => {
        if(response.code===0){
          var url = 'http://zxapi.xn--2qun03at5gw5o.top:9999/pay/goods/buy?amount=' + this.data.totalFee
          + '&goodsOrderId=' + this.data.order.workOrderCode
          + '&goodsName=备件订单'
          + '&TENANT-ID=1'
          console.log(url)
          this.makeCode(url)
          this.setData({
            showPay: true
          })
        } else {
          error(response.msg)
        }
      })
    }
  },
  makeCode(url){
    drawQrcode({
      width: 220,
      height: 220,
      canvasId: 'canvas',
      text: url
    })
  }
})