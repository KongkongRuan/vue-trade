<template>
  <div class="login-container">
    <pointwave :color="0x097bdb" />
    <el-form ref="ruleForm2"
             :model="ruleForm2"
             :rules="ruleForm2"
             class="login-form"
             auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">Administrator Login</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username"
                  v-model="ruleForm2.username"
                  placeholder="Username"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input ref="password"
                  v-model="ruleForm2.password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  tabindex="2"
                  auto-complete="on" />
      </el-form-item>
      <el-checkbox v-model="checked"
                   class="remember">记住密码</el-checkbox>
      <el-button type="primary"
                 style="width:100%;"
                 @click="handleSubmit"
                 :loading="logining">登录</el-button>

    </el-form>
  </div>
</template>
<script>
import Pointwave from "@/components/Pointwave";
export default {
  components: {
    Pointwave
  },
  data() {
    return {
      logining: false,
      ruleForm2: {
        username: "",
        password: ""
      },
      rules2: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: false
    };
  },
  mounted() {
    this.Common.checkLogin(this);
    var remember = JSON.parse(localStorage.getItem("adminRemember"));
    this.ruleForm2.username = localStorage.getItem("adminUsername");
    if (remember) {
      this.checked = remember;
      this.ruleForm2.password = localStorage.getItem("adminPassword");
      this.checked = true;
    } else {
      this.checked = false;
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          this.logining = true;
          this.$http({
            url: "localauth/login",
            method: "post",
            data: this.ruleForm2
          }).then(response => {
            if (response.data.success == true && response.data.currentUser) {
              if (response.data.currentUser.userType == 3) {
                localStorage.setItem("adminUsername", this.ruleForm2.username);
                if (this.checked) {
                  localStorage.setItem("adminRemember", this.checked);
                  localStorage.setItem(
                    "adminPassword",
                    this.ruleForm2.password
                  );
                } else {
                  localStorage.setItem("adminRemember", this.checked);
                  localStorage.setItem("adminPassword", null);
                }
                localStorage.setItem(
                  "currentUser",
                  JSON.stringify(response.data.currentUser)
                );
                localStorage.setItem("username", this.ruleForm2.username);
                localStorage.setItem("createTime", new Date().getTime());
                console.log(JSON.parse(localStorage.getItem("createTime")));
                this.logining = false;
                this.$toast.success("登陆成功！");
                this.$router.push({
                  path: "/superAdmin/ManagementIndex/DataStatistics"
                });
              } else {
                this.logining = false;
                this.$alert("请使用管理员账号登陆！", "info", {
                  confirmButtonText: "ok"
                });
              }
            } else {
              this.logining = false;
              this.$alert(response.data.errMsg, "info", {
                confirmButtonText: "ok"
              });
              //   this.$toast.fail(response.data.errMsg);
            }
          });
          //   if (
          //     this.ruleForm2.username === "admin" &&
          //     this.ruleForm2.password === "123456"
          //   ) {
          //     this.logining = false;
          //     sessionStorage.setItem("user", this.ruleForm2.username);
          //     this.$router.push({ path: "/" });
          //   } else {
          //     this.logining = false;
          //     this.$alert("username or password wrong!", "info", {
          //       confirmButtonText: "ok"
          //     });
          //   }
        } else {
          console.log("error submit!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  /* background: url("../../assets/backimg.png") center center no-repeat;
   */
  background: url("../../assets/AdminLoginBackground.png") center center
    no-repeat;
  position: fixed;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 10px;
  margin: 280px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.remember {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #15255b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 140px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
#indexLizi {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  overflow: hidden;
}
</style>