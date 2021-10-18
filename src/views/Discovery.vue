<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel indicator-position="none" :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <a :href="item.url">
          <img v-lazy="item.imageUrl" />
        </a>
      </el-carousel-item>
    </el-carousel>

    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">推荐歌单</h3>
      <div class="items">
        <div
          class="item"
          v-for="(item, index) in lists"
          :key="index"
          @click="toPlayListDetail(item.id)"
        >
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{item.copywriter}}</span>
            </div>
            <img v-lazy="item.picUrl" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>

    <!-- 最新音乐 -->
    <div class="new">
      <h3 class="title">最新音乐</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in songs" :key="index" @click="playMusic(item.id)">
          <div class="img-wrap">
            <img v-lazy="item.picUrl" />
            <span class="iconfont icon-play"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{item.name}}</div>
            <div v-if="item.song.artists">
              <div class="artist">{{item.song.artists[0].name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐MV -->
    <div class="mv">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in mvs" :key="index" @click="playMV(item.id)">
          <div class="img-wrap">
            <img v-lazy="item.picUrl" />
            <span class="iconfont icon-play"></span>
            <div class="number-wrap">
              <div class="iconfont icon-play"></div>
              <!-- 播放次数 -->
              <div class="number">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="artist">{{item.artistName}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 回到顶部 -->
    <el-backtop target=".discovery-container">
      <!-- <i class="el-icon-caret-top"></i> -->
    </el-backtop>
  </div>
</template>

<script>
// 导入辅助函数
import { mapActions } from 'vuex'
export default {
  name: "Discovery",
  data() {
    return {
      // 轮播图数据
      banners: [],
      // 推荐歌单
      lists: [],
      // 最新音乐
      songs: [],
      // 推荐MV
      mvs: []
    };
  },
  created() {
    this.fetchBannerLists();
    this.fetchRecommend();
    this.fetchNewSong();
    this.fetchMvs();
  },
  methods: {
    // 通过辅助函数把actions里的函数引用到这里
    ...mapActions(['getAudioInfo']),
    // 获取轮播图函数
    async fetchBannerLists() {
      const res = await this.$http.get("/banner");
      this.banners = res.data.banners;
    },
    // 获取推荐歌单
    async fetchRecommend() {
      const res = await this.$http.get("/personalized", {
        params: {
          // 获取的数量
          limit: 15
        }
      });
      this.lists = res.data.result;
    },
    // 获取最新音乐
    async fetchNewSong() {
      const res = await this.$http.get("/personalized/newsong");
      this.songs = res.data.result;
    },
    // 获取推荐MV
    async fetchMvs() {
      const res = await this.$http.get("/personalized/mv");
      this.mvs = res.data.result;
    },

    // 跳转到歌单详情页
    toPlayListDetail(id) {
      this.$router.push(`/playlist?id=${id}`);
    },
    // 点击按钮播放音乐
    async playMusic(id) {
      this.getAudioInfo({id, isInsert: true})
      this.$Bus.$emit('switch')
      this.$Bus.$emit('play')
    },
    // 播放MV
    playMV(id) {
      this.$router.push(`/mv?id=${id}`);
    }
  }
};
</script>

<style scoped>
.el-carousel__container {
  height: 230px;
}
.el-carousel__item img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.title {
  font-weight: normal;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-left: 8px;
}
.recommend {
  margin-bottom: 60px;
}
.items {
  display: flex;
  flex-wrap: wrap;
}
.recommend .items .item {
  width: 200px;
  margin: 10px;
  position: relative;
  overflow: hidden;
}
.recommend .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}
.recommend .items .item .desc-wrap {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  font-size: 16px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  max-height: 50px;
  padding: 5px;
  text-align: center;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 字数过长则省略 */

  top: -50px; /* 隐藏 */
}
.recommend .items .item:hover .desc-wrap {
  top: 0;
}
.recommend .items .item .desc-wrap span {
  font-size: 14px;
}
.recommend .items .item .img-wrap {
  position: relative;
}
.recommend .items .item .img-wrap .icon-play {
  position: absolute;
  right: 4px;
  bottom: 8px;
  width: 30px;
  height: 30px;
  color: #ee0000;
  font-size: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: rgba(255, 255, 255, 0.8); */
  opacity: 0; /* 隐藏 */
}
.recommend .items .item:hover .icon-play {
  opacity: 1;
}
.recommend .items .item .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  font-size: 14px;
}
.new {
  margin-bottom: 40px;
}
.new .items {
  height: 500px;
  flex-direction: column;
  padding-left: 15px;
}
.new .items .item {
  height: 100px;
  width: 50%;
  display: flex;
  align-items: center;
}
.new .items .item:hover {
  background: #f5f5f5;
}
.new .items .item .img-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.new .items .item .img-wrap img {
  width: 80px;
  height: 80px;
}
.new .items .item .img-wrap .iconfont {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: red;
  text-align: center;
  line-height: 40px;
  font-size: 28px;
  opacity: 0;
}
.new .items .item .img-wrap:hover .iconfont {
  opacity: 1;
}
.new .items .item .song-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding: 10px;
  font-size: 16px;
}
.new .items .item .song-wrap .artist {
  font-size: 14px;
  color: grey;
}
.mv {
  margin-bottom: 54px;
}
.mv .items {
  display: flex;
  justify-content: space-around;
}
.mv .items .item {
  width: 250px;
}
.mv .items .item .img-wrap {
  width: 100%;
  position: relative;
}
.mv .items .item .img-wrap > .icon-play {
  /* 避免污染播放量处icon-play正常显示 */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: red;
  font-size: 40px;
  opacity: 0;
}
.mv .items .item .img-wrap:hover .icon-play {
  opacity: 1;
}
.mv .items .item .img-wrap img {
  width: 100%;
  height: 141px;
  border-radius: 5px;
}
.mv .items .item .img-wrap .number-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding-right: 5px;
  padding-top: 2px;
}
.mv .items .item .img-wrap .number-wrap .icon-play {
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 5px;
}
.mv .items .item .info-wrap .name {
  font-size: 15px;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 字数过长则省略 */
}
.mv .items .item .info-wrap .artist {
  font-size: 14px;
  color: #c5c5c5;
}
/* .el-backtop {
  bottom: 80px !important;
} */
</style>