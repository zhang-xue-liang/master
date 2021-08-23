module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const { imgBaseUrl } = require('../../utils/config')
/* eslint-disable */
var API_BASE_URL = imgBaseUrl
//var API_BASE_URL = 'http://servicev2.mrmch.com';
var subDomain = '-';

var request = function request(url, method, data, ContentType, token) {
  var _url = API_BASE_URL + url;
  var access_token = wx.getStorageSync('access_token')
  return new Promise(function (resolve, reject) {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': ContentType,
        'TENANT-ID': 1,
        'Authorization': access_token? 'Bearer ' + access_token : 'Basic cGlnOnBpZw=='
      },
      success: function success(request) {
        if (request.statusCode === 200) {
          resolve(request.data)
        } else if(request.statusCode === 401) {
          wx.navigateTo({
            url: '/pages/login/index',
          })
        } else {
          wx.showToast({
            title: request.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function fail(error) {
        reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });
  });
};

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(function (value) {
    Promise.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    Promise.resolve(callback()).then(function () {
      throw reason;
    });
  });
};

// 商城的请求方法
module.exports = {
  init2: function init2(a, b) {
    API_BASE_URL = a;
    subDomain = b;
  },
  init: function init(b) {
    subDomain = b;
  },
  request: request,

  // 小程序登录
  login: function (query) {
    return request('/auth/worker/token/social', 'post', query, 'application/x-www-form-urlencoded')
  },
  // 获取省市区
  getArea: function() {
    return request('/admin/sysarea/get/0', 'get', '', 'application/x-www-form-urlencoded')
  },
  // 师傅注册
  regeist: function(data) {
    return request('/worker/saleworker/apply', 'post', data, 'application/json')
  },
  // 上传图片
  uplodImag(data){
    return request('/admin/sys-file/upload', 'post', data, 'application/x-www-form-urlencoded')
  },
  // 获取验证码
  getPhoneCode: function(data) {
    return request('/worker/saleworker/sendCode/' + data.mobile, 'post', '', 'application/x-www-form-urlencoded')
  },
  // 获取师傅详情
  getSHDetail(){
    return request('/worker/saleworker/getDetail', 'get', '', 'application/x-www-form-urlencoded')
  },

  //工单
  // 获取所有服务类型
  serviceType(){
    return request('/worker/serviceType/all', 'get', '', 'application/x-www-form-urlencoded')
  },
  // 获取所有备件类型
  getSparePartsType(data){
    return request('/manager/spare_parts_order/getSparePartsType', 'get', data, 'application/x-www-form-urlencoded')
  },
  // 拒绝工单
  refuseWorkOrder(data){
    return request('/worker/workOrder/refuseWorkOrder', 'get', data, 'application/x-www-form-urlencoded')
  },
  // 
  agreeWorkOrder(data){
    return request('/worker/workOrder/agreeWorkOrder', 'get', data, 'application/x-www-form-urlencoded')
  },
  // 开始工作
  startWork(data){
    return request('/worker/workOrder/startWork', 'get', data, 'application/x-www-form-urlencoded')
  },
  // 获取备件列表
  getSparePartsList(data){
    return request('/worker/workOrder/getSparePartsList', 'get', data, 'application/x-www-form-urlencoded')
  },
  // 根据状态获取工单列表
  getGd: function (data) {
    return request('/worker/workOrder/getWorkOrderList', 'get', data, 'application/x-www-form-urlencoded')
  },
  // 获取工单总数
  getGdNum(){
    return request('/worker/workOrder/getTotalStatus', 'get', '', 'application/x-www-form-urlencoded')
  },
  // 获取工单详情
  getGdDetail: function(data) {
    return request('/worker/workOrder/getWorkOrderDetail/' + data.id, 'get', '', 'application/x-www-form-urlencoded')
  },
  // 修改计划时间
  editPlanTime: function(data) {
    return request('/worker/workOrder/updatePlanTime', 'post', data, 'application/json')
  },
  // 获取工单产品信息
  getCP: function(data){
    return request('/worker/workOrder/getWorkOrderProductByWorkOrderId/' + data.workOrderId , 'get', '', 'application/x-www-form-urlencoded')
  },
  // 获取工单备件信息
  getBJ: function(data){
    return request('/worker/workOrder/getSparePartsByWorkCode/' + data.code , 'get', '', 'application/x-www-form-urlencoded')
  },
  // 获取工单回执信息
  getHZ(data){
    return request('/worker/workOrder/getReceipt/' + data.workOrderCode  , 'get', '', 'application/x-www-form-urlencoded')
  },
  // 创建工单回执信息
  creatHZ(data){
    return request('/worker/workOrder/createReceipt', 'post', data, 'application/json')
  },
  // 获取工单进度信息
  getWorkOrderLog(data){
    return request('/worker/workOrderLog/getWorkOrderLog/' + data.workOrderId  , 'get', '', 'application/x-www-form-urlencoded')
  },
  // 工单备注
  remarkWork(data){
    return request('/worker/workOrderLog/remarkWorkLog', 'post', data, 'application/json')
  },

  // 通知
  // 标记全部已读
  noticeRead: function(data) {
    return request('/worker/notify/readNotify/' + data.type, 'get', '', 'application/json')
  },
  // 获取消息列表
  getNotice: function(data) {
    return request('/worker/notify/getNotifyList', 'get', data, 'application/json')
  },
  // 获取消息列表总数
  getNotifyListTotal(){
    return request('/worker/notify/getNotifyListTotal', 'get', '', 'application/json')
  },

  // 我的
  // 获取完成订单总数
  getAllOrderNumber: function () {
    return request('/worker/workOrder/getCompleteWorkOrderCount', 'get', '', 'application/json')
  },
  // 获取完成订单
  getOrder: function (data) {
    return request('/worker/workOrder/getCompleteWorkOrder/' + data.type, 'get', '', data.query, 'application/json')
  },
  // 获取账户余额
  getSaleWallet: function () {
    return request('/worker/saleWallet/get', 'get', '', 'application/json')
  },
  // 获取结算信息
  getSettlement: function () {
    return request('/worker/workOrder/getSettlementPrice', 'get', '', 'application/json')
  },
  // 获取今日/非今日结算
  getSettlementWorkOrder(data){
    return request('/worker/workOrder/getSettlementWorkOrder/' + data.type+'/'+data.isToday, 'get', '', 'application/json')
  },
  // 钱包 => 收入记录
  getRevenueRecord: function (data) {
    return request('/worker/workOrder/getRevenueRecord', 'get', data, 'application/json')
  },
  // 钱包 => 提现记录
  getRevengetRevenueRecord: function (data) {
    return request('/worker/sale_withdraw_apply/getRevenueRecord', 'get', data, 'application/json')
  },
  // 钱包 => 提现
  withdrawal: function (data) {
    return request('/worker/sale_withdraw_apply/withdrawal', 'post', data, 'application/json')
  },
  // 钱包 => 罚款
  getFine(data){
    return request('/worker/saleWallet/getFine', 'get', data, 'application/json')
  },
  // 协议
  agreement(data){
    return request('/manager/agreement/get/' + data.type, 'get', '', 'application/json')
  },
  // 分页查询知识库
  getKnowledge(data){
    return request('/manager/sale_knowledge/page', 'get', data, 'application/json')
  }
};

/***/ })
/******/ ]);