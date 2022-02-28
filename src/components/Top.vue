<template>
  <div class="top-container">
    <!-- 左部区域 -->
    <div class="left d-flex">
      <span class="title">cloud-music</span>
      <div class="control-go">
        <!-- 返回上一页 -->
        <el-button
          type="info"
          size="small"
          class="clear-icon el-icon-arrow-left"
          @click="go(-1)"
          circle
        ></el-button>
        <!-- 前往下一页 -->
        <el-button
          type="info"
          size="small"
          class="clear-icon el-icon-arrow-right"
          @click="go(1)"
          circle
        ></el-button>
      </div>
    </div>

    <!-- 中部区域 -->
    <div class="center">
      <!-- 带输入建议的输入框 -->
      <el-autocomplete
        class="inline-input"
        v-model="inputValue"
        :placeholder="placeholder"
        :fetch-suggestions="getSearchAsync"
        @keyup.native.enter="search"
        @select="handleSelect"
        prefix-icon="el-icon-search"
        clearable
        size="small"
      ></el-autocomplete>
    </div>

    <!-- 右部区域 -->
    <div class="right">
      <div class="login" @click="login" v-if="isAvatar">登录</div>
      <div class="avatar" v-else @mouseover="showUserInfo">
        <img v-lazy="avatarUrl" />
        <span>{{ nickname }}</span>

        <!-- 用户信息 -->
        <keep-alive>
          <user-info>
            <template #level>
              我的等级是：
              <span class="infoFont">{{ userInfoObj.level }}级</span>
            </template>
            <template #listenSongs>
              已听歌曲数量：
              <span class="infoFont">{{ userInfoObj.listenSongs }}首</span>
            </template>
            <template #createDays>
              使用天数：
              <span class="infoFont">{{ userInfoObj.createDays }}天</span>
            </template>
          </user-info>
        </keep-alive>
      </div>
      <el-button type="primary" size="mini" @click="quit" v-show="isButton">退出</el-button>

      <el-switch class="switch" v-model="navState" @change="changeNavState"></el-switch>
      <span class="switch-span">侧边栏</span>
      <el-switch class="switch" v-model="state" @change="changeState"></el-switch>
      <span>进度条</span>
    </div>

    <!-- 登录框 -->
    <login-dialog
      v-show="isShow"
      ref="loginRef"
      :ctrIsShow="isShow"
      @ctrClose="ctrClosed"
      @ctrLoginBtn="ctrLogin"
    ></login-dialog>
  </div>
</template>

<script>
import LoginDialog from "./Login.vue";
import UserInfo from "./UserInfo.vue";
export default {
  name: "Top",
  data() {
    return {
      // 是否显示登录框
      isShow: false,
      // 是否显示登录
      isAvatar: true,
      // 退出按钮隐藏与显示
      isButton: false,
      // 用户头像
      avatarUrl: "",
      // 用户名称
      nickname: "",
      // 用户详情
      userInfoObj: {
        level: 0,
        listenSongs: null,
        createDays: null
      },
      // 输入提示
      placeholder: "",
      // 输入的内容
      inputValue: "",
      // 热搜列表
      searchHot: [],
      // 热搜推荐列表
      searchHotList: [],
      // 用于标识是系统请求，还是用户请求
      auth: "",
      // 暂存搜索关键字
      searchKeywords: "",
      // 开关状态  是否显示音乐面板
      state: true,
      // 是否显示导航栏 nav
      navState: true
    };
  },
  components: {
    LoginDialog,
    UserInfo
  },
  created() {
    this.fetchDefaultKeywords();
    this.isLogin();
  },
  methods: {
    // 前进/后退
    go(index) {
      window.history.go(index);
    },
    // 改变开关状态，传递状态到外部组件Index
    changeNavState() {
      this.$Bus.$emit("changeNavState", this.navState);
      // console.log('1')
    },
    changeState() {
      this.$Bus.$emit("changeState", this.state);
      // console.log('2')
    },
    // 点击登录按钮显示登录框
    login() {
      this.isShow = true;
    },
    // 判断用户是否登录
    isLogin() {
      console.log(this.$store.state.profile);
      if (
        this.$store.state.profile.avatarUrl == "" &&
        this.$store.state.profile.nickname == "" &&
        this.$store.state.profile.userId == ""
      ) {
        // 未登录状态
        this.isAvatar = true;
        this.isButton = false;
        this.avatarUrl = "";
        this.nickname = "";
      } else {
        // 已登录状态
        this.isAvatar = false;
        this.isButton = true;
        this.avatarUrl = this.$store.state.profile.avatarUrl;
        this.nickname = this.$store.state.profile.nickname;
      }
      console.log(window.sessionStorage);
    },
    // 登录框叉号信息
    ctrClosed() {
      this.isShow = false;
      this.isAvatar = true;
      this.isButton = false;
    },
    // 登录框 登录事件
    ctrLogin() {
      this.isAvatar = false;
      this.isButton = true;
      this.avatarUrl = this.$store.state.profile.avatarUrl;
      this.nickname = this.$store.state.profile.nickname;
    },
    // 鼠标经过展示用户信息
    async showUserInfo() {
      if (this.userInfoObj.level == 0) {
        const res = await this.$http.get(`/user/detail`, {
          params: {
            uid: this.$store.state.profile.userId
          }
        });
        // console.log(res);
        this.userInfoObj.level = res.data.level;
        this.userInfoObj.listenSongs = res.data.listenSongs;
        this.userInfoObj.createDays = res.data.createDays;
        // console.log(this.userInfoObj);
      }
    },
    // 退出登录
    async quit() {
      const res = await this.$http.get("/logout");
      // console.log(res);
      if (res.data.code == 200) {
        this.$message.info("已退出登录");
        this.isAvatar = true;
        this.isButton = false;
        window.sessionStorage.removeItem("profile");
      }
    },
    // 获取默认搜索提示和关键字
    async fetchDefaultKeywords() {
      const res = await this.$http.get("/search/default");
      // console.log(res);
      this.placeholder = res.data.data.showKeyword;
    },
    // 搜索
    search() {
      // 搜索结果与上一次相同，则不做任何跳转
      if (this.$route.query.q == this.inputValue.trim()) {
        return;
      }
      if (this.inputValue.trim() == "") {
        this.$message("请输入搜索内容");
        return;
      }
      // 跳转到搜索页面result
      if (this.$route.path != "/result") {
        this.$router.push(`/result?q=${this.inputValue}`);
      } else {
        this.$router.replace(`/result?q=${this.inputValue}`);
      }
    },
    // 搜索推荐 queryString, callback(返回结果)
    async getSearchAsync(queryString, callback) {
      if (this.inputValue == "") {
        // 输入框中没有内容，标识系统请求
        this.auth = "system";
        // 已有搜索数据就不需要重新请求
        if (this.searchHotList != "") {
          return callback(this.searchHotList);
        }
        this.searchHotList = [];
        // 获取推荐搜索信息
        const res = await this.$http.get("/search/hot");
        res.data.result.hots.forEach(item => {
          this.searchHotList.push({ value: item.first });
        });
        callback(this.searchHotList);
        // console.log(res);
      } else {
        // 输入框中有内容，标识用户请求
        this.auth = "user";
        // 判断搜索框是否为原来的内容
        if (queryString == this.searchKeywords) {
          return callback(this.searchHot);
        }
        this.searchHot = [];
        // 获取推荐搜索信息
        // 有albums, artists, playlists, songs
        let that = this
        clearTimeout(this.timer)
        this.timer = setTimeout(async() => {
          const res = await that.$http.get(
            `/search/suggest?keywords=${queryString}`
          );
          // console.log(res);
          // 暂存搜索关键字
          that.searchKeywords = queryString;
          if (res.data.result.songs && res.data.result.songs.length > 0) {
            res.data.result.songs.forEach(item => {
              that.searchHot.push({
                value: item.name + "—" + item.artists[0].name,
                id: item.id,
                type: "songs"
              });
            });
          }
          callback(this.searchHot);
        }, 500)
      }
    },
    // 点击推荐项重新渲染页面
    handleSelect() {
      this.search();
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  font-size: 32px;
  margin-right: 20px;
}
.top-container {
  display: flex;
  justify-content: space-between;
  padding: 0 10px 0 20px;
  background-color: #f9f9f9;
  align-items: center;
  height: 46px !important;
}
.left {
  text-align: center;
}
.center {
  flex-basis: 400px;
}
.right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  margin-right: 20px;
  &:hover {
    color: #409eff;
    cursor: pointer;
  }
}
.el-autocomplete {
  width: 100%;
}
.switch {
  margin-right: 4px;
}
.switch-span {
  margin-right: 4px;
}
.avatar {
  img {
    margin-left: 20px;
    height: 40px;
    line-height: 46px;
    border-radius: 50%;
    cursor: pointer;
  }
  span {
    float: right;
    margin-left: 5px;
    height: 40px;
    line-height: 46px;
    font-size: 16px;
    color: black;
  }
  &:hover {
    color: #fff;
    text-decoration-line: underline;
    .userInfoBox {
      display: block;
    }
  }
}
.infoFont {
  font-size: 20px;
}
.el-button {
  margin-left: 10px;
  margin-right: 10px;
}
.userInfoBox {
  display: none;
}
</style>