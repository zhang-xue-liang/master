const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    current: 1,
    size: 10,
    hasMoreData: true,
    id:'',
    data: [
      {'no': 'GD202004165858',
        'jine': '10.00',
        'status': '1',
        'time': '2021年4月16日 12:26:58'
      },
      {'no': 'GD202004165858',
        'jine': '10.00',
        'status': '1',
        'time': '2021年4月16日 12:26:58'
      },
      {'no': 'GD202004165858',
        'jine': '10.00',
        'status': '1',
        'time': '2021年4月16日 12:26:58'
      }
    ]
  },
  onShow(){
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const data = currentPage.options;
    this.setData({
      id: data.id
    })
    this.setData({
      list: []
    })
    this.getList()
  },
  getList(){
    const data = {
      current: this.data.current,
      size: this.data.size,
      type:1,
      isToday: this.data.id
    }
    WXAPI.getSettlementWorkOrder(data).then(response => {
      const newList = response.data.records
      const oldList = this.data.list
      const allList = oldList.concat(newList)
      this.setData({
        list: allList
      })
      if (response.data.size * response.data.current >= response.data.total) {
        this.setData({
          hasMoreData: false
        })
      }
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
  }
})