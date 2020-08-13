<script>
export default {
    ServerBasePath:"http://localhost:8089",
    // ServerBasePath:"http://123.56.156.31:8089",
    //设置session过期时间为12小时
    expirse:12*3600*1000,
    // expirse:10000,
    //登陆状态校验
    checkLogin(parameter){
        var that = parameter;
        var expirse = this.expirse;
        // // var expirse = 10000;
        let createTime=JSON.parse(localStorage.getItem("createTime"));
        let user = JSON.parse(localStorage.getItem("currentUser"));
        if (user == null) {
            that.$toast.fail("请先登录");
        }else if(new Date().getTime()-createTime>expirse){
            if(createTime==null){
              that.$toast.fail("请先登录");
            }else{
              that.$toast.fail("登录已超时");
            }
            
        }else{
            return user;
        }
    },
    checkAdmin(parameter){
        var that = parameter;
        let user = JSON.parse(localStorage.getItem("currentUser"));
        if(user.userType!=3){
          that.$toast.fail("权限不足,请登录");
          return false;
        }
        return true;
    },
        //格式化时间
    format(s) {
      //将后台传过来的valueOf格式的时间改成yyyy/m/d的格式
      const date = new Date(s),
        y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate();
      return `${y}/${m < 10 ? "0" + m : m}/${d < 10 ? "0" + d : d}`;
    },
    //获取当前时间，格式为m-d
    format2() {
      const date = new Date(),
        m = date.getMonth() + 1,
        d = date.getDate();
      return `${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
    },
    //将传过来的valueOf格式的时间改成yyyy-m-d的格式
    format3(s) {
      const date = new Date(s),
      y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate();
      return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
    },
}

</script>