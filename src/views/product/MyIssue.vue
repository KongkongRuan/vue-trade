<template>

  <div class="back-color">
    <!-- 标题 -->
    <van-nav-bar right-text="下架商品"
                 left-arrow
                 title="我发布的"
                 @click-left="onClickLeft"
                 @click-right="onClickRight" />

    <!-- <div class="product-div"> -->

    <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              :offset=5
              @load="onLoad">
      <van-cell v-for="(product,index) in productList"
                :key="product"
                class="product-cell">

        <van-row @click="choice(product.productId)">
          <van-col span="8"><img style="width:65px;height:65px"
                 :src='Common.ServerBasePath+"/trade"+product.imgAddr' /></van-col>
          <van-col span="16">
            <div class="product-name">{{product.productDesc.slice(0,30)}}<span v-if="product.productDesc.length>30">...</span></div>
            <div class="price"><span style="font-size:10px">￥</span>{{product.price}}<van-tag v-if="product.enableStatus==2"
                       style="margin-left:20px"
                       plain
                       type="danger">已卖出</van-tag>
            </div>
            <div class="view">浏览 {{product.browse}}</div>
          </van-col>
        </van-row>
        <div >
          <van-row >
            <van-col span="7" />
            <van-col span="4">
              <van-button @click="polish(product)"
                          v-if="product.enableStatus!=2" 
                          size="mini"
                          round
                          plain
                          type="info">擦亮</van-button>
            </van-col>
            <van-col span="4">
              <van-button  @click="depreciate(index)"
                          v-if="product.enableStatus!=2"
                          size="mini"
                          round
                          plain
                          type="info">降价</van-button>
            </van-col>
            <van-col span="4">
              <van-button  @click="edit(product)"
                          v-if="product.enableStatus!=2"
                          size="mini"
                          round
                          plain
                          type="info">编辑</van-button>
            </van-col>

            <van-col span="3" v-if="product.enableStatus==2">
              <van-button @click="deleteProduct(product,index)"
                          
                          size="mini"
                          round
                          plain
                          type="info">删除</van-button>
            </van-col>

            <van-col span="2">
              <van-button  @click="more(index)"
                          v-if="product.enableStatus!=2"
                          size="mini"
                          round
                          plain
                          type="info">···</van-button>
            </van-col>
          </van-row>
        </div>

        <van-dialog v-model="productList[index].depreciateShow"
                    :show-cancel-button="false"
                    :show-confirm-button="false">

          <van-radio-group v-model="radio">
            <van-cell>
              <span style="font-size:14px;margin-left: 90px;">现价：<span style="color: red;font-size:17px">￥{{product.price}}</span></span>
              <van-icon @click="cancel"
                        size="15"
                        style="margin-left: 50px;"
                        name="cross" />
            </van-cell>
            <van-cell title="打八折"
                      clickable
                      @click="radio = '1'">
              <span style="margin-right: 10px;">降价至：￥{{parseFloat(product.price*0.8).toFixed(2)}}</span>
              <van-radio slot="right-icon"
                         name="1" />
            </van-cell>
            <van-cell title="打五折"
                      clickable
                      @click="radio = '2'">
              <span style="margin-right: 10px;">降价至：￥{{parseFloat(product.price*0.5).toFixed(2)}}</span>
              <van-radio slot="right-icon"
                         name="2" />
            </van-cell>
            <van-cell title="打三折"
                      clickable
                      @click="radio = '3'">
              <span style="margin-right: 10px;">降价至：￥{{parseFloat(product.price*0.3).toFixed(2)}}</span>
              <van-radio slot="right-icon"
                         name="3" />
            </van-cell>
            <van-button type="info"
                        block
                        @click="depreciateSub(product)"> 确定</van-button>
          </van-radio-group>

        </van-dialog>

        <van-dialog v-model="productList[index].moreShow"
                    :show-cancel-button="false"
                    :show-confirm-button="false">
          <van-cell><span style="margin-left: 42%;">更多操作</span></van-cell>
          <van-cell @click="unshelve(product,index)"><span style="margin-left: 45%;color:rgb(25,137,250)">下架</span></van-cell>
          <van-cell @click="deleteProduct(product,index)"><span style="margin-left: 45%;color:rgb(25,137,250)">删除</span></van-cell>
          <van-cell @click="cancel2"><span style="margin-left: 45%;color:rgb(25,137,250)">取消</span></van-cell>
        </van-dialog>
      </van-cell>
    </van-list>
    <!-- </div> -->

  </div>
</template>
<script>
import { Dialog } from "vant";
export default {
  data() {
    return {
      productList: [],
      loading: false,
      finished: false,
      formPageinfor: {
        pageIndex: 1,
        pageSize: 7,
        type: "MyIssue"
      },
      radio: "1",
      show: false
    };
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.$router.push({
        path: "/product/UnshelveProductList"
      });
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
            if (this.loading == true) {
              //接收商品列表
              for (let i = 0; i < response.data.productList.length; i++) {
                this.productList.push(response.data.productList[i]);
              }
              //初始化降价模块show属性
              for (let i = 0; i < this.productList.length; i++) {
                this.productList[i].depreciateShow = false;
              }

              //初始化更多模块show属性
              for (let i = 0; i < this.productList.length; i++) {
                this.productList[i].moreShow = false;
              }
              this.formPageinfor.pageIndex++;
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
    edit(product) {
      sessionStorage.setItem("product", JSON.stringify(product));
      sessionStorage.setItem("isEdit", true);
      this.$router.push({
        path: "/product/AddProduct"
      });
    },
    polish(product) {
      this.$http({
        url: "/productadmin/polishOrDepreciateProduct",
        method: "post",
        data: product
      }).then(response => {
        if (response.data.success == true) {
          this.$toast.success("擦亮成功！");
        }
      });
    },
    //降价
    depreciate(index) {
      this.productList[index].depreciateShow = true;
      this.$forceUpdate();
    },
    //取消降价
    cancel() {
      for (let i = 0; i < this.productList.length; i++) {
        this.productList[i].depreciateShow = false;
      }
      this.$forceUpdate();
      done();
    },
    //确认降价
    depreciateSub(product) {
      if (this.radio == "1") {
        product.price = parseFloat(product.price * 0.8).toFixed(2);
      } else if (this.radio == "2") {
        product.price = parseFloat(product.price * 0.5).toFixed(2);
      } else if (this.radio == "3") {
        product.price = parseFloat(product.price * 0.3).toFixed(2);
      }
      this.$http({
        url: "/productadmin/polishOrDepreciateProduct",
        method: "post",
        data: product
      }).then(response => {
        if (response.data.success == true) {
          this.$toast.success("改价成功！");
          for (let i = 0; i < this.productList.length; i++) {
            this.productList[i].depreciateShow = false;
          }
          this.$forceUpdate();
          done();
        }
      });
    },
    //下架
    unshelve(product, index) {
      Dialog.confirm({
        message: "确认下架商品吗？"
      })
        .then(() => {
          this.$http({
            url: "/productadmin/unshelveProduct",
            method: "post",
            data: product
          }).then(response => {
            if (response.data.success == true) {
              this.$toast.success("下架成功！");
              for (let i = 0; i < this.productList.length; i++) {
                this.productList[i].moreShow = false;
              }
              //实时移除这个项目
              this.productList.splice(index, 1);
              this.$forceUpdate();
              done();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    //删除
    deleteProduct(product, index) {
      Dialog.confirm({
        message: "确认删除商品吗？"
      })
        .then(() => {
          this.$http({
            url: "/productadmin/deleteproductbyid",
            method: "post",
            data: product
          }).then(response => {
            if (response.data.success == true) {
              this.$toast.success("删除成功！");
              for (let i = 0; i < this.productList.length; i++) {
                this.productList[i].moreShow = false;
              }
              //实时移除这个项目
              this.productList.splice(index, 1);
              this.$forceUpdate();
              done();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    more(index) {
      this.productList[index].moreShow = true;
      this.$forceUpdate();
    },
    cancel2() {
      for (let i = 0; i < this.productList.length; i++) {
        this.productList[i].moreShow = false;
      }
      this.$forceUpdate();
      done();
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