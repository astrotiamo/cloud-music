<template>
  <div :class="['index-container', { 'padding-bottom': state }]">
    <div :class="['nav', { 'hideNav': !hideNav }]">
      <ul :class="{ 'hideNav': !hideNav }">
        <li>
          <router-link to="/discovery">
            <span class="iconfont icon-findMusic"></span>
            发现音乐
          </router-link>
        </li>
        <li>
          <router-link to="/playlists">
            <span class="iconfont icon-music-list"></span>
            推荐歌单
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span class="iconfont icon-music"></span>
            最新音乐
          </router-link>
        </li>
        <li>
          <router-link to="/mvs">
            <span class="iconfont icon-mv-line"></span>
            最新MV
          </router-link>
        </li>
      </ul>
      <div class="author">
        <img src="../assets/img/avatar.jpg" />
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <div :class="['player', { 'hide': !hidePlayer }]">
      <aplayer
        ref="aplayer"
        :list="audioInfo"
        :music="audioInfo[0]"
        :lrcType="1"
        :volume.sync="volume"
        :mini.sync="mini"
        :loop.sync="loop"
        :order.sync="order"
        :listFolded.sync="listFolded"
        :fixed="fixed"
        :autoplay="autoplay"
        @playing="play"
        :showLrc="showLrc"
      />
      <!-- <audio :src='musicUrl' controls autoplay></audio> -->
    </div>
  </div>
</template>

<script>
// 导入辅助函数
import { mapState } from "vuex";
import aplayer from "vue-aplayer";
export default {
  name: "Index",
  components: {
    aplayer
  },
  data() {
    return {
      state: true,
      // 是否显示进度条
      hidePlayer: true,
      // 是否显示导航栏 nav
      hideNav: true,
      volume: 0.7,
      // 迷你模式
      mini: false,
      // 音频循环播放, 可选值: 'all', 'one', 'none'
      loop: "all",
      // 音频循环顺序, 可选值: 'list', 'random'
      order: "random",
      // 自动播放
      autoplay: false,
      // 吸底模式
      fixed: true,
      // 是否显示音乐控制面板
      listFolded: true,
      // 是否显示歌词
      showLrc: true
    };
  },
  mounted() {
    // 其他一般组件或路由组件在点击播放音乐按钮时调用this.$Bus.$emit("play")发送事件
    this.$Bus.$on("play", this.play);
    this.$Bus.$on("stop", this.stop);
  },
  computed: {
    // 通过vuex获取audioInfo
    ...mapState(["audioInfo"])
  },
  created() {
    this.$Bus.$on("changeNavState", navState => {
      this.hideNav = navState;
      // console.log(this.hideNav)
    });
    this.$Bus.$on("changeState", state => {
      this.hidePlayer = state;
      // console.log(this.hideState)
    });
  },
  methods: {
    // 初始化
    init() {
      // 创建清空按钮
      this.createClearBtn();
    },
    // 播放事件
    play() {
      console.log("播放");
      let ap = this.$refs.aplayer;
      // 0.5s后开始播放
      setTimeout(() => {
        ap.play();
      }, 500);
    },
    // 切换到指定索引歌曲
    switch() {
      console.log("切换");
      setTimeout(() => {
        let ap = this.$refs.aplayer;
        ap.switch(0);
      }, 1000);
    },
    // 暂停播放
    stop() {
      console.log("暂停");
      let ap = this.$refs.aplayer;
      ap.pause();
    },
    // 切换播放状态
    toggle() {
      let ap = this.$refs.aplayer;
      ap.toggle();
    }
  }
};
</script>

<style lang="less" scoped>
.index-container {
  display: flex;
  position: relative;
  overflow: hidden;
  height: calc(100vh - 46px);
}

.nav {
  background-color: #ededed;
  width: 200px;
  height: 100%;
  li {
    height: 60px;
    display: flex;
    align-items: center;
    &:hover {
      background-color: #e7e7e7;
    }
    .iconfont {
      margin-right: 10px;
      font-size: 20px;
    }
    a {
      color: black;
      padding-left: 30px;
      font-size: 18px;
      line-height: 60px;
      width: 100%;
      height: 100%;
      &.router-link-active {
        color: red;
      }
    }
  }
}

.main {
  flex: 1;
  overflow-y: scroll;
  padding: 18px 20px;
  margin-bottom: 8px;
  & > div {
    max-width: 1100px;
    margin: 0 auto;
  }
}

.player {
  transition: all 0.3s;
  background: #f1f3f4;
  height: 75px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.author img {
  width: 180px;
  margin-top: 186px;
  margin-left: 8px;
  /* position: absolute;
  left: 50%;
  transform: translateX(-50%); */
}

.hideNav {
  transform-origin: left;
  transform: rotateY(90deg);
  width: 0px !important;
}

.hide {
  transform-origin: bottom;
  transform: rotateX(90deg);
}
</style>