<template>
  <div class="top-container">
    <!-- 左部区域 -->
    <div class="left d-flex">
      <span class="title">cloud-music</span>
      <div class="control-go">
        <!-- 返回上一页 -->
        <el-button type="info" size="small" class="clear-icon el-icon-arrow-left" @click="go(-1)" circle></el-button>
        <!-- 前往下一页 -->
        <el-button type="info" size="small" class="clear-icon el-icon-arrow-right" @click="go(1)" circle></el-button>
      </div>
    </div>
    <!-- 中部区域 -->
    <div class="center">
      <!-- 带输入建议的输入框 -->
      <!-- <el-autocomplete
        class="inline-input"
        @keyup.native.enter="search"
        v-model="inputValue"
        :fetch-suggestions="getSearchAsync"
        :placeholder="placeholder"
        @select="handleSelect"
        prefix-icon="el-icon-search"
        clearable
        size="small"
      ></el-autocomplete> -->
    </div>
    <!-- 右部区域 -->
    <div class="right">
      <el-switch class="switch" v-model="navState" @change="changeNavState"></el-switch>
      <span class="switch-span">侧边栏</span>
      <el-switch class="switch" v-model="state" @change="changeState"></el-switch>
      <span>进度条</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Top',
  data() {
    return {
      // 输入提示
      placeholder: '',
      // 输入的内容
      inputValue: '',
      // 热搜列表
      searchHot: [],
      // 热搜推荐列表
      searchHotList: [],
      // 用于标识是系统请求，还是用户请求
      auth: '',
      // 暂存搜索关键字
      searchKeywords: '',
      // 开关状态  是否显示音乐面板
      state: true,
      // 是否显示导航栏 nav
      navState: true,
    }
  },
  methods: {
    // 前进/后退
    go(index) {
      window.history.go(index)
    },
    // 改变开关状态，传递状态到外部组件Index
    changeNavState() {
      this.$Bus.$emit('changeNavState', this.navState)
      // console.log('1')
    },
    changeState() {
      this.$Bus.$emit('changeState', this.state)
      // console.log('2')
    }
  }
}
</script>

<style scoped>
  .title {
    font-size:32px;
    margin-right: 20px;
  }
  /* .inline-input {
    border-radius: 40%;
  } */
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
  .el-autocomplete {
    width: 100%;
  }
  .switch {
    margin-right: 4px;
  }
  .switch-span {
    margin-right: 4px;
  }
</style>