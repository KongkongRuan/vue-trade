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
        <el-option label="商品描述"
                   value="1"></el-option>
        <el-option label="卖家ID"
                   value="2"></el-option>
      </el-select>
      <el-button slot="append"
                 @click="criteriaQuery"
                 icon="el-icon-search"></el-button>
    </el-input>
    <el-table :data="productList"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              height="800"
              border
              stripe
              style="width: 100%">
      <el-table-column prop="productDesc"
                       label="商品名称"
                       width="660">
      </el-table-column>
      <el-table-column prop="price"
                       label="商品价格（元）"
                       width="140">
      </el-table-column>
      <el-table-column prop="productCategory"
                       label="分类"
                       width="120">
      </el-table-column>
      <el-table-column prop="enableStatus"
                       label="商品状态"
                       width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enableStatus==1"
                  type="success">正常</el-tag>
          <el-tag v-if="scope.row.enableStatus==2"
                  type="infor">交易成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="enableStatus"
                       label="管理状态"
                       width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.manageEnableStatus==-1"
                  type="danger">管理员下架</el-tag>
          <el-tag v-if="scope.row.manageEnableStatus==1"
                  type="danger">主动下架</el-tag>
          <el-tag v-if="scope.row.manageEnableStatus==0"
                  type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime"
                       width="140"
                       label="创建时间">
        <template slot-scope="scope">
          <!--通过作用域插槽的形式 调用时间过滤器-->
          {{Common.format(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="userId"
                       label="卖家ID"
                       width="100">
      </el-table-column>
      <el-table-column width="200"
                       prop="enableStatus"
                       label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary"
                       @click="soldOut(scope.row.productId)"
                       v-if="scope.row.manageEnableStatus!=-1">下架</el-button>
            <el-button type="primary"
                       @click="putaway(scope.row.productId)"
                       v-if="scope.row.manageEnableStatus==-1">上架</el-button>
            <el-button type="danger"
                       @click="deleteProduct(scope.row.productId)"
                       icon="el-icon-delete"></el-button>
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
        productDesc: "",
        productCategory: "",
        userId: -1
      },
      input: "",
      total: "",
      productList: [],
      select: "商品描述",
      product: {},
      loading: true
    };
  },
  mounted() {
    this.loding();
  },
  methods: {
    loding() {
      this.$http({
        url: "superadminproduct/listproducts",
        method: "post",
        data: this.formPageinfor
      }).then(response => {
        if (response.data.success == true) {
          this.productList = response.data.productList;
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
      if (this.select == "商品描述") {
        this.formPageinfor.userId = -1;
        this.formPageinfor.productDesc = this.input;
      } else if (this.select == 2) {
        this.formPageinfor.productDesc = "";
        if (this.input == "") {
          this.formPageinfor.userId = -1;
        } else {
          this.formPageinfor.userId = this.input;
        }
      }

      this.loding();
    },
    soldOut(productId) {
      this.$confirm("下架商品后将不会在前端展示页面显示, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.product.productId = productId;
          this.product.manageEnableStatus = -1;
          this.$http({
            url: "superadminproduct/updateProductManageEnableStatus",
            method: "post",
            data: this.product
          }).then(response => {
            if (response.data.success == true) {
              this.$message({
                type: "success",
                message: "下架成功!"
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
    putaway(productId) {
      this.$confirm("是否确认上架商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.product.productId = productId;
          this.product.manageEnableStatus = 0;
          this.$http({
            url: "superadminproduct/updateProductManageEnableStatus",
            method: "post",
            data: this.product
          }).then(response => {
            if (response.data.success == true) {
              this.$message({
                type: "success",
                message: "上架成功!"
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
            url: "superadminproduct/deleteProduct",
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