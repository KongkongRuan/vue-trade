<template>
  <div class="back-color">
    <van-nav-bar v-if="!isEdit"
                 left-arrow
                 title="添加收货地址"
                 @click-left="onClickLeft" />
    <van-nav-bar v-if="isEdit"
                 left-arrow
                 title="编辑收货地址"
                 @click-left="onClickLeft" />
    <div style="margin-top: 40px;"></div>
    <div class="cell1">
      <van-field v-model="shippingAddressForm.name"
                 style="border-radius:10px 10px 0px 0px;"
                 label="姓名"
                 placeholder="收货人姓名" />
      <van-field v-model="shippingAddressForm.phoneNumber"
                 label="电话"
                 placeholder="收货人手机号" />
      <!-- <van-field v-model="shippingAddressForm.areaName"
                 label="地区"
                 @click="showPopup"
                 placeholder="选择省/市/区"
                 is-link
                 readonly /> -->
      <van-field v-model="schoolName"
                 label="学校"
                 placeholder="请在个人中心设置学校"
                 
                 readonly />
      <van-field v-model="shippingAddressForm.detailAddress"
                 label="详细地址"
                 style="border-radius:0px 0px 10px 10px;"
                 placeholder="宿舍楼号,楼层房间号等信息" />
    </div>
    <div class="cell2">
      <van-cell style="border-radius:10px;"
                center
                title="设为默认收货地址">
        <van-switch :disabled="disabledChangeDefaultAddress"
                    v-model="isDefaultAddress"
                    slot="right-icon"
                    size="24" />
      </van-cell>
    </div>
    <van-button round
                style="width: 90%;margin-left: 5%;margin-top: 40px;"
                type="danger"
                block
                @click="onSave">保存</van-button>
    <van-button v-if="isEdit"
                round
                style="width: 90%;margin-left: 5%;margin-top: 10px;"
                type="default"
                block
                @click="onDelete">删除</van-button>
    <van-popup v-model="show"
               position="bottom"
               :style="{ height: '30%' }">
      <van-area ref="myArea"
                :value="shippingAddressForm.areaValue"
                :area-list="areaList"
                @confirm="onConfirm"
                @change="onChange"
                @cancel="onCancel" />
    </van-popup>

  </div>
</template>
<script>
import areaList from "../../assets/js/area.js";
import { Dialog } from 'vant';
export default {
  data() {
    return {
      shippingAddressForm: {
        shippingAddressId: "",
        name: "",
        phoneNumber: "",
        areaValue: "",
        defaultAddress: "",
        detailAddress: "",
        areaName: "",
        userId: ""
        
      },
      isDefaultAddress: false,
      disabledChangeDefaultAddress: false,
      show: false,
      buyer: "",
      isEdit: false,
      areaList,
      school:{},
      schoolName:""
    };
  },
  mounted() {
    this.buyer  = this.Common.checkLogin(this);
    // var sessionShippingAddress = JSON.parse(sessionStorage.getItem("shippingAddress"));
    this.shippingAddressForm.phoneNumber=localStorage.getItem("username");;
        //获取学校列表
    this.school.schoolId = this.buyer.schoolId;
    this.$http({
      url: "/school/getSchoolById",
      method: "post",
      data:this.school
    }).then((response) => { 
      if (response.data.success == true) {
        
              this.schoolName=response.data.school.schoolName;
              
      } else {
        this.$toast.fail(response.data.errMsg);
      }
    });

    // console.log("@@@"+this.buyer.schoolId);
    // this.schoolName="郑州工商学院";
    // if(this.buyer.schoolId==1){
    //     this.schoolName="郑州工商学院";
    // }



    var routerShippingAddress = JSON.parse(this.$route.query.shippingAddress);
    if (this.buyer == null) {
      return ;
    }

    //如果传过来有ShippingAddress则说明是编辑页面
    if (routerShippingAddress != null) {
      this.isEdit = true;
      this.shippingAddressForm.shippingAddressId =
        routerShippingAddress.shippingAddressId;
      this.shippingAddressForm.name = routerShippingAddress.name;
      this.shippingAddressForm.phoneNumber = routerShippingAddress.phoneNumber;
      this.shippingAddressForm.areaValue = routerShippingAddress.areaValue;
      this.shippingAddressForm.areaName = routerShippingAddress.areaName;
      this.shippingAddressForm.detailAddress =
        routerShippingAddress.detailAddress;
      if (routerShippingAddress.defaultAddress == 1) {
        this.isDefaultAddress = true;
        this.disabledChangeDefaultAddress = true;
      } else {
        this.isDefaultAddress = false;
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onDelete() {
      Dialog.confirm({
        message: "是否确定删除?"
      }).then(() => {
          var data = new FormData();
          data.append(
            "shippingAddressId",
            this.shippingAddressForm.shippingAddressId
          );
          this.$http({
            url: "/frontend/deleteshippingaddress",
            method: "post",
            data: data
          }).then(response => {
            if (response.data.success == true) {
              this.$toast.success("删除成功！");
              this.$router.push({ path: "/user/ShippingAddressList" });
            }
          });
        })
        .catch(() => {
          // on cancel
        });

    },
    onSave() {
      this.shippingAddressForm.userId = this.buyer.userId;
      if (this.isDefaultAddress) {
        this.shippingAddressForm.defaultAddress = 1;
      } else {
        this.shippingAddressForm.defaultAddress = 0;
      }
      if (
        this.shippingAddressForm.name == "" ||
        this.shippingAddressForm.phoneNumber == "" ||
        this.shippingAddressForm.detailAddress == ""
      ) {
        this.$toast.fail("请按照规范填写信息");
        return;
      }
      if (
        this.shippingAddressForm.phoneNumber.slice(0, 1) != 1 ||
        this.shippingAddressForm.phoneNumber.length != 11
      ) {
        this.$toast.fail("手机号不符合规范,请检查");
        return;
      }
      if (this.shippingAddressForm.shippingAddressId != "") {
        this.$http({
          url: "/frontend/updateshippingaddress",
          method: "post",
          data: this.shippingAddressForm
        }).then(response => {
          if (response.data.success == true) {
            this.$toast.success("更新成功！");
            // this.$router.push({ path: "/user/ShippingAddressList" });
            this.$router.go(-1);
          }
        });
      } else {
        this.$http({
          url: "/frontend/addshippingaddress",
          method: "post",
          data: this.shippingAddressForm
        }).then(response => {
          if (response.data.success == true) {
            this.$toast.success("添加成功！");
            // this.$router.push({ path: "/user/ShippingAddressList" });
            this.$router.go(-1);
          }
        });
      }
    },
    showPopup() {
      this.show = true;
    },
    //value=0改变省，1改变市，2改变区
    onChange(picker, index, value) {
      let val = picker.getValues();
      console.log(val); //查看打印
      let areaName = "";
      for (var i = 0; i < val.length; i++) {
        areaName = areaName + (i == 0 ? "" : "/") + val[i].name;
      }
    },
    //确定选择城市
    onConfirm(val) {
      console.log(val[0].name + "," + val[1].name + "," + val[2].name);
      this.shippingAddressForm.areaValue = val[2].code;
      if (val[0].name != val[1].name) {
        this.shippingAddressForm.areaName =
          val[0].name + val[1].name + val[2].name;
      } else {
        this.shippingAddressForm.areaName = val[1].name + val[2].name;
      }
      this.show = false; //关闭弹框
    },
    //取消选中城市
    onCancel() {
      this.show = false;
      this.$refs.myArea.reset(); // 重置城市列表
    }
  }
};
</script>
<style lang="less" scoped >
.back-color {
  background-color: rgb(243, 244, 248);
  width: 100%;
  height: 100%;
  position: fixed;
}
.cell1 {
  margin-left: 10px;
  margin-right: 10px;
}
.cell2 {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
}
</style>