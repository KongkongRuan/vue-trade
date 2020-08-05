import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/vant.js'
import axios from "axios"
import './plugins/element.js'
import Common from "./components/Common.vue"
import '@/assets/styles/index.scss' 
import echarts from 'echarts'
import  'echarts/theme/macarons.js'
Vue.config.productionTip = false

axios.defaults.baseURL="http://localhost:8089/trade" 

// axios.defaults.baseURL="http://123.56.156.31:8089/trade"

// 解决跨域问题后对sessionid不一致问题进行处理
axios.defaults.withCredentials = true
Vue.prototype.$http = axios
Vue.prototype.Common = Common;
Vue.use(echarts)
Vue.prototype.$echarts = echarts
//使用全局路由守卫判断用户是否登录和登录是否超时
router.beforeEach((to, from, next) => {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let createTime=JSON.parse(localStorage.getItem("createTime"));

  var expirse = Common.expirse;
  if((new Date().getTime() - createTime >expirse||user==null) &&to.path!="/user/Login"&&to.path!="/superAdmin/AdminLogin"&&to.path!="/"&&to.path!="/user/Register"){
    if(to.path=="/superAdmin/ManagementIndex/UserManagement"||to.path=="/superAdmin/ManagementIndex/ProductManagement"||to.path=="/superAdmin/ManagementIndex/DataStatistics"){
      next({
        path: '/superAdmin/AdminLogin'
      })
    }else{
      next({
        path: '/user/Login'
      })
    }

  }else  {
    next();
  }
  //实现了从商品详情返回商品列表不刷新的功能 
  //但是存在缺陷  刷新整个页面后第一次点击进入商品详情时商品列表不会缓存
  if(from.path=="/"){
    if(to.path=="/product/ProductDetail"){
      from.meta.keepAlive=true;
    }else{
      from.meta.keepAlive=false;
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')




