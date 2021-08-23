const app = getApp()

Component({
  
  data: {
    show: false,
    allActive: false,
    timeActive: false,
    typeAcId: '3',
    timeAcId: '4',
    typeTip: '全部',
    timeTip: '时间'
  },
  observers: {

  },
  ready: function(){
  },
  methods: {
    // 展示弹出层
    showPop() {
      this.setData({ show: true })
    },
    // 关闭弹出层
    onClose() {
      this.setData({ show: false })
      this.setData({timeActive: false})
      this.setData({allActive: false})
    },
    chioceType(){
      this.setData({allActive: !this.data.allActive})
      this.setData({timeActive: false})
      if (this.data.allActive === true){
        this.setData({ show: true })
      } else {
        this.setData({ show: false })
      }
    },
    chioceTime(){
      this.setData({timeActive: !this.data.timeActive})
      this.setData({allActive: false})
      if (this.data.timeActive === true){
        this.setData({ show: true })
      } else {
        this.setData({ show: false })
      }
    },
    // 标记全部已读
    readAll() {
      this.setData({timeActive: false})
      this.setData({allActive: false})
      this.setData({ show: false })
      this.triggerEvent('showPop')
    },
    // 选择消息状态
    chioceTypeItem(e) {
      this.setData({
        typeAcId: e.currentTarget.dataset.id,
        typeTip: e.currentTarget.dataset.tip,
      })
    },
    // 选择消息时间
    chioceTimeItem(e) {
      this.setData({
        timeAcId: e.currentTarget.dataset.id,
        timeTip: e.currentTarget.dataset.tip,
      })
    },
    // 重置
    reSet() {
      this.setData({
        typeAcId: '0'
      })
    },
    // 确定
    confim() {
      const data = {
        typeAcId: this.data.typeAcId
      }
      this.triggerEvent('sectConfim', {data: data})
      this.onClose()
    }
  }
})