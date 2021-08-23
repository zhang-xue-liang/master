const { loginBaseUrl, baseUrl } = require('../../utils/config')
const { error } = require('../../utils/toast')
const WXAPI = require('apifm-wxapi')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    wx.setStorage({
      key: 'access_token',
      data: '',
    })
  },
  // 一键登录
  login(){
    wx.getUserProfile({
      desc:"授权登录",
      success:(res)=>{
        let userInfo = res.rawData
        wx.login({
          success(res){
            console.log('授权登录用户信息',userInfo)
            wx.request({
              url: loginBaseUrl + 'token/social',
              method:'POST',
              header:{
                'Authorization':'Basic cGlnOnBpZw==',
                'content-type':'application/x-www-form-urlencoded'
              },
              data:{
                'code':res.code,
                'userInfo':userInfo
              },
              success(res){
                const { data } = res
                if(data.access_token){
                  wx.setStorageSync('access_token', data.access_token)
                  wx.setStorageSync('avatar', data.user_info.avatar)
                  wx.request({
                    url: baseUrl+ 'saleworker/getDetail',
                    method: 'get',
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'TENANT-ID': 1,
                      'Authorization':  'Bearer ' + data.access_token
                    },
                    success: function success(request) {
                      console.log('师傅详情接口返回数据',request)
                      if (request.statusCode != 200) {
                        console.log('师傅详情报错', request)
                        error('登录失败')
                      }
                      if (request.statusCode === 200) {
                        if(request.data.code === 0){
                          if(request.data.data != null){
                            if(request.data.data.checkStatus === 0){
                              // 未认证，去注册
                              wx.navigateTo({
                                url: '/pages/certification/index?id=0',
                              })
                            } else if(request.data.data.checkStatus === 1) {
                              // 认证中
                              wx.navigateTo({
                                url: '/pages/certification/index?id=1',
                              })
                              
                            } else if(request.data.data.checkStatus === 2){
                              // 认证通过
                              wx.setStorageSync('username', request.data.data.wxName)
                              wx.switchTab({
                                url: '/pages/index/index',
                              })
                            } else if(request.data.data.checkStatus === 3){
                              // 认证失败
                              wx.navigateTo({
                                url: '/pages/certification/index?id=3',
                              })
                            }
                          } else{
                            wx.navigateTo({
                              url: '/pages/certification/index?id=0',
                            })
                          }
                        } else {
                          error(request.data.msg)
                        }
                      } else {
                        error(request.data.msg)
                      }
                    },
                    fail: function fail(error) {
                      error('登录失败');
                    },
                  })
                }else{
                  error('登录失败');
                }
              },
              fail(err){
                error('登录失败')
              }
            })
          }
        })
      },
      fail(res){
        
      }
    })
  },
})