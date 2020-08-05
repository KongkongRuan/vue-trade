<template name="index">
  <div>
    <!-- 标题 -->
    <van-nav-bar title="二手交易平台" />
    <!-- 搜索框 -->
    <van-search v-model='formPageinfor.productDesc'
                placeholder="请输入搜索关键词"
                shape="round"
                @search="onSearch">
    </van-search>
    <!-- 分类块 -->
    <van-grid :column-num="3">
      <van-grid-item v-for="category in category_list"
                     :key="category.value"
                     :text='category.text'
                     @click="Fn(category.method)">
        <img class="category_img"
             :src="category.src" />
        <div class="category_text">{{category.text}}</div>
      </van-grid-item>
    </van-grid>
    <!-- 商品卡片 -->
    <div>
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">
        <el-row>
          <el-col :span="12"
                  v-for="product in this.productList"
                  :key="product.value">
            <el-card :body-style="bodyStyle"
                     @click.native="productDetail(product.productId)">
              <img :src='Common.ServerBasePath+"/trade"+product.imgAddr'
                   class="image"
                   style="border-radius: 5%;">
              <div style="padding: 14px;">
                <span style="font-size: 12px;word-wrap:break-word;">{{product.productDesc.slice(0,22)}}</span><span v-if="product.productDesc.length>22">...</span>
                <div style="height:18px"
                     v-if="product.productDesc.length<15" />
              </div>
              <div style="padding: 0px 0px 14px 14px;">
                <span style="font-size: 14px;color: red;">￥</span><span style="font-size: 18px;color: red;">{{product.price}}</span>
                <span v-if="product.originalPrice!=0"
                      style="font-size: 12px;padding-left: 14px;text-decoration:line-through">{{"￥"+product.originalPrice}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </van-list>
    </div>
    <div>
    </div>
    <div class="tabbar">
      <!-- 带路由的底部标签栏 -->
      <van-tabbar class="tabbar">
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
      formPageinfor: {
        pageIndexStr: 1,
        pageSizeStr: 4,
        productDesc: "",
        productCategory: ""
      },
      bodyStyle: {
        padding: "3px",
        height: "294px"
      },
      imgaddr: "/upload/item/user/1/2020020423064447641.png",
      loading: false,
      finished: false,
      product_total: 0,
      productList: [],
      scroll: 0,
      category_list: [
        {
          src: require("../../../static/image/手机.png"),
          text: "手机",
          method: "phone"
        },
        {
          src: require("../../../static/image/电脑数码.png"),
          text: "电脑数码",
          method: "computer"
        },
        {
          src: require("../../../static/image/家具.png"),
          text: "家具",
          method: "furniture"
        },
        {
          src: require("../../../static/image/美妆.png"),
          text: "美妆",
          method: "bm"
        },

        {
          src: require("../../../static/image/图书.png"),
          text: "图书",
          method: "book"
        },
        {
          src: require("../../../static/image/全部.png"),
          text: "全部",
          method: "all"
        }
      ]
    };
  },
  mounted() {
    this.$http({
      url: "/localauth/islogin",
      method: "post"
    }).then(response => {
      if (response.data.success == true) {
        if (response.data.currentUser) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify(response.data.currentUser)
          );
        }
      }
    });
  },
  methods: {
    selectByPage() {
      this.$http({
        url: "frontend/listproductsbyuser",
        method: "post",
        data: this.formPageinfor
      }).then(response => {
        if (response.data.success == true) {
          this.productList = response.data.productList;
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
    },
    //搜索框触发的函数
    onSearch() {
      this.$options.methods.conditionQuery.bind(this)();
    },
    conditionQuery() {
      //搜索时重置所有属性
      this.formPageinfor.pageIndexStr = 1;
      this.productList = [];
      this.loading = true;
      this.finished = false;

      this.$options.methods.onLoad.bind(this)();
    },
    onLoad() {
      setTimeout(() => {
        this.$http({
          url: "frontend/listproducts",
          method: "post",
          data: this.formPageinfor
        }).then(response => {
          if (response.data.success == true) {
            if (this.loading == true) {
              this.product_total = response.data.count;
              //for循环遍历新得到的数组，一条一条插入到展示数组中
              for (let i = 0; i < response.data.productList.length; i++) {
                this.productList.push(response.data.productList[i]);
              }
              this.formPageinfor.pageIndexStr++;
              if (this.productList.length == this.product_total) {
                this.finished = true;
              }
            }
          } else {
            this.$toast.fail(response.data.errMsg);
          }
          this.loading = false;
        });
      }, 1000);
    },
    productDetail(productId) {
      this.$router.push({
        path: "/product/ProductDetail",
        query: { productId: productId }
      });
    },
    //循环绑定函数
    Fn(method) {
      this[method]();
    },
    phone() {
      this.finished = false;
      this.formPageinfor.productCategory = "手机";
      this.$options.methods.conditionQuery.bind(this)();
    },
    computer() {
      this.formPageinfor.productCategory = "电脑数码";
      this.$options.methods.conditionQuery.bind(this)();
    },
    bm() {
      this.formPageinfor.productCategory = "美妆";
      this.$options.methods.conditionQuery.bind(this)();
    },
    furniture() {
      this.formPageinfor.productCategory = "家具";
      this.$options.methods.conditionQuery.bind(this)();
    },
    book() {
      this.formPageinfor.productCategory = "图书";
      this.$options.methods.conditionQuery.bind(this)();
    },
    all() {
      this.formPageinfor.productCategory = "";
      this.formPageinfor.productDesc = "";
      this.$options.methods.conditionQuery.bind(this)();
    }
  }
};
</script>

<style scoped>
.category_img {
  height: 30px;
  width: 30px;
}
.category_text {
  color: #7d7e80;
  font-size: 12px;
  word-wrap: break-word;
  margin-top: 3px;
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

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 178px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>