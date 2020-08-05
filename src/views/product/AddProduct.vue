<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar v-if="!isEdit"
                 left-arrow
                 title="上架商品"
                 @click-left="onClickLeft">
      <van-button round
                  type="info"
                  size="small"
                  slot="right"
                  @click="addProduct">发布</van-button>
    </van-nav-bar>
    <van-nav-bar v-if="isEdit"
                 left-arrow
                 title="编辑商品"
                 @click-left="onClickLeft">
      <van-button round
                  type="info"
                  size="small"
                  slot="right"
                  @click="addProduct">发布</van-button>
    </van-nav-bar>

    <van-row style="margin-bottom: 30px">
      <van-field class="product_desc"
                 v-model="addForm.productDesc"
                 rows="5"
                 autosize
                 type="textarea"
                 :placeholder=placeholder />

      <div class="global_style">
        <van-uploader v-model="imgList"
                      multiple
                      :max-count="6" />
        <div>
          <van-tag plain
                   round>{{showShipAddress}}</van-tag>
        </div>
      </div>
    </van-row>
    <van-field readonly
               clickable
               label="分类"
               :value="addForm.productCategory"
               placeholder="请选择分类"
               @click="showPicker = true" />
    <van-popup v-model="showPicker"
               position="bottom">
      <van-picker show-toolbar
                  :columns="categoryColumns"
                  @cancel="showPicker = false"
                  @confirm="onConfirm" />
    </van-popup>
    <van-field label="价格"
               left-icon="gold-coin-o"
               readonly
               clickable
               :value="addForm.price"
               placeholder="开个价￥"
               @touchstart.native.stop="show1 = true;show2 = false;show3 = false" />

    <van-number-keyboard v-model="addForm.price"
                         :show="show1"
                         theme="custom"
                         extra-key="."
                         close-button-text="完成"
                         hide-on-click-outside
                         @blur="show1 = false" />

    <van-field label="入手价"
               left-icon="gold-coin-o"
               readonly
               clickable
               :value="addForm.originalPrice"
               placeholder="宝贝原价￥"
               @touchstart.native.stop="show2 = true;show1 = false;show3 = false" />

    <van-number-keyboard v-model="addForm.originalPrice"
                         :show="show2"
                         theme="custom"
                         extra-key="."
                         close-button-text="完成"
                         hide-on-click-outside
                         @blur="show2 = false" />

    <van-col style="margin-left: 20px;margin-top: 20px;margin-bottom: 20px;"><span style="color: #323233;font-size: 14px;line-height: 24px;">是否包邮？</span>
      <van-switch style="position: absolute;right:180px;"
                  size="24px"
                  v-model="checked" />
    </van-col>
    <van-col v-show='checked==false'>
      <van-field label="运费"
                 left-icon="gold-coin-o"
                 readonly
                 clickable
                 v-model="addForm.freight"
                 placeholder="运费￥"
                 @touchstart.native.stop="show3 = true;show1 = false;show2 = false" />
      <van-number-keyboard v-model="addForm.freight"
                           :show="show3"
                           theme="custom"
                           extra-key="."
                           close-button-text="完成"
                           hide-on-click-outside
                           @blur="show3 = false" />
    </van-col>

  </div>
</template>
<script>
export default {
  data() {
    return {
      //前台显示地址
      showShipAddress:"发货地址",
      show1: false,
      show2: false,
      show3: false,
      checked: true,
      bargain:"",
      imgList: [],
      showPicker: false,
      placeholder:"品牌型号,新旧程度,入手渠道,转手原因...\n为防止图片压缩建议上传正方形图片",
      categoryColumns: ['手机', '电脑数码', '家具', '美妆', '图书','其他'],
      addForm:{
        productId:"",
        productCategory: '',
        productDesc: "",
        //实际后台传送地址
        shipAddress:"",
        price: "",
        originalPrice: "",
        freight: "",
        browse:""
      },
      isEdit:false
    };
  },
  mounted() {    
    //校验登陆状态
    //如果已登录 获取到用户发货地址 绑定给shipAddress
    let user  = this.Common.checkLogin(this);
    if(user==null){
      return;
      }else{
        this.addForm.shipAddress = user.shipAddress;
        if(user.shipAddress!=null){
          this.showShipAddress=user.shipAddress.split('市')[0]+"市";
        }
      }
    let product = JSON.parse(sessionStorage.getItem("product"));
    let isEdit = JSON.parse(sessionStorage.getItem("isEdit"));
    if(product!=null&&isEdit!=null){
      this.isEdit = true;
      this.addForm.productId = product.productId;
      this.addForm.productDesc=product.productDesc;
      this.addForm.productCategory = product.productCategory;
      this.addForm.browse = product.browse;
      this.addForm.price = product.price+"";
      this.addForm.originalPrice = product.originalPrice+"";
      if(product.freight!=0){
        this.checked=false;
        this.addForm.freight = product.freight+"";
      }
      sessionStorage.setItem("product",null);
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onConfirm(value) {
      this.addForm.productCategory = value;
      this.showPicker = false;
    },
    addProduct() {
      this.$toast.loading({
        message: "发布中...",
        forbidClick: true
      });
        if (this.addForm.product_desc==""||this.addForm.price==""){
          this.$toast.fail("商品描述或者价格不能为空");
          return;
        }
        if (this.addForm.productCategory==""){
          this.$toast.fail("请选择一个合适商品分类或者选择其他");
          return;
        }
        var data = new FormData();
        for(let i=0;i<this.imgList.length;i++){
          data.append("productImg"+i,this.imgList[i].file)
        }
        data.append("productId",this.addForm.productId)
        data.append("browse",this.addForm.browse)
        data.append("productCategory",this.addForm.productCategory)
        data.append("productDesc",this.addForm.productDesc)
        data.append("shipAddress",this.addForm.shipAddress)
        data.append("price",this.addForm.price)
        data.append("originalPrice",this.addForm.originalPrice)
        data.append("freight",this.addForm.freight)
        if(!this.isEdit){
          this.$http.post(
            "productadmin/addproduct",
            data
          ).then(response => {
            if (response.data.success == true) {
              this.$toast.success("添加成功！");
              this.$router.push({ path: "/" });
            } else {
              this.$toast.fail(response.data.errMsg);
            }
          });
        }else{
          this.$http.post(
            "productadmin/modifyproduct",
            data
          ).then(response => {
            if (response.data.success == true) {
              this.$toast.success("更新成功！");
              this.$router.push({ path: "/" });
            } else {
              this.$toast.fail(response.data.errMsg);
            }
          });
        }

    }
  }
};
</script>

<style scoped lang="less">
.product_desc {
  margin-top: 5%;
}
.global_style {
  margin-left: 20px;
  margin-right: 20px;
}
</style>