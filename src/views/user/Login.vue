<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar left-arrow
                 title="登录"
                 @click-left="onClickLeft" />
    <div class="avatar_box">
      <img src="../../assets/logo.png" />
    </div>
    <div class="login_form">
      <el-form :model="loginForm"
               :rules="rules"
               ref="loginFormRef"
               label-width="120px"
               class="demo-ruleForm"
               size="medium">
        <el-form-item label="账号"
                      prop="username">
          <el-input v-model="loginForm.username"
                    clearable
                    placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="loginForm.password"
                    show-password
                    clearable
                    type="password"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <van-button round
                  style="width:80%;margin-left: 26%;margin-top: 40px;"
                  color="linear-gradient(to right, #4bb0ff, #6149f6)"
                  block
                  @click="login">登录</van-button>
      <el-link type="info"
               href="/user/Register"
               class="register_btn">注册</el-link>
      <el-link type="info"
               href="/user/RetrievePassword"
               class="retrieve_password_btn">找回密码</el-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    if (sessionStorage.getItem("isFromReg")=="true") {
      console.log("true");
      sessionStorage.setItem("isFromReg", false);
      console.log(sessionStorage.getItem("isFromReg"));
    } else {
      console.log("false");
      this.Common.checkLogin(this);
    }

  },
  methods: {
    onClickLeft() {
      this.$router.push({ path: "/" });
    },
    login() {
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true
      });
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          this.$toast.fail("请按照规范填写信息");
          return;
        }
        this.$http({
          url: "localauth/login",
          method: "post",
          data: this.loginForm
        }).then(response => {
          if (response.data.success == true && response.data.currentUser) {
            localStorage.setItem(
              "currentUser",
              JSON.stringify(response.data.currentUser)
            );
            localStorage.setItem("username", this.loginForm.username);
            localStorage.setItem("createTime", new Date().getTime());
            console.log(JSON.parse(localStorage.getItem("createTime")));

            this.$toast.success("登陆成功！");
            this.$router.push({ path: "/" });
          } else {
            this.$toast.fail(response.data.errMsg);
          }
        });
      });
    }
  }
};
</script>

<style scoped lang="less">
.login_form {
  padding-top: 40%;
  position: absolute;
  margin-right: 80px;
}
.avatar_box {
  height: 80px;
  width: 80px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  // transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_btn {
  left: 13%;
}
.register_btn {
  left: 95%;
  top: 25px;
  font-size: 17px;
}
.retrieve_password_btn {
  left: 15%;
  top: 25px;
  font-size: 12px;
}
</style>