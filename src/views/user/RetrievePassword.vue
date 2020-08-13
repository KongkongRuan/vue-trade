<template>
  <div class="back-color">
    <van-nav-bar left-arrow title="找回密码" @click-left="onClickLeft" />
    <van-cell-group style="margin-left:10px;margin-right:10px">
      <van-field
        label="手机号"
        v-model="phoneNo"
        placeholder="请输入要找回的账号(即手机号)"
        style="margin-top:60px"
        type="digit"
        maxlength="11"
      ></van-field>
      <van-field label="新密码" right-icon="eye-o" @click-right-icon="clickIcon" :type="passFildType" maxlength="16" v-model="newPassword" placeholder="请输入新密码"></van-field>
      <van-field v-model="moblieCode" center clearable label="短信验证码" maxlength="4" placeholder="请输入短信验证码">
        <template #button>
          <van-button @click="showDialog" size="small" type="primary">发送验证码</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <van-button
      round
      style="width:50%;margin-left: 26%;margin-top: 40px;"
      color="linear-gradient(to top, #6149f6,#4bb0ff)"
      block
      @click="submit"
    >确认</van-button>
    <div>
      <van-dialog
        :before-close="onBeforeClose"
        :close-on-click-overlay="true"
        v-model="show"
        title="输入验证码"
        show-cancel-button
      >
        <van-row style="padding-top:20px;padding-bottom:20px">
          <van-col span="12">
            <el-input v-model="verifyCodeActual" placeholder="验证码" maxlength="4" style="z-index:2"></el-input>
          </van-col>
          <van-col span="12">
            <el-image style="height:40px" :src="this.kaptchaUrl" @click="refreshCode">
              <div slot="placeholder" class="image-slot">
                <i class="el-icon-loading"></i>
              </div>
            </el-image>
          </van-col>
        </van-row>
      </van-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      phoneNo: "",
      newPassword: "",
      moblieCode: "",
      show: false,
      codeDate: {},
      verifyCodeActual: "",
      btnOptFlag: false, //获取验证码按钮禁用标识
      codeBtnText: "获取验证码",
      outTime: 5, // 设置发送验证码倒计时时间
      timer: null,
      kaptchaUrl: this.Common.ServerBasePath + "/trade/Kaptcha",
      passFildType:"password"
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    showDialog() {
      if(this.phoneNo.length!=11||this.phoneNo.slice(0,1)!="1"){
        this.$toast.fail("请输入正确的手机号");
        return;
      }
      if(this.newPassword.length<6){
        this.$toast.fail("密码不能小于六位");
        return;
      }
      this.show = true;
    },
    clickIcon(){
      if(this.passFildType=="password"){
        this.passFildType="text"
      }else if(this.passFildType=="text"){
        this.passFildType="password"
      }
    },
    onBeforeClose(action, done) {
      if (action === "confirm") {
        var codeDate = new FormData();
        codeDate.append("verifyCodeActual", this.verifyCodeActual);
        codeDate.append("phoneNo", this.phoneNo);
        codeDate.append("codeType", "resetPwd");
        this.$http({
          url: "/localauth/sendMsgCod",
          method: "post",
          data: codeDate,
        }).then((response) => {
          if (response.data.success == true) {
            this.$toast.success("验证码发送成功！");
            this.refreshCode();
            if (this.btnOptFlag) return done();
            this.btnOptFlag = true; //禁用发送验证码按钮
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.codeBtnText = this.outTime + "s后重新发送";
                this.outTime = this.outTime - 1;
                if (this.outTime < 0) {
                  //倒计时结束，重置时间器
                  clearInterval(this.timer);
                  this.codeBtnText = "获取验证码";
                  this.outTime = 60;
                  this.timer = null;
                  this.btnOptFlag = false;
                }
              }, 1000); //每秒执行一次
            }
            return done();
          } else {
            this.$toast.fail(response.data.errMsg);
            this.refreshCode();
            this.verifyCodeActual = "";
             if(response.data.errMsg=="短信验证码功能关闭,静态验证码为1234"){
              this.moblieCode=1234;
              return done();
            }
            return done(false);
          }
        });
      } else {
        return done();
      }
    },
    submit() {
      this.$toast.loading({
        message: "修改中...",
        forbidClick: true,
      });
      var data = new FormData();
      data.append("phoneNo", this.phoneNo);
      data.append("newPassword", this.newPassword);
      data.append("moblieCode", this.moblieCode);
      this.$http({
        url: "/localauth/resetpassword",
        method: "post",
        data: data,
      }).then((response) => {
        if (response.data.success == true) {
          this.$toast.success("修改成功！");
          this.$router.push({ path: "/user/login" });
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
      
    },
    refreshCode() {
      this.kaptchaUrl =
        this.Common.ServerBasePath +
        "/trade/Kaptcha?" +
        Math.floor(Math.random() * 100);
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