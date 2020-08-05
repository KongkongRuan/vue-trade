<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar left-arrow
                 title="下架商品列表"
                 @click-left="onClickLeft" />

    <van-list v-model="adminUnshelveloading"
              :finished="adminUnshelvefinished"
              finished-text="没有更多了"
              :offset=5
              @load="onLoad1">
      <van-cell>系统下架</van-cell>
      <van-cell v-for="(product,index) in adminUnshelveProductList"
                :key="product"
                class="product-cell">

        <div @click="choice(product.productId)">
          <van-col span="8"><img style="width:65px;height:65px"
                 :src='Common.ServerBasePath+"/trade"+product.imgAddr' /></van-col>
          <van-col span="16">
            <div class="product-name">{{product.productDesc.slice(0,10)+"..."}}</div>
            <div class="price"><span style="font-size:10px">￥</span>{{product.price}}</div>
            <div class="view">浏览 {{product.browse}}</div>
          </van-col>
        </div>
        <div style="">
          <van-col span="5" />
          <van-col span="5"/>
          <van-col span="6">

          </van-col>
          <van-col span="2">
            <van-button @click="deleteProduct1(product,index)"
                        size="mini"
                        round
                        type="default">删除</van-button>
          </van-col>
        </div>
      </van-cell>
    </van-list>



    <van-list v-model="myUnshelveloading"
              :finished="myUnshelvefinished"
              finished-text="没有更多了"
              :offset=5
              @load="onLoad2">
      <van-cell>主动下架</van-cell>
      <van-cell v-for="(product,index) in myUnshelveProductList"
                :key="product"
                class="product-cell">

        <div @click="choice(product.productId)">
          <van-col span="8"><img style="width:65px;height:65px"
                 :src='Common.ServerBasePath+"/trade"+product.imgAddr' /></van-col>
          <van-col span="16">
            <div class="product-name">{{product.productDesc.slice(0,10)+"..."}}</div>
            <div class="price"><span style="font-size:10px">￥</span>{{product.price}}</div>
            <div class="view">浏览 {{product.browse}}</div>
          </van-col>
        </div>
        <div style="">
          <van-col span="5" />
          <van-col span="5"/>
          <van-col span="6">
            <van-button @click="edit(product)"
                        size="mini"
                        round
                        type="default">重新发布</van-button>
          </van-col>
          <van-col span="2">
            <van-button @click="deleteProduct2(product,index)"
                        size="mini"
                        round
                        type="default">删除</van-button>
          </van-col>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
import { Dialog } from 'vant';
export default {
  data() {
    return {
      adminUnshelveProductList: [],
      myUnshelveProductList: [],
      adminUnshelveloading:false,
      adminUnshelvefinished:false,
      myUnshelveloading:false,
      myUnshelvefinished:false,
      adminUnshelveFormPageinfor: {
        pageIndex: 1,
        pageSize: 7,
        type: "AdminUnshelve",
      },
      myUnshelveFormPageinfor: {
        pageIndex: 1,
        pageSize: 7,
        type: "MyUnshelve",
      },
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
    onLoad1() {
      setTimeout(() => {
        this.$http({
          url: "/productadmin/getproductlist",
          method: "post",
          data: this.adminUnshelveFormPageinfor
        }).then(response => {
          if (response.data.success == true) {
              console.log("管理员")
            if (this.adminUnshelveloading == true) {
              //接收商品列表
              for (let i = 0; i < response.data.productList.length; i++) {
                this.adminUnshelveProductList.push(response.data.productList[i]);
              }
              this.adminUnshelveFormPageinfor.pageIndex++;
              if (this.adminUnshelveProductList.length == response.data.count) {
                this.adminUnshelvefinished = true;
              }
            }
          } else {
            this.$toast.fail(response.data.errMsg);
          }
          this.adminUnshelveloading = false;
        });
      }, 500);
    },
    onLoad2() {
      setTimeout(() => {
        if(this.adminUnshelveFormPageinfor.finished=true){
            this.$http({
            url: "/productadmin/getproductlist",
            method: "post",
            data: this.myUnshelveFormPageinfor
            }).then(response => {
            if (response.data.success == true) {
                console.log("用户")
                if (this.myUnshelveloading == true) {
                //接收商品列表
                for (let i = 0; i < response.data.productList.length; i++) {
                    this.myUnshelveProductList.push(response.data.productList[i]);
                }
                this.myUnshelveFormPageinfor.pageIndex++;
                // this.count = response.data.count;
                if (this.myUnshelveProductList.length == response.data.count) {
                    this.myUnshelvefinished = true;
                }
                }
            } else {
                this.$toast.fail(response.data.errMsg);
            }
            this.myUnshelveloading = false;
            });
        }
      }, 500);
    },
    edit(product) {
      sessionStorage.setItem("product", JSON.stringify(product));
      sessionStorage.setItem("isEdit", true);
      this.$router.push({
        path: "/product/AddProduct"
      });
    },
    //删除
    deleteProduct1(product,index){
      Dialog.confirm({
        message: '确认删除商品吗？'
      }).then(() => {
        this.$http({
          url: "/productadmin/deleteproductbyid",
          method: "post",
          data: product
        }).then(response => {
          if (response.data.success == true) {
            this.$toast.success("删除成功！");
            //实时移除这个项目
            this.adminUnshelveProductList.splice(index,1);
            this.$forceUpdate();
            done();
          }
        });
      }).catch(() => {
        // on cancel
      });
    },
    //删除
    deleteProduct2(product,index){
      Dialog.confirm({
        message: '确认删除商品吗？'
      }).then(() => {
        this.$http({
          url: "/productadmin/deleteproductbyid",
          method: "post",
          data: product
        }).then(response => {
          if (response.data.success == true) {
            this.$toast.success("删除成功！");
            //实时移除这个项目
            this.myUnshelveProductList.splice(index,1);
            this.$forceUpdate();
            done();
          }
        });
      }).catch(() => {
        // on cancel
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