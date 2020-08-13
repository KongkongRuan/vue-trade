<template>
  <div>
    <!-- <el-input style="width:600px"
              placeholder="请输入模糊搜索内容"
              v-model="input"
              class="input-with-select">
      <el-select style="width:120px"
                 v-model="select"
                 slot="prepend"
                 placeholder="请选择">
        <el-option label="商品描述"
                   value="1"></el-option>
        <el-option label="卖家ID"
                   value="2"></el-option>
      </el-select>
      <el-button slot="append"
                 @click="criteriaQuery"
                 icon="el-icon-search"></el-button>
    </el-input>-->
    <el-table
      :data="bugList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      height="800"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column prop="bugInfo" label="Bug/建议内容" width="600"></el-table-column>
      <el-table-column prop="introducerId" label="提交人id" width="120"></el-table-column>
      <el-table-column prop="introducerPhone" label="提交人手机号" width="150"></el-table-column>
      <el-table-column prop="introducerQq" label="提交人qq号" width="150"></el-table-column>
      <el-table-column prop="state" label="bug状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state==0" type="infor">未处理</el-tag>
          <el-tag v-if="scope.row.state==1" type="success">已处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="informerId" label="举报人id" width="120"></el-table-column>

      <el-table-column prop="createTime" width="140" label="发起时间">
        <template slot-scope="scope">
          <!--通过作用域插槽的形式 调用时间过滤器-->
          {{Common.format(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column width="250" prop="state" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" v-if="scope.row.state==0" @click="update(scope.row.bugId)">处理</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :hide-on-single-page="true"
      page-size="13"
      layout="total,prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formPageinfor: {
        pageIndexStr: 1,
        pageSizeStr: 13,
        introducerId: -1,
        state: -1,
      },
      input: "",
      total: "",
      bugList: [],
      bug: {},
      loading: true,
      product: {},
    };
  },
  mounted() {
    if(!this.Common.checkAdmin(this)){
      this.$router.push({ path:'/superAdmin/AdminLogin'})
    }
      this.loding();
  },
  methods: {
    loding() {
      this.$http({
        url: "/bug/getBugList",
        method: "post",
        data: this.formPageinfor,
      }).then((response) => {
        if (response.data.success == true) {
          this.bugList = response.data.bugList;
          this.total = response.data.count;
        } else {
          this.$toast.fail(response.data.errMsg);
        }
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.formPageinfor.pageIndexStr = val;
      this.loding();
    },
    // criteriaQuery() {
    //   if (this.select == "商品描述") {
    //     this.formPageinfor.userId = -1;
    //     this.formPageinfor.productDesc = this.input;
    //   } else if (this.select == 2) {
    //     this.formPageinfor.productDesc = "";
    //     if (this.input == "") {
    //       this.formPageinfor.userId = -1;
    //     } else {
    //       this.formPageinfor.userId = this.input;
    //     }
    //   }

    //   this.loding();
    // },
    
    update(bugId) {
      this.bug.bugId = bugId;
      this.$http({
        url: "bug/updateBug",
        method: "post",
        data: this.bug,
      }).then((response) => {
        if (response.data.success == true) {
          //下架成功后更新举报状态

          this.$message({
            type: "success",
            message: "处理成功!",
          });

          this.loding();
        } else {
          this.$message({
            type: "error",
            message: response.data.errMsg,
          });
        }
      });
    },

  },
};
</script>