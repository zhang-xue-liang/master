const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: "0",
    current: 1,
    size: 10,
    hasMoreData: true,
    list:[],
    settlementData: [
      {'no': 'GD202004165858',
        'jine': '10.00',
        'status': '1',
        'time': '2021年4月16日 12:26:58',
        'name': '陈骁',
        'mobile': '154546654',
        'address': '浙江省宁波市鄞州区东裕社区'
      },
      {'no': 'GD202004165858',
        'jine': '10.00',
        'status': '2',
        'time': '2021年4月16日 12:26:58',
        'name': '陈骁',
        'mobile': '154546654',
        'address': '浙江省宁波市鄞州区东裕社区'
      },
      {'no': 'GD202004165858',
        'jine': '10.00',
        'status': '3',
        'time': '2021年4月16日 12:26:58',
        'name': '陈骁',
        'mobile': '154546654',
        'address': '浙江省宁波市鄞州区东裕社区'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(this.data.active === '0')
  },
  onShow(){
    this.setData({
      list: []
    })
    this.getOrders()
  },
  onChange(e) {
    this.setData({
      list: []
    })
    this.setData({active: e.currentTarget.dataset.idx})
    this.getOrders()
  },
  // 获取订单
  getOrders() {
    const data = {
      type: this.data.active,
      query: {
        current: this.data.current,
        size: this.data.size
      }
    }
    WXAPI.getOrder(data).then(response => {
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
  onReachBottom() {
    if (this.data.hasMoreData) {
      this.setData({
        current: this.data.current + 1
      })
      this.getOrders()
    }
  }
})