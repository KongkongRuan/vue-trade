<template>
  <div class="back-color">
    <!-- 标题 -->
    <van-nav-bar left-arrow
                 title="购买宝贝"
                 @click-left="onClickLeft" />

    <van-row class="row1">
      <van-col span="8">
        <img class="img"
             :src='Common.ServerBasePath+"/trade"+product.imgAddr'>
      </van-col>

      <van-col span="16">
        <div class="desc">{{product.productDesc.slice(0,40)}}</div>
        <div class="price">￥{{product.price}}<span v-if="product.originalPrice!=0"
              style="font-size: 12px;padding-left: 14px;text-decoration:line-through;color: #999;">{{"￥"+product.originalPrice}}</span></div>
      </van-col>
    </van-row>

    <van-cell is-link
              style="margin-top: 10px;"
              @click="selectShippingAddress">
      <van-col class="shippingAddress1"
               span="8">收货地址</van-col>
      <van-col v-if="noShippingAddress!=true"
               class="shippingAddress2"
               span="12">{{shippingAddress.name}} {{shippingAddress.phoneNumber}}<br />{{shippingAddress.areaName}}{{shippingAddress.detailAddress}}</van-col>

      <van-col v-if="noShippingAddress==true"
               class="shippingAddress2"
               span="12">还没有收货地址,点击添加</van-col>
    </van-cell>

    <van-cell>
      <van-col span="8"
               class="freight1">运费</van-col>
      <van-col span="12"
               class="freight2">￥{{product.freight}}</van-col>
    </van-cell>


    <van-submit-bar :price="(product.price+product.freight)*100"
                    :loading=loading
                    button-text="提交订单"
                    @submit="submit" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      product: "",
      buyer: "",
      seller: "",
      img: "",
      shippingAddress: "",
      noShippingAddress: true,
      loading:false
    };
  },
  mounted() {
    this.buyer = JSON.parse(localStorage.getItem("currentUser"));
    if (this.buyer == null) {
      this.$toast.fail("请先登录");
      this.$router.push({ path: "/user/Login" });
    }
    var sessionShippingAddress = JSON.parse(
      sessionStorage.getItem("shippingAddress")
    );
    
    if (sessionShippingAddress != null) {
      
      this.noShippingAddress = false;
      this.shippingAddress = sessionShippingAddress;
      //移除从订单页面过来的标志
      //使修改收货地址时无法点击
      //从session中取出地址后移除这个地址
      sessionStorage.setItem("isFromOrder", JSON.stringify(false));
      sessionStorage.setItem("shippingAddress", null);
    } else {
      var data1 = new FormData();
      data1.append("userId", this.buyer.userId);
      this.$http({
        url: "/frontend/getdefaultshippingaddress",
        method: "post",
        data: data1
      }).then(response => {
        if (response.data.success == true) {
          this.noShippingAddress = false;
          this.shippingAddress = response.data.shippingAddress;
          
        }
      });
    }
    
    this.product = JSON.parse(sessionStorage.getItem("product"));
    this.seller = JSON.parse(sessionStorage.getItem("seller"));
    
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    selectShippingAddress() {
      sessionStorage.setItem("isFromOrder", JSON.stringify(true));
      this.$router.push({
        path: "/user/ShippingAddressList"
      });
    },
    submit() {
      console.log(this.seller)
      if (this.shippingAddress == undefined) {
        this.$toast.fail("收货地址不能为空");
        return;
      }
      console.log(this.shippingAddress.shippingAddressId)
      this.loading=true
      var data = new FormData();
      data.append("sellerId", this.seller.userId);
      data.append("buyerId", this.buyer.userId);
      data.append("productId", this.product.productId);
      data.append("shippingAddressId",this.shippingAddress.shippingAddressId);
      var price = parseFloat(this.product.price);
      var freight = parseFloat(this.product.freight);
      data.append("price", price + freight);
      data.append("productDesc", this.product.productDesc);
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
    }
  }
};
</script>
<style lang="less" scoped>
.back-color {
  background-color: rgb(243, 244, 248);
  width: 100%;
  height: 100%;
  position: fixed;
}
.row1 {
  background-color: rgb(254, 254, 254);
  margin-top: 10px;
}
.desc {
  font-size: 16px;
  margin-top: 10px;
  margin-left: 10px;
  font-weight: 500;
  word-wrap:break-word;
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
}

.row2 {
  height: 80px;
  background-color: rgb(254, 254, 254);
  margin-top: 10px;
}

.shippingAddress1 {
  color: rgb(136, 136, 136);
  margin-left: 10px;
}
.shippingAddress2 {
  text-align: right;
  color: rgb(136, 136, 136);
}

.row3 {
  height: 50px;
  background-color: rgb(254, 254, 254);
  margin-top: 2px;
}
.freight1 {
  color: rgb(136, 136, 136);
  margin-left: 10px;
}
.freight2 {
  color: red;
  font-weight: 600;
  text-align: right;
}
</style>