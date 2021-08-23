const WXAPI = require('apifm-wxapi')
Component({
  data: {
    flag: false,
    wrapAnimate: 'wrapAnimate',
    bgOpacity: 1,
    frameAnimate: 'frameAnimate',
    actIndex: 0, // 选中的规格值下标
    selectId: [], // 选中的规格值Id
    proportion: 0.01 // 积分和现金的兑换比例
  },
  properties: {
    popTitle: {
      type: String,
      value: '',
    },
    goodData: {
      type: Object,
      value: {}
    },
    spuId: {
      type: String,
      value: '',
    },
    specsList: {
      type: Array,
      value: {}
    },
    cash: {
      type: Number,
      value: 0
    }
  },

  methods: {
    // 弹出层显示方法
    showFrame() {
      this.setData({ flag: true, wrapAnimate: 'wrapAnimate', frameAnimate: 'frameAnimate' });
    },
    // 弹出层隐藏方法
    hideFrame() {
      const that = this;
      that.setData({ wrapAnimate: 'wrapAnimateOut', frameAnimate: 'frameAnimateOut' });
      setTimeout(() => {
        that.setData({ flag: false })
      }, 400)
    },
    catchNone() {
      //阻止冒泡
    },
    _showEvent() {
      this.triggerEvent("showEvent");
    },
    _hideEvent() {
      this.triggerEvent("hideEvent");
    },
    // 选择规格值
    async changeSpecs(e){
      //console.log(e)
      this.data.selectId = []
      this.data.specsList.forEach(item => {
        if (e.target.dataset.parentid == item.groupId){
          item.specsList.forEach(it => {
            it.status = ''
            if (e.target.dataset.item.id == it.id){
              it.status = 1
            }
          })
        }
      })
      this.data.specsList.forEach(item => {
        item.specsList.forEach(it => {
          if (it.status == 1) {
            this.data.selectId.push(it.id)
          }
        })
      })
      this.setData({
        specsList: this.data.specsList
      })
      //console.log(this.data.goodData)
      const res = await WXAPI.getGoodsSku({
        tuserId: wx.getStorageSync("userId"),
        spuId: this.data.spuId,
        specs: this.data.selectId.toString()
      })
      if (res.status == '1') {
        this.setData({
          goodData: res.result
        })
        this.data.goodData.price = res.result.priceDiscount ? res.result.priceDiscount : res.result.price
        this.data.goodData.minScore = res.result.minScoreDiscount ? res.result.minScoreDiscount : res.result.minScore
        this.data.goodData.maxScore = res.result.maxScoreDiscount ? res.result.maxScoreDiscount : res.result.maxScore
        this.data.goodData.stockNum = res.result.secKillStockNum ? res.result.secKillStockNum : res.result.stockNum
        if (res.result.priceDiscount || res.result.secKillPrice) {
          this.data.flag = true
          if (res.result.secKillPrice) {
            this.data.isSeckill = true
            this.data.goodData.price = res.result.secKillPrice
          }
        }
        this.data.cash = this.sub(this.floatDiv(this.data.goodData.price, 100), this.floatMul(this.data.goodData.minScore, this.data.proportion))
      }
    },
    // 点击加购买数量
    
  }
})