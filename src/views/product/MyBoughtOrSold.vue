<template>
  <div class="back-color">
    <!-- 标题 -->
    <van-nav-bar v-if="formPageinfor.type == 'MySold'"
                 left-arrow
                 title="我卖出的"
                 @click-left="onClickLeft" />
    <!-- 标题 -->
    <van-nav-bar v-if="formPageinfor.type == 'MyBought'"
                 left-arrow
                 title="我买到的"
                 @click-left="onClickLeft" />

    <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              :offset=5
              @load="onLoad">
      <div v-for="(orderAndProduct,index) in orderAndProductList"
                :key="orderAndProduct" >
      <van-cell 
                v-if="formPageinfor.type!='MySold'||orderAndProduct.orderStatus!=-1"
                
                
                class="product-cell">
      
        <div style="margin-bottom: 10px;" >
          <van-image round
                     style="height:30px;width:30px;vertical-align: middle;"
                     :src="Common.ServerBasePath+'/trade/upload/headPortrait/head.jpg'" />
          <span style="margin-left:5px;font-size: 14px;">{{orderAndProduct.name}}</span>
          <span style="float:right;margin-right:10px;color:rgb(152,152,152);font-size: 12px;"
                v-if="orderAndProduct.orderStatus==-1">订单已取消</span>
          <span style="float:right;margin-right:10px;color:red;font-size: 12px;"
                v-if="orderAndProduct.orderStatus==0">买家未付款</span>
          <span style="float:right;margin-right:10px;color:red;font-size: 12px;"
                v-if="orderAndProduct.orderStatus==1">支付成功</span>
          <span style="float:right;margin-right:10px;color:red;font-size: 12px;"
                v-if="orderAndProduct.orderStatus==2">已发货</span>
          <span style="float:right;margin-right:10px;color:red;font-size: 12px;"
                v-if="orderAndProduct.orderStatus==3">交易成功</span>      
          <van-tag v-if="orderAndProduct.enableStatus==2&&orderAndProduct.orderStatus!=0" style="float:right;margin-right:10px;" plain type="danger">已售出</van-tag>
          <van-tag v-if="orderAndProduct.enableStatus==-1||orderAndProduct.enableStatus==0" style="float:right;margin-right:10px;" plain >已下架</van-tag>
        </div>
        <div @click="choice(orderAndProduct.orderId)">
          <van-col span="8"><img style="width:65px;height:65px"
                 :src='Common.ServerBasePath+"/trade"+orderAndProduct.imgAddr' /></van-col>
          <van-col span="16">
            <div class="product-name">{{orderAndProduct.productDesc.slice(0,30)}}<span v-if="orderAndProduct.productDesc.length>30">...</span></div>
            <div class="price"><span style="font-size:10px">￥</span>{{orderAndProduct.price}}</div>
            <div class="view">浏览 {{orderAndProduct.browse}}</div>
          </van-col>
        </div>
         <span style="float:right;margin-right:10px;">
          <van-button v-if="orderAndProduct.orderStatus==0&&formPageinfor.type != 'MySold'&&orderAndProduct.enableStatus==1"
                      @click="paymentOrder(orderAndProduct)"
                      round
                      plain
                      size="small"
                      type="danger">我要付款</van-button>
        </span>

        <span style="float:right;margin-right:10px;">
          <van-button v-if="orderAndProduct.orderStatus==2&&formPageinfor.type != 'MySold'"
                      @click="confirmReceipt(orderAndProduct.orderId,index)"
                      round
                      plain
                      size="small"
                      type="info">确认收货</van-button>
        </span>
        <span style="float:right;margin-right:10px;">
          <van-button v-if="orderAndProduct.orderStatus==1&&formPageinfor.type != 'MyBought'"
                      @click="confirmShipment(orderAndProduct.orderId,index)"
                      round
                      plain
                      size="small"
                      type="info">确认发货</van-button>
        </span>

        <span style="float:right;margin-right:10px;">
          <van-button 
                      @click="deleteOrder(orderAndProduct.orderId,index)"
                      round
                      plain
                      size="small"
                      type="default">删除订单</van-button>
        </span>
      
      </van-cell>
      </div>
    </van-list>

  </div>
</template>
<script>
import { Dialog } from 'vant';
export default {
  data() {
    return {
      formPageinfor: {
        pageIndex: 1,
        pageSize: 7,
        type: ""
      },
      orderAndProductList: [],
      loading: false,
      finished: false,
      order: {
        orderId: "",
        logicDelete: "",
        orderStatus:""
      }
    };
  },
  mounted() {
    var pageType = this.$route.query.pageType;
    this.formPageinfor.type = pageType;
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    choice(orderId) {
      this.$router.push({
        path: "/user/OrderDetail",
        query: { orderId: orderId }
      });
    },
    onLoad() {
      setTimeout(() => {
        this.$http({
          url: "/productadmin/getproductlist",
          method: "post",
          data: this.formPageinfor
        }).then(response => {
          if (response.data.success == true) {
            if(response.data.count==null){
              this.finished = true;
            }
            if (this.loading == true) {
              //接收商品列表
              for (
                let i = 0;i < response.data.orderAndProductList.length;i++
              ) {
                this.orderAndProductList.push(
                  response.data.orderAndProductList[i]
                );
              }
              this.formPageinfor.pageIndex++;
              // this.count = response.data.count;
              if (this.orderAndProductList.length == response.data.count) {
                this.finished = true;
              }
            }
          } else {
            this.$toast.fail(response.data.errMsg);
          }
          this.loading = false;
        });
      }, 500);
    },
    deleteOrder(orderId, index) {
      Dialog.confirm({
        message: "确认删除订单吗？"
      }).then(() => {
      console.log("开始删除")
      this.order.orderId = orderId;
      if (this.formPageinfor.type == "MySold") {
        this.order.logicDelete = 1;
      }
      if (this.formPageinfor.type == "MyBought") {
        this.order.logicDelete = 2;
      }
      this.$http({
        url: "/order/logicDeleteOrder",
        method: "post",
        data: this.order
      }).then(response => {
        if (response.data.success == true) {
          this.$toast('删除成功');
          this.orderAndProductList.splice(index,1);
          this.$forceUpdate();
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
        })
        .catch(() => {
        });
    },
    paymentOrder(orderAndProduct){
      var data = new FormData();
      data.append("orderId", orderAndProduct.orderId);
      data.append("productDesc", orderAndProduct.productDesc);
      data.append("price", orderAndProduct.price);
      this.$http({
        url: "/payment/pay",
        method: "post",
        data: data
      }).then(response => {
        var res = response.data;
        const div = document.createElement("div"); // 创建div
        div.innerHTML = res; // 将返回的form 放入div
        document.body.appendChild(div);
        document.forms[0].submit();
      });
    },
    //确认发货
    confirmShipment(orderId,index){
      Dialog.confirm({
        message: "确认发货吗？"
      }).then(() => {
      this.order.orderId = orderId;
      this.order.orderStatus = 2;
      this.$http({
        url: "/order/confirmShipment",
        method: "post",
        data: this.order
      }).then(response => {
        if (response.data.success == true) {
          this.$toast('发货成功');
          this.orderAndProductList[index].orderStatus=2;
          this.$forceUpdate();
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
        })
        .catch(() => {
        });
    },
    //确认收货
    confirmReceipt(orderId,index){
      Dialog.confirm({
        message: "确认收货吗？"
      }).then(() => {
      this.order.orderId = orderId;
      this.order.orderStatus = 3;
      this.$http({
        url: "/order/confirmReceipt",
        method: "post",
        data: this.order
      }).then(response => {
        if (response.data.success == true) {
          this.$toast('收货成功');
          this.orderAndProductList[index].orderStatus=3;
          this.$forceUpdate();
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
        })
        .catch(() => {
        });
    }
  }
};
</script>
<style scoped>
.back-color {
  background-color: rgb(243, 244, 248);
  width: 100%;
  height: 100%;
  position: fixed;
  /*解决使用fixed布局后页面不能滚动的问题 */
  top: 0;
  bottom: 0;
  overflow-y: scroll;
  overflow-x: hidden;
}
.product-name {
  font-size: 13px;
}
.price {
  color: red;
}
.view {
  font-size: 10px;
  color: #999;
}
.product-cell {
  border-radius: 10px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  width: 95%;
}
.product-div {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>