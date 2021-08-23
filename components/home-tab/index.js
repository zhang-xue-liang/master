const  WXAPI = require("apifm-wxapi");

//获取应用实例
const app = getApp()

Component({
  // properties: {
  //   tab_data: {
  //     type: Array,
  //     value: ''
  //   }
  // },
  data: {
    tab_data: [
      {id: 4, name: '全部'},
      {id: 0, name: '待接受'},
      {id: 1, name: '已接受'},
      {id: 2, name: '进行中'},
      {id: 3, name: '已完成'},
    ],
    currentTab:4,
    navScrollLeft: 0
  },
  observers: {

  },
  ready: function(){
    console.log('ggg')
    this.getNumber()
  },
  methods: {
    getNumber(){
      WXAPI.getGdNum().then(response => {
        this.setData({
          tab_data: [
            {id: 4, name: '全部', num: response.data.total},
            {id: 0, name: '待接受', num: response.data.needAccepted},
            {id: 1, name: '已接受', num: response.data.accepted},
            {id: 2, name: '进行中', num: response.data.begining},
            {id: 3, name: '已完成', num: response.data.finsh},
          ]
        })
        console.log(this.data.tab_data)
      })
    },
    switchNav(event) {
      var cur = event.currentTarget.dataset.current;
      var singleNavWidth = this.data.windowWidth / 4;
      this.triggerEvent('changeTab', event.currentTarget.dataset['id'])                          
      this.setData({
        navScrollLeft: (cur - 1) * singleNavWidth
      })
      if (this.data.currentTab == cur) {
        return false;
      } else {
        this.setData({
          currentTab: cur
        })
      }
    },
    showScreening() {
      this.triggerEvent('showScreening')
    }
  }
})