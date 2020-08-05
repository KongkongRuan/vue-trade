<template>
  <div class="back-color">
    <van-nav-bar left-arrow
                 title="订单详情"
                 @click-left="onClickLeft" />
    <van-cell class="cell1">
      <span v-if="active==-1"
            style=" color: white;font-weight: 550;font-size:18px">订单已取消</span>
      <span v-if="active==0"
            style=" color: white;font-weight: 550;font-size:18px">等待付款</span>
      <div v-if="active==0"  style="color: white;font-weight: 500;font-size:18px;margin-top: 3px;">{{content}}后交易关闭</div>

      <span v-if="active==1"
            style=" color: white;font-weight: 550;font-size:18px">支付成功</span>
      <span v-if="active==2"
            style=" color: white;font-weight: 550;font-size:18px">已发货</span>
      <span v-if="active==3"
            style=" color: white;font-weight: 550;font-size:18px">已收货</span>
    </van-cell>
    <van-cell class="cell2"
              v-if="true">
      <van-steps :active="active"
                 active-icon="success"
                 active-color="#38f">
        <van-step>买家下单</van-step>
        <van-step>支付成功</van-step>
        <van-step>已发货</van-step>
        <van-step>已收货</van-step>
      </van-steps>
      <div style="margin-left: 10px;">
        <div><span>{{shippingAddress.name}}</span><span style="margin-left: 20px;">{{shippingAddress.phoneNumber}}</span></div>
        <div style="font-size:12px;font-weight: 350;">地址：{{shippingAddress.areaName+shippingAddress.detailAddress}}</div>
      </div>
    </van-cell>

    <van-row class="productd-etail"
             @click="productPage()">
      <van-col span="8">
        <img class="img"
             :src='Common.ServerBasePath+"/trade"+product.imgAddr' />
      </van-col>

      <van-col span="16">
        <van-row>
          <van-col span="18">
            <div class="desc"><span style="width:50px">{{product.productDesc}}</span></div>
          </van-col>
          <van-col span="6"><span style="float:right;color: #999;">￥{{product.price}}</span></van-col>
        </van-row>
      </van-col>
    </van-row>
    <van-cell style="margin-top: 1px;">
      <div style="color: #999;">商品总价<span style="float:right;">￥{{product.price}}</span></div>
      <div style="color: #999;">运费<span style="float:right;">￥{{product.freight}}</span></div>
      <div v-if="active!=0&&active!=-1"
           style="font-weight: 600;font-size:16px;margin-top: 5px;">实付款<span style="float:right;color: red;">￥{{order.price}}</span></div>
      <div v-if="active==0||active==-1"
           style="font-weight: 600;font-size:16px;margin-top: 5px;">应付款<span style="float:right;color: red;">￥{{order.price}}</span></div>
      <div v-if="active==0"
           style="font-weight: 600;font-size:16px;margin-top: 5px;color: red;">未付款</div>
    </van-cell>
    <van-cell style="margin-top: 4px;">
      订单信息
      <div style="color: #999;">卖家昵称：{{seller.name}}</div>
      <div style="color: #999;">订单编号：{{order.orderId}}</div>
      <div style="color: #999;">交易时间：{{format(order.createTime)}}</div>
    </van-cell>

  </div>

</template>
<script>
export default {
  data() {
    return {
      order: {},
      active: 0,
      shippingAddress: {},
      product: {},
      seller: {},
      content:"00分00秒",
      endTime:0,
      endText:"00分00秒"
    };
  },
  mounted() {
    //获取订单信息
    var orderId = this.$route.query.orderId;
    this.order.orderId = orderId;
    this.$http({
      url: "/order/getOrder",
      method: "post",
      data: this.order
    }).then(response => {
      if (response.data.success == true) {
        this.order = response.data.order;
        this.endTime = response.data.order.createTime;
        this.countdowm(this.endTime)
        this.active = this.order.orderStatus;
        //获取收货地址
        this.shippingAddress.shippingAddressId = this.order.shippingAddressId;
        this.$http({
          url: "/frontend/getShippingAddress",
          method: "post",
          data: this.shippingAddress
        }).then(response => {
          if (response.data.success == true) {
            this.shippingAddress = response.data.shippingAddress;
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
        //获取商品信息
        this.product.productId = this.order.productId;
        this.$http({
          url: "/productadmin/getproductbyid",
          method: "post",
          data: this.product
        }).then(response => {
          if (response.data.success == true) {
            this.product = response.data.product;
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
        //获取卖家信息

        var sellerData = new FormData();
        sellerData.append("userId", this.order.sellerId);
        this.$http({
          url: "/user/getuser",
          method: "post",
          data: sellerData
        }).then(response => {
          if (response.data.success == true) {
            this.seller = response.data.user;
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
      } else {
        this.$toast.fail(response.data.errMsg);
      }
    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    //格式化时间
    format(input) {
      var d = new Date(input);
      var year = d.getFullYear();
      var month =
        d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : "" + (d.getMonth() + 1);
      var day = d.getDate() < 10 ? "0" + d.getDate() : "" + d.getDate();
      var hour = d.getHours() < 10 ? "0" + d.getHours() : "" + d.getHours();
      var minutes =
        d.getMinutes() < 10 ? "0" + d.getMinutes() : "" + d.getMinutes();
      var seconds =
        d.getSeconds() < 10 ? "0" + d.getSeconds() : "" + d.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
    countdowm(timestamp) {
      let self = this;
      let timer = setInterval(function() {
        let nowTime = new Date();
        let endTime = new Date(timestamp + (30*60*1000));
        let t = endTime.getTime() - nowTime.getTime();
        if (t > 0) {
          let day = Math.floor(t / 86400000);
          let hour = Math.floor((t / 3600000) % 24);
          let min = Math.floor((t / 60000) % 60);
          let sec = Math.floor((t / 1000) % 60);
          hour = hour < 10 ? "0" + hour : hour;
          min = min < 10 ? "0" + min : min;
          sec = sec < 10 ? "0" + sec : sec;
          let format = "";
          if (day > 0) {
            format = `${day}天${hour}小时${min}分${sec}秒`;
          }
          if (day <= 0 && hour > 0) {
            format = `${hour}小时${min}分${sec}秒`;
          }
          if (day <= 0 && hour <= 0) {
            format = `${min}分${sec}秒`;
          }
          self.content = format;
        } else {
          clearInterval(timer);
          self.content = self.endText;
         
        }
      }, 1000);
    },
    productPage() {
      this.$router.push({
        path: "/product/ProductDetail",
        query: { productId: this.product.productId }
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
}
.cell1 {
  padding-top: 15px;

  /* background-color: rgb(25, 137, 250);
   */
  background: -webkit-linear-gradient(
    left,
    #4bb0ff,
    #6149f6
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #4bb0ff,
    #6149f6
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #4bb0ff,
    #6149f6
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #4bb0ff, #6149f6); /* 标准的语法 */
  height: 130px;
}
.cell2 {
  position: absolute;
  top: 120px;
  border-radius: 10px;
  height: 140px;
  width: 95%;
  margin-left: 10px;
  margin-right: 10px;
}
.productd-etail {
  background-color: rgb(254, 254, 254);
  padding-top: 90px;
  padding-left: 10px;
  padding-right: 10px;
}
.desc {
  margin-left: 10px;
  font-size: 14px;
}
.price {
  font-size: 16px;
  margin-top: 40px;
  margin-left: 10px;
  font-weight: 600;
  color: red;
}
.img {
  width: 120px;
  height: 100%;
  border-radius: 10px;
}
</style>