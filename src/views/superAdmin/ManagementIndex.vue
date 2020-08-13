<template>
  <div class="app">
    <el-container>
      <el-aside class="app-side app-side-left"
                :class="isCollapse ? 'app-side-collapsed' : 'app-side-expanded'">
        <div class="app-side-logo">
          <!-- <img src="@/assets/logo.png"
               :width="isCollapse ? '60' : '60'"
               height="60" /> -->
          <cube style=""/>
        </div>
        
        <div>
          <!-- 我是样例菜单 -->
          <el-menu :default-active="$route.path"
                   router
                   class="el-menu-vertical-demo"
                   background-color="rgb(48,65,86)"
                   text-color="rgb(191,203,217)"
                   active-text-color="#ffd04b"
                   @open="handleOpen"
                   :collapse="isCollapse">
            <template v-for="route in $router.options.routes">
              <template v-for="item in route.children">
                <el-menu-item :key="item.path"
                              @click="clickMenuItem(item.name,$route.path)"
                              :index="route.path + '/' + item.path">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{ item.name }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </div>
      </el-aside>

      <el-container>
        <el-header class="app-header">
          <div style="width: 60px; cursor: pointer;font-size:27px;color:rgb(191,203,217)"
               @click.prevent="toggleSideBar">
            <i v-show="!isCollapse"
               class="el-icon-menu"></i>
            <i v-show="isCollapse"
               class="el-icon-s-grid"></i>
          </div>
          <!-- 我是样例菜单 -->
          <el-menu default-active="1"
                   class="el-menu-demo tab-page"
                   background-color="rgb(48,65,86)"
                   text-color="rgb(191,203,217)"
                   active-text-color="#ffd04b"
                   mode="horizontal"
                   @select="handleSelect">
          </el-menu>

          <div class="app-header-userinfo">
            
            <el-dropdown trigger="hover"
                         :hide-on-click="false">
              
              <span class="el-dropdown-link">
                {{ username }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided
                                  @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-header style="padding:4px">
          <el-tag :key="tag.name"
                  class="tag"
                  type="info"
                  :color="tag.color"
                  style="color:rgb(144,153,174);cursor:pointer"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @click="selectedTag(tag.name)"
                  @close="closeTag(tag)">
            {{tag.name}}
          </el-tag>
        </el-header>

        <el-main class="app-body"
                 :class="isCollapse ? 'app-body-collapsed' : 'app-body-expanded'">
          <template>
            <transition name="fade-transform"
                        mode="out-in">
              <router-view />
            </transition>
          </template>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
import Cube from "@/components/Cube";
export default {
  components: {
    Cube
  },
  name: "Container",
  data() {
    return {
      username: "",
      isCollapse: false,
      dynamicTags: [
        {
          name: "数据统计",
          path: "/superAdmin/ManagementIndex/DataStatistics",
          color: "rgb(48,65,86)"
        }
      ],
      tagsPath: []
    };
  },
  mounted() {
    if(!this.Common.checkAdmin(this)){
      this.$router.push({ path:'/superAdmin/AdminLogin'})
    }
  },
  methods: {
    toggleSideBar() {
      this.isCollapse = !this.isCollapse;
    },
    logout: function() {
      this.$confirm("确认退出?", "提示", {})
        .then(() => {
          localStorage.removeItem("currentUser");
          this.$router.push("/superAdmin/AdminLogin");
        })
        .catch(() => {});
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      console.log("!!!!!!!!");
    },
    //点击左侧边栏选项
    clickMenuItem(name, path) {
      var index = this.findTag(name);
      this.cleanTags();
      if (index == -1) {
        var tag = {};
        tag.name = name;
        tag.path = path;
        tag.color = "rgb(48,65,86)";
        this.dynamicTags.push(tag);
      } else {
        this.dynamicTags[index].color = "rgb(48,65,86)";
      }
    },
    //关闭某个标签
    /**
     * 首先判断是否为最后一个标签
     * 如果为最后一个标签则令关闭函数失效
     * 由于移除标签后下标会发生变化所以
     * 首先保存要关闭标签的path
     * 移除该标签
     * 如果关闭的标签地址等于当前地址
     * 就选中数组中最后一个标签
     * 页面跳转使用选中标签内的跳转函数
     */
    closeTag(tag) {
      if (this.dynamicTags.length != 1) {
        var index = this.findTag(tag.name);
        var path = this.dynamicTags[index].path;
        console.log(this.dynamicTags[index].name);
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        if (this.$route.path == path) {
          this.selectedTag(this.dynamicTags[this.dynamicTags.length - 1].name);
        }
      }
    },
    //选中某个标签
    selectedTag(tag) {
      var index = this.findTag(tag);
      this.cleanTags();
      this.dynamicTags[index].color = "rgb(48,65,86)";
      this.$router.push({
        path: this.dynamicTags[index].path
      });
    },
    //清除所有标签的选中状态
    cleanTags() {
      for (var i = 0; i < this.dynamicTags.length; i++) {
        this.dynamicTags[i].color = "rgb(192,196,204)";
      }
    },
    //根据标签名查找到该标签的下标
    findTag(tag) {
      for (var i = 0; i < this.dynamicTags.length; i++) {
        if (this.dynamicTags[i].name == tag) {
          return i;
        }
      }
      return -1;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  mounted: function() {
    let username = localStorage.getItem("username");
    if (username) {
      this.username = username;
    }
  }
};
</script>

<style>
.el-menu :hover {
  background-color: rgb(38, 52, 69) !important;
  /**不能使用block，
  使用block后鼠标经过文字或者图标时由于block会导致换行
  所以文字和图标会出现闪动的情况，
  极其影响用户体验 */
  /* display: block; */
  display: inline-block;
}
/**想要改变element-ui原始样式
    必须在后面添加 !important*/
.el-menu {
  border-right-width: 0px !important;
}
.el-menu-item {
  width: 100%;
}
.tag {
  margin-left: 5px;
  margin-top: 9px;
}
</style>