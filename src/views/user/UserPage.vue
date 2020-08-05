<template>
  <div class="back-color">
    <van-cell class="cell1">
      <van-col span="6"><img style="height:70px;width:70px;border-radius: 15px;"
             :src="Common.ServerBasePath+'/trade/upload/headPortrait/head.jpg'">
      </van-col>
      <van-col span="12">
        <div class="username">{{user.name}}</div>
        <div class="ship_address">{{user.shipAddress}}</div>
        <div @click="modifyUserInfor"
             v-if="user.shipAddress==null"
             class="ship_address">暂未设置常住地(点击设置)</div>
      </van-col>

      <span @click="Setting"
            style="font-size:20px">
        <span class="el-icon-switch-button" />
      </span>

      <van-col span="3">
      </van-col>

    </van-cell>

    <van-cell class="cell2">
      <div style="margin-top: 8px;font-size: 15px;font-weight: 500;">
        <van-col span="7"
                 style="margin-left: 40px;">超赞 {{praiseCount}}</van-col>
        <van-col span="3"></van-col>
        <van-col span="10">赚入￥{{generalIncome}}</van-col>
      </div>
    </van-cell>

    <van-cell class="cell3">

      <div class="cell-font">

        <van-col @click="myIssue"
                 span="7"
                 style="margin-left: 40px;"><span style="font-size:30px;margin-left: 15px;color:rgb(25,137,250)"
                class="el-icon-s-order" /><br>我发布的 {{productCount}}</van-col>
        <van-col @click="mySold"
                 span="7"
                 style="margin-left: 40px;">
          <van-icon color="rgb(25,137,250)"
                    size="27px"
                    name="gold-coin"
                    style="margin-left: 19px;" /><br>我卖出的 {{soldCount}}</van-col>
      </div>
    </van-cell>

    <van-cell class="cell4">
      <div class="cell-font"
           style="margin-top: 15px;">
        <van-col @click="myBought"
                 span="7"
                 style="margin-left: 40px;"><span style="font-size:30px;margin-left: 15px;color:rgb(25,137,250)"
                class="el-icon-s-goods" /><br>我买到的 {{boughtCount}}</van-col>
        <van-col @click="myCollect"
                 span="7"
                 style="margin-left: 40px;"><span style="font-size:30px;margin-left: 15px;color:rgb(25,137,250)"
                class="el-icon-s-flag" /><br>我收藏的 {{collectCount}}</van-col>
      </div>
    </van-cell>
    <van-cell class="cell5">
      <div class="cell-font">
        <van-col span="7"
                 @click="shippingAddressList"
                 style="margin-left: 40px;">
          <van-icon color="rgb(25,137,250)"
                    size="27px"
                    name="location"
                    style="margin-left: 19px;" /><br>收货地址管理</van-col>
        <van-col span="7"
                 @click="modifyUserInfor"
                 style="margin-left: 40px;"><span style="font-size:31px;margin-left: 20px;color:rgb(25,137,250)"
                class="el-icon-s-custom" /><br>修改个人资料</van-col>

        <van-col span="7"
                 @click="modifyPassworld"
                 style="margin-left: 40px;margin-top: 20px;">
          <van-icon color="rgb(25,137,250)"
                    size="30px"
                    name="lock"
                    style="margin-left: 19px;" /><br>修改密码</van-col>
        <!-- <van-col span="7"
                 style="margin-left: 40px;">
                 <span style="font-size:30px;margin-left: 15px;color:rgb(25,137,250)" class="el-icon-error" />
                 <br>退出登录</van-col> -->
      </div>
    </van-cell>
    <!-- <div @click="logout">
      退出登录
    </div> -->

    <div class="tabbar">
      <!-- 带路由的底部标签栏 -->
      <van-tabbar route
                  class="tabbar">
        <van-tabbar-item to="/"
                         class="home_page">
          <van-icon name="wap-home-o"
                    size="25px" />
          <div>首页</div>
        </van-tabbar-item>
        <van-tabbar-item to="/product/AddProduct"
                         class="add_product">
          <van-icon name="add"
                    size="3rem"
                    class="sell-font"
                    color="#1989fa" />
          <div class="add_product_txt">我要卖</div>
        </van-tabbar-item>
        <van-tabbar-item to="/user/UserPage">
          <van-icon name="user-circle-o"
                    size="25px" />
          <div>我的</div>
        </van-tabbar-item>
      </van-tabbar>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      user: "",
      praiseCount: "",
      productCount: "",
      soldCount: "",
      boughtCount: "",
      collectCount: "",
      generalIncome: ""
    };
  },
  mounted() {
    
    this.user = JSON.parse(localStorage.getItem("currentUser"));

    //获取点赞总数
    var userIdData = new FormData();
    userIdData.append("userId", this.user.userId);
    this.$http({
      url: "/frontend/getproductpraisecountbysellerid",
      method: "post",
      data: userIdData
    }).then(response => {
      if (response.data.success == true) {
        this.praiseCount = response.data.praiseCount;
      } else {
        this.$toast.fail(response.data.errMsg);
      }
    });
    //获取我发布的商品总数
    this.$http({
      url: "/userpage/countMyProduct",
      method: "post",
      data: userIdData
    }).then(response => {
      if (response.data.success == true) {
        this.productCount = response.data.productCount;
      } else {
        this.$toast.fail(response.data.errMsg);
      }
    });
    //获取我卖出的总数
    this.$http({
      url: "/userpage/countMySold",
      method: "post",
      data: userIdData
    }).then(response => {
      if (response.data.success == true) {
        this.soldCount = response.data.soldCount;
      } else {
        this.$toast.fail(response.data.errMsg);
      }
    });
    //获取我买到的总数
    this.$http({
      url: "/userpage/countMyBought",
      method: "post",
      data: userIdData
    }).then(response => {
      if (response.data.success == true) {
        this.boughtCount = response.data.boughtCount;
      } else {
        this.$toast.fail(response.data.errMsg);
      }
    });
    //获取我收藏的总数
    this.$http({
      url: "/frontend/getProductCollectCountByBuyerId",
      method: "post",
      data: userIdData
    }).then(response => {
      if (response.data.success == true) {
        this.collectCount = response.data.collectCount;
      } else {
        this.$toast.fail(response.data.errMsg);
      }
    });
    //获取我赚入的
    this.$http({
      url: "/userpage/getMySoldGeneralIncome",
      method: "post"
    }).then(response => {
      if (response.data.success == true) {
        this.generalIncome = response.data.generalIncome;
      } else {
        this.$toast.fail(response.data.errMsg);
      }
    });
  },
  methods: {
    Setting() {
      localStorage.setItem("currentUser", null);
      localStorage.clear();
      sessionStorage.clear();
      this.$toast.success("退出登陆成功！");
      this.$router.push({ path: "/" });
    },
    shippingAddressList() {
      this.$router.push({ path: "/user/ShippingAddressList" });
    },
    myIssue() {
      this.$router.push({ path: "/product/MyIssue" });
    },
    myCollect() {
      this.$router.push({ path: "/product/MyCollect" });
    },
    mySold() {
      this.$router.push({
        path: "/product/MyBoughtOrSold",
        query: { pageType: "MySold" }
      });
    },
    myBought() {
      this.$router.push({
        path: "/product/MyBoughtOrSold",
        query: { pageType: "MyBought" }
      });
    },
    modifyUserInfor() {
      this.$router.push({
        path: "/user/ModifyUserInfor"
      });
    },
    modifyPassworld() {
      this.$router.push({
        path: "/user/ModifyPassworld"
      });
    }
  }
};
</script>
<style scoped>
.cell1 {
  padding-top: 35px;
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
  height: 150px;
  border-radius: 0px 0px 15px 15px;
}
.username {
  font-size: 20px;
  font-weight: 700;
  margin-top: 5px;
}
.ship_address {
  font-size: 10px;
  margin-top: 5px;
}
.cell2 {
  position: absolute;
  top: 126px;
  border-radius: 20px;
  height: 60px;
  width: 95%;
  margin-left: 10px;
  margin-right: 10px;
}
.cell3 {
  position: absolute;
  border-radius: 20px;
  height: 110px;
  width: 95%;
  top: 200px;
  margin-left: 10px;
}

.cell4 {
  position: absolute;
  border-radius: 20px;
  height: 120px;
  width: 95%;
  top: 330px;
  margin-left: 10px;
}
.cell-font {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #999;
}
.cell5 {
  position: absolute;
  border-radius: 20px;
  height: 190px;
  width: 95%;
  top: 470px;
  margin-left: 10px;
}
.back-color {
  background-color: rgb(243, 244, 248);
  width: 100%;
  height: 100%;
  position: fixed;
}
.tabbar {
  margin-top: 50px;
}
.home_page {
  margin-right: 15%;
}
.add_product {
  position: absolute;
  z-index: 2;
  left: 45%;
  bottom: 40%;
}
.add_product_txt {
  position: absolute;
  left: 5px;
}
</style>