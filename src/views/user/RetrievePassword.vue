<template>
  <div class="back-color">
    <van-nav-bar left-arrow
                 title="找回密码"
                 @click-left="onClickLeft" />
    <van-cell-group style="margin-left:10px;margin-right:10px">
      <van-field label="账号"
                 v-model="username"
                 placeholder="请输入要找回的账号"
                 style="margin-top:60px">

      </van-field>
      <van-field label="QQ"
                 type="number"
                 v-model="qq"
                 placeholder="请输入注册时填写的QQ">
      </van-field>
      <van-field label="新密码"
                 type="password"
                 v-model="newPassword"
                 placeholder="请输入新密码">
      </van-field>
      <van-field label="确认密码"
                 type="password"
                 v-model="repNewPassword"
                 placeholder="请再次输入新密码">
      </van-field>
    </van-cell-group>
    <van-button round
                style="width:50%;margin-left: 26%;margin-top: 40px;"
                color="linear-gradient(to top, #6149f6,#4bb0ff)"
                block
                @click="submit">确认</van-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      qq: "",
      newPassword: "",
      repNewPassword: ""
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    submit() {
      if(this.newPassword.length<6||this.newPassword.length>16){
          this.$toast.fail("密码长度不能小于3位大于16位");
          return;
      }
      this.$toast.loading({
        message: "修改中...",
        forbidClick: true
      });
      var data = new FormData();
      data.append("username", this.username);
      data.append("qq", this.qq);
      data.append("newPassword", this.newPassword);
      data.append("repNewPassword", this.repNewPassword);
      this.$http({
        url: "/localauth/resetpassword",
        method: "post",
        data: data
      }).then(response => {
        if (response.data.success == true) {
          this.$toast.success("修改成功！");
          this.$router.push({ path: "/user/login" });
        }else{
            this.$toast.fail(response.data.errMsg);
        }
      });
    }
  }
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