<template>
  <div>
    <el-input style="width:600px"
              placeholder="请输入模糊搜索内容"
              v-model="input"
              class="input-with-select">
      <el-select style="width:120px"
                 v-model="select"
                 slot="prepend"
                 placeholder="请选择">
        <el-option label="用户名"
                   value="1"></el-option>
      </el-select>
      <el-button slot="append"
                 @click="criteriaQuery"
                 icon="el-icon-search"></el-button>
    </el-input>
    <el-table v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :data="userList"
              height="800"
              border
              stripe
              style="width: 100%">
      <el-table-column prop="userId"
                       label="Id"
                       width="80">
      </el-table-column>
      <el-table-column prop="name"
                       label="用户名"
                       width="250">
      </el-table-column>
      <el-table-column prop="userType"
                       label="权限"
                       width="250">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userType==3">管理员</el-tag>
          <el-tag type="success"
                  v-if="scope.row.userType==2">普通用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="qq"
                       label="QQ"
                       width="240">
      </el-table-column>
      <el-table-column prop="shipAddress"
                       label="默认发货地址"
                       width="280">
      </el-table-column>

      <el-table-column prop="enableStatus"
                       label="帐号状态"
                       width="200">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enableStatus==1"
                  type="success">正常</el-tag>
          <el-tag v-if="scope.row.enableStatus==-1"
                  type="danger">封禁</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="200"
                       prop="enableStatus"
                       label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary"
                       @click="banned(scope.row.userId)"
                       v-if="scope.row.enableStatus!=-1&&scope.row.userType!=3">封停</el-button>
            <el-button type="primary"
                       @click="deblocking(scope.row.userId)"
                       v-if="scope.row.enableStatus==-1">解封</el-button>
            <!-- <el-button type="danger"
                       @click="deleteUser(scope.row.userId)"
                       icon="el-icon-delete"></el-button> -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
                   @current-change="handleCurrentChange"
                   :hide-on-single-page="true"
                   page-size="13"
                   layout="total,prev, pager, next"
                   :total="total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formPageinfor: {
        pageIndexStr: 1,
        pageSizeStr: 13,
        name: ""
      },
      input: "",
      total: "",
      userList: [],
      select: "用户名",
      user: {},
      loading:true
    };
  },
  mounted() {
    this.loding();
  },
  methods: {
    loding() {
      this.$http({
        url: "superadminuser/listusers",
        method: "post",
        data: this.formPageinfor
      }).then(response => {
        if (response.data.success == true) {
          this.userList = response.data.userList;
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
    criteriaQuery() {
      this.formPageinfor.name = this.input;
      this.loding();
    },

    banned(userId) {
      this.$confirm("封禁后用户将无法登录，是否封禁?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.user.userId = userId;
          this.user.enableStatus = -1;
          this.$http({
            url: "superadminuser/updateUserState",
            method: "post",
            data: this.user
          }).then(response => {
            if (response.data.success == true) {
              this.$message({
                type: "success",
                message: "封禁成功!"
              });
              this.loding();
            } else {
              this.$message({
                type: "error",
                message: response.data.errMsg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    deblocking(userId) {
      this.$confirm("是否确认解封?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.user.userId = userId;
          this.user.enableStatus = 1;
          this.$http({
            url: "superadminuser/updateUserState",
            method: "post",
            data: this.user
          }).then(response => {
            if (response.data.success == true) {
              this.$message({
                type: "success",
                message: "解封成功!"
              });
              this.loding();
            } else {
              this.$message({
                type: "error",
                message: response.data.errMsg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    deleteProduct(productId) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.product.productId = productId;
          this.$http({
            url: "superadmin/deleteProduct",
            method: "post",
            data: this.product
          }).then(response => {
            if (response.data.success == true) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loding();
            } else {
              this.$message({
                type: "error",
                message: response.data.errMsg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  }
};
</script>