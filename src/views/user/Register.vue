<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar left-arrow title="注册" @click-left="onClickLeft" />
    <div class="register_form">
      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerFormRef"
        label-width="120px"
        size="medium"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="registerForm.name" clearable placeholder="请输入昵称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="QQ"
                      prop="qq">
          <el-input v-model="registerForm.qq"
                    placeholder="用于找回密码"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="性别">
          <el-select v-model="registerForm.sex"
                     placeholder="性别">
            <el-option label="男"
                       value="男"></el-option>
            <el-option label="女"
                       value="女"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="手机号" prop="phoneNo">
          <el-input v-model="registerForm.phoneNo" maxlength="11" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            show-password
            clearable
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item label="验证码">
          <van-col span="12">
            <el-input
              v-model="registerForm.moblieCode"
              placeholder="验证码"
              maxlength="4"
              style="z-index:2"
            ></el-input>
          </van-col>

          <el-form-item>
            <van-col span="12">
              <el-button @click="showDialog" type="primary" :disabled="btnOptFlag">{{codeBtnText}}</el-button>
            </van-col>
          </el-form-item>
        </el-form-item>
      </el-form>
      <van-button
        round
        style="width:80%;margin-left: 23%;margin-top: 40px;"
        color="linear-gradient(to right, #4bb0ff, #6149f6)"
        block
        @click="register"
      >立即注册</van-button>
      <!-- <van-button class="register_btn" round size="large" type="info" @click="register">立即注册</van-button> -->
      <el-link type="info" href="/user/Login" class="login_btn">登录</el-link>
    </div>
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
          <el-image style="height:40px" :src="this.registerForm.kaptchaUrl" @click="refreshCode">
            <div slot="placeholder" class="image-slot">
              <i class="el-icon-loading"></i>
            </div>
          </el-image>
        </van-col>
      </van-row>
    </van-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkphone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value == "") {
        callback(new Error("请输入手机号"));
      } else if (!this.isCellPhone(value)) {
        //引入methods中封装的检查手机格式的方法
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        name: "",
        phoneNo: "",
        password: "",
        kaptchaUrl: this.Common.ServerBasePath + "/trade/Kaptcha",
        moblieCode: "",
      },
      rules: {
        phoneNo: [{ required: true, validator: checkphone, trigger: "blur" }], //validator: checkphone是验证手机的引入checkphone函数
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
      },
      show: false,
      codeDate: {},
      verifyCodeActual: "",
      btnOptFlag: false, //获取验证码按钮禁用标识
      codeBtnText: "获取验证码",
      outTime: 60, // 设置发送验证码倒计时时间
      timer: null,
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    showDialog() {
      this.$refs.registerFormRef.validate((valid) => {
        if (!valid) {
          this.$toast.fail("请按照规范填写信息");
          return;
        } else {
          this.show = true;
        }
      });
    },
    onBeforeClose(action, done) {
      if (action === "confirm") {
        var codeDate = new FormData();
        codeDate.append("verifyCodeActual", this.verifyCodeActual);
        codeDate.append("phoneNo", this.registerForm.phoneNo);
        codeDate.append("codeType", "register");
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
              this.registerForm.moblieCode=1234;
              return done();
            }
            return done(false);
          }
        });
      } else {
        return done();
      }
    },
    register() {
      this.$toast.loading({
        message: "注册中...",
        forbidClick: true,
      });
      this.$refs.registerFormRef.validate((valid) => {
        if (!valid) {
          this.$toast.fail("请按照规范填写信息");
          return;
        }
        this.$http({
          url: "localauth/register",
          method: "post",
          data: this.registerForm,
        }).then((response) => {
          if (response.data.success == true) {
            this.$toast.success("注册成功！");
            sessionStorage.setItem("isFromReg", true);
            // 跳转
            this.$router.push({
              path: "/user/login",
            });
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
      });
    },
    refreshCode() {
      this.registerForm.kaptchaUrl =
        this.Common.ServerBasePath +
        "/trade/Kaptcha?" +
        Math.floor(Math.random() * 100);
    },
  },
};
</script>

<style scoped lang="less">
.register_form {
  padding-top: 15%;
  position: absolute;
  margin-right: 70px;
}
.register_btn {
  left: 13%;
}
.login_btn {
  left: 95%;
  top: 25px;
  font-size: 17px;
}
</style>