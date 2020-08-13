<template>
  <div>
    <div style="margin-bottom: 25px;">
      <el-tag effect="dark">当前通知为:</el-tag>
      <el-tag>{{notifyMessage}}</el-tag>
    </div>
    <div>
      <el-input
        type="textarea"
        v-model="newNotifyMessage"
        rows
        maxlength="90"
        autosize
        show-word-limit
        style="margin-bottom: 10px; width:550px"
        placeholder="请输入内容"
      ></el-input>
    </div>
    <div>
      <el-button type="primary" @click="submit">发布通知</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      notifyMessage: "",
      newNotifyMessage: "",
      notify: {notifyMessage:""},
    };
  },
  mounted() {
    if(!this.Common.checkAdmin(this)){
      this.$router.push({ path:'/superAdmin/AdminLogin'})
    }
    this.$http({
      url: "/notify/getNotify",
      method: "post",
    }).then((response) => {
      if (response.data.success == true) {
        this.notifyMessage = response.data.notifyMessage;
      }else{
        this.notifyMessage="空";
      }
    });
  },
  methods: {
    submit() {
      this.notify.notifyMessage=this.newNotifyMessage;
      this.$http({
        url: "/notify/updateNotify",
        method: "post",
        data: this.notify
      }).then((response) => {
        if (response.data.success == true) {
          this.$toast.success("修改成功！");
          if(this.newNotifyMessage==""){
            this.notifyMessage="空";
          }else{
            this.notifyMessage=this.notify.notifyMessage;
          }
        }else{
          this.$toast.fail(response.data.errMsg);
        }
      });
    },
  },
};
</script>
