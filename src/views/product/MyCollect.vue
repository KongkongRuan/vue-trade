<template>

  <div class="back-color">
    <!-- 标题 -->
    <van-nav-bar left-arrow
                 title="我收藏的"
                 @click-left="onClickLeft" />
    <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              :offset=5
              @load="onLoad">
      <van-cell v-for="(product,index) in productList"
                :key="product"
                class="product-cell">

        <div @click="choice(product.productId)">
          <van-col span="8"><img style="width:65px;height:65px"
                 :src='Common.ServerBasePath+"/trade"+product.imgAddr' /></van-col>
          <van-col span="16">
            <div class="product-name">{{product.productDesc.slice(0,40)}}<span v-if="product.productDesc.length>40">...</span></div>
            <div class="price"><span style="font-size:10px">￥</span>{{product.price}}</div>
            <div class="view">
              浏览 {{product.browse}}
              <van-tag v-if="product.enableStatus==2" style="margin-left: 18px" type="danger">卖掉了</van-tag>
              <van-tag v-if="product.enableStatus!=2&&product.enableStatus!=1" style="margin-left: 18px" >下架了</van-tag>
              </div>
          </van-col>
        </div>
        <div style="">
            <van-button v-if="product.collect"
                        @click="collect(product,index)"
                        style="float: right;"
                        size="small"
                        type="default">
              <van-icon style="vertical-align: middle;margin-bottom: 4px"
                        name="star"
                        size="16"
                        color="rgb(255,218,51)" />取消收藏</van-button>

            <van-button v-if="!product.collect"
                        @click="collect(product,index)"
                        style="float: right;"
                        size="small"
                        type="default">
              <van-icon style="vertical-align: middle;margin-bottom: 4px"
                        name="star-o"
                        size="16"
                        color="rgb(255,218,51)" />收藏</van-button>

        </div>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formPageinfor: {
        pageIndex: 1,
        pageSize: 7,
        type: "MyCollect"
      },
      productCollect:{
        userId:""
      },
      productList: [],
      loading: false,
      finished: false
    };
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    choice(productId) {
      this.$router.push({
        path: "/product/ProductDetail",
        query: { productId: productId }
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
              for (let i = 0; i < response.data.productList.length; i++) {
                this.productList.push(response.data.productList[i]);
              }
              this.formPageinfor.pageIndex++;
              //初始化商品收藏状态
              for (let i = 0; i < this.productList.length; i++) {
                this.productList[i].collect = true;
              }

              // this.count = response.data.count;
              if (this.productList.length == response.data.count) {
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
    collect(product,index) {
      console.log(product)
      this.productCollect.productId = product.productId;
      if (product.collect) {
        this.$http({
          url: "/frontend/removeProductCollect",
          method: "post",
          data: this.productCollect
        }).then(response => {
          if (response.data.success == true) {
            this.productList[index].collect = false;
            this.$forceUpdate();
            // this.productCollect.isCollect = false;
            this.$toast({
              message: "取消收藏"
            });
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
      } else {
        this.$http({
          url: "/frontend/addProductCollect",
          method: "post",
          data: this.productCollect
        }).then(response => {
          if (response.data.success == true) {
            this.productList[index].collect = true;
            this.$forceUpdate();
            // this.productCollect.isCollect = true;
            this.$toast({
              message: "收藏成功",
              icon: "star"
            });
          } else {
            this.$toast.fail(response.data.errMsg);
          }
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
  bottom: 0;
  overflow-y: scroll;
  overflow-x: hidden;
}
.product-name {
  font-weight: 600;
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