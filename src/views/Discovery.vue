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
import { mapActions } from "vuex";
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
    ...mapActions(["getAudioInfo"]),
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
      this.getAudioInfo({ id, isInsert: true });
      this.$Bus.$emit("switch");
      this.$Bus.$emit("play");
    },
    // 播放MV
    playMV(id) {
      this.$router.push(`/mv?id=${id}`);
    }
  }
};
</script>

<style lang="less" scoped>
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
.items {
  display: flex;
  flex-wrap: wrap;
}
.recommend {
  margin-bottom: 60px;
  .items {
    .item {
      width: 200px;
      margin: 10px;
      position: relative;
      overflow: hidden;
      img {
        width: 200px;
        height: 200px;
        border-radius: 5px;
      }
      .desc-wrap {
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
        span {
          font-size: 14px;
        }
      }
      &:hover .desc-wrap {
        top: 0;
      }
      .img-wrap {
        position: relative;
        .icon-play {
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
      }
      &:hover .icon-play {
        opacity: 1;
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        font-size: 14px;
      }
    }
  }
}
.new {
  margin-bottom: 40px;
  .items {
    height: 500px;
    flex-direction: column;
    padding-left: 15px;
    .item {
      height: 100px;
      width: 50%;
      display: flex;
      align-items: center;
      &:hover {
        background: #f5f5f5;
      }
      .img-wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        img {
          width: 80px;
          height: 80px;
        }
        .iconfont {
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
        &:hover .iconfont {
          opacity: 1;
        }
      }
      .song-wrap {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
        padding: 10px;
        font-size: 16px;
        .artist {
          font-size: 14px;
          color: grey;
        }
      }
    }
  }
}
.mv {
  margin-bottom: 54px;
  .items {
    display: flex;
    justify-content: space-around;
    .item {
      width: 250px;
      .img-wrap {
        width: 100%;
        position: relative;
        & > .icon-play {
          /* 避免污染播放量处icon-play正常显示 */
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: red;
          font-size: 40px;
          opacity: 0;
        }
        &:hover .icon-play {
          opacity: 1;
        }
        img {
          width: 100%;
          height: 141px;
          border-radius: 5px;
        }
        .number-wrap {
          position: absolute;
          color: white;
          top: 0;
          right: 0;
          font-size: 14px;
          display: flex;
          align-items: center;
          padding-right: 5px;
          padding-top: 2px;
          .icon-play {
            font-size: 14px;
            display: flex;
            align-items: center;
            margin-right: 5px;
          }
        }
      }
      .info-wrap {
        .name {
          font-size: 15px;
          margin-bottom: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1; /* 字数过长则省略 */
        }
        .artist {
          font-size: 14px;
          color: #c5c5c5;
        }
      }
    }
  }
}
.el-backtop {
  bottom: 80px !important;
} 
</style>