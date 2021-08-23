const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    spuListData:{
      type: Array,
      value: ''
    }  
  },

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {
    // 'spuCardData'(data){
    //   console.log('数据改变了',data)
    //   this.setData({
    //     spuCardData: data
    //   });
    // }
  },
  /**
 * 组件挂载后执行
 */
  ready: function () {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转spu详情
    toDetail(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/good-detail/index?id=' + id,
      })
    }
  }
})