const  WXAPI = require("apifm-wxapi");

const App = getApp();

Component({
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    type:{
      type: String,
      value: ''
    }  
  },

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    show: false,
    areaLis: require("../../utils/are.js"),
    // areaLis: {
    //   province_list: {
    //     110000: '北京市',
    //     120000: '天津市',
    //   },
    //   city_list: {
    //     110100: '北京市',
    //     120100: '天津市',
    //   },
    //   county_list: {
    //     110101: '东城区',
    //     110102: '西城区',
    //     // ....
    //   },
    // }
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {
   
  },
  /**
 * 组件挂载后执行
 */
  ready: function () {
    console.log(this.data.areaLis)
    this.getList()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getList(){
      WXAPI.getArea().then(response => {
        console.log(response)
      })
    },
    showArea() {
      this.setData({ show: true })
    },
    confirm(obj) {
      this.triggerEvent('areadata', {data: obj.detail.values})
      this.setData({ show: false })
    },
    onClose() {
      this.setData({ show: false })
    }
  }
})