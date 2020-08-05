<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar left-arrow
                 title="注册"
                 @click-left="onClickLeft" />
    <div class="register_form">
      <el-form :model="registerForm"
               :rules="rules"
               ref="registerFormRef"
               label-width="120px"
               size="medium">
        <el-form-item label="昵称"
                      prop="name">
          <el-input v-model="registerForm.name"
                    placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="QQ"
                      prop="qq">
          <el-input v-model="registerForm.qq"
                    placeholder="用于找回密码"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="registerForm.sex"
                     placeholder="性别">
            <el-option label="男"
                       value="男"></el-option>
            <el-option label="女"
                       value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号"
                      prop="username">
          <el-input v-model="registerForm.username"
                    placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="registerForm.password"
                    type="password"
                    placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="确认密码"
                      prop="checkPass">
          <el-input v-model="registerForm.checkPass"
                    type="password"
                    placeholder="请再次输入密码"></el-input>
        </el-form-item>

        <el-form-item label="验证码">
          <van-col span="12">
            <el-input v-model="registerForm.verifyCodeActual"
                      placeholder="验证码"
                      style="z-index:2"></el-input>
          </van-col>

          <el-form-item>
            <van-col span="12">
              <el-image :src="this.registerForm.kaptchaUrl"
                        @click="refreshCode">
                <div slot="placeholder"
                     class="image-slot">
                  <i class="el-icon-loading"></i>
                </div>
              </el-image>
            </van-col>
          </el-form-item>

        </el-form-item>

      </el-form>
      <van-button round
                  style="width:80%;margin-left: 23%;margin-top: 40px;"
                  color="linear-gradient(to right, #4bb0ff, #6149f6)"
                  block
                  @click="register">立即注册</van-button>
      <!-- <van-button class="register_btn" round size="large" type="info" @click="register">立即注册</van-button> -->
      <el-link type="info"
               href="/user/Login"
               class="login_btn">登录</el-link>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        name: "",
        qq: "",
        sex: "",
        username: "",
        password: "",
        checkPass: "",
        verifyCodeActual: "",
        kaptchaUrl: this.Common.ServerBasePath + "/trade/Kaptcha"
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        qq: [{ required: true, message: "请输入QQ", trigger: "blur" }],
        kaptcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    register() {
      this.$toast.loading({
        message: "注册中...",
        forbidClick: true
      });
      this.$refs.registerFormRef.validate(valid => {
        if (!valid) {
          this.$toast.fail("请按照规范填写信息");
          return;
        }
        this.$http({
          url: "localauth/register",
          method: "post",
          data: this.registerForm
        }).then(response => {
          if (response.data.success == true) {
            this.$toast.success("注册成功！");
            sessionStorage.setItem("isFromReg", true);
            // 跳转
            this.$router.push({
              path: "/user/login"
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
    }
  }
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