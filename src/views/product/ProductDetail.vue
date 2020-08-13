<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar
      left-arrow
      right-text="按钮"
      @click-left="onClickLeft"
      @click-right="reportShowDialog"
    >
      <template #right>
        <van-icon name="warning-o" size="20" />
      </template>
    </van-nav-bar>
    <div style="  margin-left: 20px;margin-right: 20px;margin-top: 10px;">
      <van-row>
        <van-col span="3">
          <img
            style="height:40px;width:40px"
            :src="Common.ServerBasePath+'/trade/upload/headPortrait/head.jpg'"
          />
        </van-col>
        <van-col span="12">
          <div class="username">
            {{seller.name}}
            <img
              v-if="seller.sex=='男'"
              style="height:18px;width:18px;margin-left:5px;"
              :src="Common.ServerBasePath+'/trade/upload/headPortrait/man.png'"
            />
            <img
              v-if="seller.sex=='女'"
              style="height:18px;width:18px;margin-left:5px;"
              :src="Common.ServerBasePath+'/trade/upload/headPortrait/woman.png'"
            />
          </div>
          <div class="time">发布时间:{{Common.format(product.lastEditTime)}}</div>
          <!-- <div class="time" v-if="seller.shipAddress!=''">发布于:{{(seller.shipAddress ||  '' ).split('市')[0]+"市"}}</div> -->
          <!-- <div class="time" v-if="seller.shipAddress==''">发货地未知</div> -->
          <div class="time" v-if="seller.schoolId==1">发布于:郑州工商学院</div>
        </van-col>
      </van-row>
      <van-divider />
      <div>
        <span style="font-size: 14px;color: red;">￥</span>
        <span style="font-size: 18px;color: red;font-weight: bold;">{{product.price}}</span>
        <span
          v-if="product.originalPrice!=0"
          style="font-size: 12px;padding-left: 14px;text-decoration:line-through;color: #999;"
        >{{"￥"+product.originalPrice}}</span>
        <el-tag v-if="product.freight==0" size="mini" style="margin-left: 10px;">包邮</el-tag>
        <el-tag v-if="product.freight!=0" size="mini" type="info" style="margin-left: 10px;">不包邮</el-tag>
      </div>

      <div style="margin-top: 20px;word-wrap:break-word">{{product.productDesc}}</div>
      <div style="margin-top: 20px;" v-for="productImg in productImgList" :key="productImg">
        <el-image
          style="width:100%"
          :preview-src-list="productImgAddrList"
          :src="Common.ServerBasePath+'/trade'+productImg.imgAddr"
        />
      </div>
      <div class="font1">
        <img
          style="height:14px;width:14px"
          :src="Common.ServerBasePath+'/trade/upload/headPortrait/chaohuo.png'"
        />
        <span style="margin-left:5px;margin-bottom:5px">本平台不对商品交易进行担保</span>
        <span class="font2">赞 {{praiseCount}}·浏览 {{product.browse}}</span>
      </div>
      <van-divider />
      <!-- 管理 -->
      <van-dialog :close-on-click-overlay="true" v-model="managementShow" :show-cancel-button="false" :show-confirm-button="false">
        <van-cell>
          <span style="margin-left: 42%;">管理我的商品</span>
        </van-cell>
        <van-cell v-if="product.enableStatus!=2" @click="edit(product)">
          <span style="margin-left: 45%;color:rgb(25,137,250)">编辑</span>
        </van-cell>
        <van-cell @click="deleteProduct(product)">
          <span style="margin-left: 45%;color:rgb(25,137,250)">删除</span>
        </van-cell>
        <van-cell @click="cancel">
          <span style="margin-left: 45%;color:rgb(25,137,250)">取消</span>
        </van-cell>
      </van-dialog>

      <div style="height:50px" />

      <van-goods-action>
        <van-goods-action-icon v-if="productPraise.isPraise" @click="praise">
          <van-icon style="margin-bottom:5px" name="good-job" size="18" color="#1989fa" />
          <span style="margin-bottom:5px">赞</span>
        </van-goods-action-icon>

        <van-goods-action-icon
          icon="good-job-o"
          v-if="!productPraise.isPraise"
          text="赞"
          @click="praise"
        />
        <!-- <van-goods-action-icon icon="chat-o"
                               text="留言"
        @click="onClickIcon" />-->
        <van-goods-action-icon v-if="productCollect.isCollect" @click="collect">
          <van-icon style="margin-bottom:5px" name="star" size="18" color="rgb(255,218,51)" />
          <span style="margin-bottom:5px">收藏</span>
        </van-goods-action-icon>

        <van-goods-action-icon
          v-if="!productCollect.isCollect"
          icon="star-o"
          text="收藏"
          @click="collect"
        />
        <van-goods-action-button
          v-if="seller.userId!=buyer.userId && product.enableStatus==1"
          type="danger"
          text="立即购买"
          @click="createOrder"
        />

        <van-goods-action-button v-if="product.enableStatus==2" style="margin-bottom:10px;">
          <van-button
            type="default"
            plain
            size="small"
            color="red"
            style="margin-left: 30px;margin-right: 30px;margin-top: 9px;float:right;float：right;"
          >卖掉了</van-button>
        </van-goods-action-button>

        <van-goods-action-button
          v-if="seller.userId==buyer.userId"
          style="margin-bottom:10px;"
          @click="management"
        >
          <van-button
            type="default"
            plain
            size="small"
            color="rgb(25,137,250)"
            round
            style="margin-right: 30px;margin-top: 9px;float:right;"
          >管理</van-button>
        </van-goods-action-button>
      </van-goods-action>
    </div>
    <van-dialog
      :close-on-click-overlay="true"
      v-model="reportShow"
      title="举报"
      show-cancel-button
      @confirm="confirmReport"
    >
      <van-field v-model="report.reportMessage" rows="2" label="违规描述" type="textarea" placeholder="请输入举报原因" />
    </van-dialog>
  </div>
</template>
<script>
import { Dialog } from "vant";
export default {
  data() {
    return {
      product: "",
      seller: "",
      buyer: "",
      productImgList: [],
      praiseCount: 0,
      productPraise: "",
      productCollect: "",
      managementShow: false,
      productImgAddrList: [],
      reportShow: false,
      report: {reportMessage:""},
    };
  },
  mounted() {
    //校验登陆状态
    this.buyer = this.Common.checkLogin(this);

    if (this.buyer == null) {
      return;
    } else {
      var productId = this.$route.query.productId;
      var data1 = new FormData();
      data1.append("productId", productId);
      this.$http({
        url: "/frontend/productdetailpageinfo",
        method: "post",
        data: data1,
      }).then((response) => {
        if (response.data.success == true) {
          this.product = response.data.product;
          var sellerId = response.data.product.userId;
          var data2 = new FormData();
          data2.append("userId", sellerId);
          //再次发起获取卖家用户信息的请求
          console.log("请求卖家用户信息开始");
          this.$http({
            url: "/user/getuser",
            method: "post",
            data: data2,
          }).then((response) => {
            if (response.data.success == true) {
              this.seller = response.data.user;
              console.log(this.seller.schoolId);
              //请求点赞状态
              var data3 = new FormData();
              console.log("请求点赞状态开始1");
              data3.append("buyerId", this.buyer.userId);
              data3.append("sellerId", sellerId);
              data3.append("productId", this.product.productId);
              console.log("请求点赞状态开始2");
              this.$http({
                url: "/frontend/getproductpraisestatus",
                method: "post",
                data: data3,
              }).then((response) => {
                if (response.data.success == true) {
                  this.productPraise = response.data.productPraise;
                } else {
                  this.$toast.fail(response.data.errMsg);
                }
              });
              //请求收藏状态
              this.$http({
                url: "/frontend/getProductCollectStatus",
                method: "post",
                data: data3,
              }).then((response) => {
                if (response.data.success == true) {
                  this.productCollect = response.data.productCollect;
                } else {
                  this.$toast.fail(response.data.errMsg);
                }
              });
            } else {
              this.$toast.fail(response.data.errMsg);
            }
          });
          //请求图片列表
          this.$http({
            url: "/frontend/getproductimglist",
            method: "post",
            data: data1,
          }).then((response) => {
            if (response.data.success == true) {
              //for循环遍历新得到的数组，一条一条插入到展示数组中
              for (let i = 0; i < response.data.productImgList.length; i++) {
                this.productImgList.push(response.data.productImgList[i]);
                this.productImgAddrList.push(
                  this.Common.ServerBasePath +
                    "/trade" +
                    response.data.productImgList[i].imgAddr
                );
                console.log("@@@");
                console.log(this.productImgAddrList);
              }
            } else {
              this.$toast.fail(response.data.errMsg);
            }
          });
          this.$http({
            url: "/frontend/getproductpraisecountbyproductid",
            method: "post",
            data: data1,
          }).then((response) => {
            if (response.data.success == true) {
              this.praiseCount = response.data.praiseCount;
            } else {
              this.$toast.fail(response.data.errMsg);
            }
          });
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    praise() {
      var praiseData = new FormData();
      praiseData.append("productPraiseId", this.productPraise.productPraiseId);
      if (this.productPraise.isPraise) {
        this.$http({
          url: "/frontend/removeproductpraise",
          method: "post",
          data: praiseData,
        }).then((response) => {
          if (response.data.success == true) {
            this.productPraise.isPraise = false;
            this.praiseCount = this.praiseCount - 1;
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
      } else {
        this.$http({
          url: "/frontend/addproductpraise",
          method: "post",
          data: praiseData,
        }).then((response) => {
          if (response.data.success == true) {
            this.productPraise.isPraise = true;
            this.praiseCount = this.praiseCount + 1;
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
      }
    },

    collect() {
      // var collectData = new FormData();
      // collectData.append(
      //   "productCollectId",
      //   this.productCollect.productCollectId
      // );
      if (this.productCollect.isCollect) {
        this.$http({
          url: "/frontend/removeProductCollect",
          method: "post",
          data: this.productCollect,
        }).then((response) => {
          if (response.data.success == true) {
            this.productCollect.isCollect = false;
            this.$toast({
              message: "取消收藏",
            });
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
      } else {
        this.$http({
          url: "/frontend/addProductCollect",
          method: "post",
          data: this.productCollect,
        }).then((response) => {
          if (response.data.success == true) {
            this.productCollect.isCollect = true;
            this.$toast({
              message: "收藏成功",
              icon: "star",
            });
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
      }
    },
    reportShowDialog() {
      this.reportShow = true;
    },
    confirmReport() {
      this.report.informerId=this.buyer.userId;
      this.report.defendantId=this.seller.userId;
      this.report.productId=this.product.productId;
      this.$http({
        url: "/report/addReport",
        method: "post",
        data: this.report,
      }).then((response) => {
        if (response.data.success == true) {
          this.$toast.success("举报成功,感谢您的付出!");
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
    },
    createOrder() {
      sessionStorage.setItem("product", JSON.stringify(this.product));
      sessionStorage.setItem("seller", JSON.stringify(this.seller));
      this.$router.push({
        path: "/product/Order",
      });
    },
    management() {
      this.managementShow = true;
    },
    edit(product) {
      sessionStorage.setItem("product", JSON.stringify(product));
      sessionStorage.setItem("isEdit", true);
      this.$router.push({
        path: "/product/AddProduct",
      });
    },
    deleteProduct(product) {
      Dialog.confirm({
        message: "确认删除商品吗？",
      }).then(() => {
        this.$http({
          url: "/productadmin/deleteproductbyid",
          method: "post",
          data: product,
        }).then((response) => {
          if (response.data.success == true) {
            this.$toast.success("删除成功！");
            this.managementShow = false;
            this.$router.push({
              path: "/",
            });
          }
        });
      });
    },
    cancel() {
      this.managementShow = false;
    },
  },
};
</script>
<style scoped lang="less">
.username {
  font-weight: bold;
  font-size: 17px;
  margin-left: 5px;
}
.time {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
}
.font1 {
  font-size: 12px;
  color: RGB(64, 158, 255);
  margin-left: 5px;
  margin-top: 10px;
}
.font2 {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
  float: right;
}
</style>