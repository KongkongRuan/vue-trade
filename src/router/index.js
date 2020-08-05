import Vue from 'vue'
import Router from 'vue-router'
import index from '../views/frontend/index.vue'
import Login from '../views/user/Login.vue'
import Register from '../views/user/Register.vue'
import AddProduct from '../views/product/AddProduct.vue'
import ProductDetail from '../views/product/ProductDetail.vue'
import Order from '../views/product/Order.vue'
import UserPage from '../views/user/UserPage.vue'
import ShippingAddressList from '../views/user/ShippingAddressList.vue'
import AddShippingAddress from '../views/user/AddShippingAddress.vue'
import MyIssue from '../views/product/MyIssue.vue'
import MyCollect from '../views/product/MyCollect.vue'
import MyBoughtOrSold from '../views/product/MyBoughtOrSold.vue'
import UnshelveProductList from '../views/product/UnshelveProductList.vue'
import ModifyPassworld from '../views/user/ModifyPassworld.vue'
import ModifyUserInfor from '../views/user/ModifyUserInfor.vue'
import RetrievePassword from '../views/user/RetrievePassword.vue'
import OrderDetail from '../views/user/OrderDetail.vue'
import AdminLogin from '../views/superAdmin/AdminLogin.vue'
import ManagementIndex from '../views/superAdmin/ManagementIndex.vue'
import ProductManagement from '../views/superAdmin/ProductManagement.vue'
import UserManagement from '../views/superAdmin/UserManagement.vue'
import DataStatistics from '../views/superAdmin/DataStatistics.vue'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: index },
    { path: '/frontend/index', component: index },
    { path: '/user/Login', component: Login },
    { path: '/user/Register', component: Register },
    { path: '/product/AddProduct', component: AddProduct },
    { path: '/product/ProductDetail', component: ProductDetail },
    {
      path: '/product/Order', component: Order
    },
    { path: '/user/UserPage', component: UserPage },
    { path: '/user/ShippingAddressList', component: ShippingAddressList },
    { path: '/user/AddShippingAddress', component: AddShippingAddress },
    { path: '/product/MyIssue', component: MyIssue },
    { path: '/product/MyCollect', component: MyCollect },
    { path: '/product/MyBoughtOrSold', component: MyBoughtOrSold },
    { path: '/product/UnshelveProductList', component: UnshelveProductList },
    { path: '/user/ModifyPassworld', component: ModifyPassworld },
    { path: '/user/ModifyUserInfor', component: ModifyUserInfor },
    { path: '/user/RetrievePassword', component: RetrievePassword },
    { path: '/user/OrderDetail', component: OrderDetail },
    { path: '/superAdmin/AdminLogin', component: AdminLogin },
    {
      path: '/superAdmin/ManagementIndex', component: ManagementIndex,
      children: [
        { path: "DataStatistics", name: "数据统计", component: DataStatistics },
        { path: "ProductManagement", name: "商品管理", component: ProductManagement },
        { path: "UserManagement", name: "用户管理", component: UserManagement },

      ]
    },
  ]
})
