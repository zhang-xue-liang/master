Component({
  data: {
    selected: 0,
    color: "#666666",
    selectedColor: "#FC7431",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/gd.png",
      selectedIconPath: "/images/gdActive.png",
      text: "工单"
    }, {
      pagePath: "/pages/notice/notice",
      iconPath: "/images/notice.png",
      selectedIconPath: "/images/noticeActive.png",
      text: "通知"
    },{
      pagePath: "/pages/my/index",
      iconPath: "/images/mine.png",
      selectedIconPath: "/images/mineActive.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const index = data.index;
      const _this = this;
      const url = data.path
      wx.switchTab({
        url: url,
        success: function () {
          _this.setData({
            selected: index
          })
        }
      })
      // console.log(this.data.selected)
    }
  }
})