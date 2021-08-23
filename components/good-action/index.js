const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    
  },

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    tabActive:true
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {
  
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
    // 点击立即购买
    buyNow(){
      this.triggerEvent('goodAction', 'buyNow') 
    },
    // 点击加入购物车
    addCart(){
      this.triggerEvent('goodAction', 'addCart') 
    }
  }
})