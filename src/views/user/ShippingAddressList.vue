<template>
  <div class="back-color">
    <!-- 标题 -->
    <van-nav-bar v-if="isFromOrder==true"
                 left-arrow
                 title="收货地址列表"
                 @click-left="onClickLeft"
                  />
    <van-nav-bar v-if="isFromOrder!=true"
                 left-arrow
                 title="收货地址列表"
                 @click-left="onClickLeft" />
    <div style="margin-top: 40px;" />
    <div v-if="shippingAddressList.length==0" class="noAddress">暂无收货地址,请添加</div>
    <div class="address-div"
         v-for="shippingAddress in shippingAddressList"
         :key="shippingAddress">
      <van-cell class="address-cell"
                >
        <div @click="choice(shippingAddress)" >
          <div>{{shippingAddress.name}} {{shippingAddress.phoneNumber}}
            <van-tag v-if="shippingAddress.defaultAddress==1"
                    style="margin-left: 20px;"
                    type="danger">默认
            </van-tag>
          </div>
          <div>{{shippingAddress.areaName}}{{shippingAddress.detailAddress}}</div>
        </div>

        <van-icon slot="right-icon"
                  size="20"
                  name="edit"
                  style="line-height: inherit; margin-top: 20px; margin-left: 20px;"
                  @click="edit(shippingAddress)" />
      </van-cell>
    </div>
    <van-button round
                class="button1"
                style="width: 80%;margin-left: 10%;margin-top: 40px;"
                type="danger"
                block
                @click="onAdd">添加收货地址</van-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buyer: "",
      shippingAddressList: [],
      isFromOrder: ""
    };
  },
  mounted() {

    this.isFromOrder = JSON.parse(sessionStorage.getItem("isFromOrder"));
    
    this.buyer = JSON.parse(localStorage.getItem("currentUser"));
    var data = new FormData();
    data.append("userId", this.buyer.userId);
    this.$http({
      url: "/frontend/getshippingaddresslist",
      method: "post",
      data: data
    }).then(response => {
      if (response.data.success == true) {
        for (let i = 0; i < response.data.shippingAddressList.length; i++) {
          this.shippingAddressList.push(response.data.shippingAddressList[i]);
        }
      }
    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onAdd() {
      this.$router.push({
        path: "/user/AddShippingAddress"
      });
    },
    edit(shippingAddress) {
      this.$router.push({
        path: "/user/AddShippingAddress",
        query: {shippingAddress: JSON.stringify(shippingAddress)}
      });
    },
    choice(shippingAddress) {
      sessionStorage.setItem("isFromOrder", null);
      if (this.isFromOrder) {
        sessionStorage.setItem(
          "shippingAddress",
          JSON.stringify(shippingAddress)
        );
        this.$router.push({
          path: "/product/Order"
        });
      }
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
  bottom:0;
  overflow-y:scroll;
  overflow-x:hidden;
  

}
.noAddress{
  font-size: 15px;
  color: #999;
  margin-left: 30%;
}
.address-cell {
  border-radius: 10px;
}
.address-div {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
