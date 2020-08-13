<template>
  <div class="back-color">
    <van-nav-bar left-arrow title="编辑个人资料" @click-left="onClickLeft">
      <van-button round plain hairline type="info" size="small" slot="right" @click="submit">确定</van-button>
    </van-nav-bar>

    <van-cell-group style="margin-left:10px;margin-right:10px">
      <van-field label="昵称" v-model="user.name" placeholder="请输入昵称" style="margin-top:60px"></van-field>
      <van-field label="QQ" type="number" placeholder="QQ方便买家联系您" v-model="user.qq"></van-field>
    </van-cell-group>

    <van-cell-group style="margin-left:10px;margin-right:10px">
      <van-cell
        is-link
        readonly
        clickable
        name="picker"
        :value="user.sex"
        title="性别"
        style="margin-top:10px"
        @click="sexShowPicker = true"
      />
      <van-popup v-model="sexShowPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="sexColumns"
          @confirm="onConfirmSex"
          @cancel="sexShowPicker = false"
        />
      </van-popup>
      <van-cell
        :value="schoolName"
        title="我的学校"
        @click="areaSexShowPicker=true"
        is-link
        readonly
      />
      <van-popup v-model="areaSexShowPicker" position="bottom" :style="{ height: '30%' }">
        <!-- <van-area ref="myArea"
                  :value="user.areaValue"
                  :area-list="areaList"
                  @confirm="onConfirm"
                  @change="onChange"
        @cancel="onCancel" />-->
        <van-picker
          title="学校"
          show-toolbar
          :columns= schoolNameList
          :default-index=user.schoolId-1
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
    </van-cell-group>
  </div>
</template>
<script>
import areaList from "../../assets/js/area.js";
export default {
  data() {
    return {
      user: {},
      sexColumns: ["男", "女"],
      sexShowPicker: false,
      areaSexShowPicker: false,
      digit: "",
      areaList,
      schoolNameList:[],
      schoolName:""
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    //获取学校列表
    this.$http({
      url: "/school/getSchoolList",
      method: "post",
    }).then((response) => { 
      if (response.data.success == true) {
        for (let i = 0; i < response.data.schoolList.length; i++) {
                this.schoolNameList.push(response.data.schoolList[i].schoolName);
              }
              this.schoolName=this.schoolNameList[this.user.schoolId-1]
      } else {
        this.$toast.fail(response.data.errMsg);
      }
    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onConfirmSex(sex) {
      this.user.sex = sex;
      this.sexShowPicker = false;
    },
    // //value=0改变省，1改变市，2改变区
    // onChange(picker, index, value) {
    //   let val = picker.getValues();
    //   console.log(val); //查看打印
    //   let areaName = "";
    //   for (var i = 0; i < val.length; i++) {
    //     areaName = areaName + (i == 0 ? "" : "/") + val[i].name;
    //   }
    // },
    // //确定选择城市
    // onConfirm(val) {
    //   console.log(val[0].name + "," + val[1].name + "," + val[2].name);
    //   this.user.areaValue = val[2].code;
    //   if (val[0].name != val[1].name) {
    //     this.user.shipAddress =
    //       val[0].name + val[1].name + val[2].name;
    //   } else {
    //     this.user.shipAddress = val[1].name + val[2].name;
    //   }
    //   this.areaSexShowPicker = false; //关闭弹框
    // },
    // //取消选中城市
    // onCancel() {
    //   this.areaSexShowPicker = false;
    //   this.$refs.myArea.reset(); // 重置城市列表
    // },
    //取消
    onCancel() {
      this.areaSexShowPicker = false;
    },
    //确认
    onConfirm(value, index) {
      this.schoolName = value;
      this.user.schoolId = index+1;
      this.areaSexShowPicker = false; //关闭弹框
    },
    submit() {
      this.$toast.loading({
        message: "修改中...",
        forbidClick: true,
      });
      if (this.user.name != "" && this.user.qq != "") {
        this.$http({
          url: "/user/modifyuser",
          method: "post",
          data: this.user,
        }).then((response) => {
          if (response.data.success == true) {
            localStorage.setItem("currentUser", JSON.stringify(this.user));
            this.$toast.success("修改成功！");
            this.$router.push({ path: "/user/UserPage" });
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
      } else {
        this.$toast.fail("昵称或者QQ不能为空");
        return;
      }
    },
  },
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
</style>