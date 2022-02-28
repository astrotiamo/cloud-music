<template>
  <div class="artist-container">
    <!-- 上部区域 -->
    <div class="top-wrap">
      <img v-lazy="artistInfo.picUrl" />
      <!-- 简介部分 -->
      <div class="desc-wrap">
        <h2 class="name">{{artistInfo.name}}</h2>
        <div class="briefDesc-wrap">
          <el-tooltip
            popper-class="w-500"
            effect="dark"
            :content="artistInfo.briefDesc"
            placement="bottom"
          >
            <p class="brief">{{artistInfo.briefDesc}}</p>
          </el-tooltip>
        </div>
        <!-- 图标部分 -->
        <div class="icon">
          <span class="iconfont icon-music">
            <i>{{artistInfo.musicSize}}</i>
          </span>
          <span class="iconfont icon-music-list">
            <i>{{artistInfo.albumSize}}</i>
          </span>
          <span class="iconfont icon-play">
            <i>{{artistInfo.mvSize}}</i>
          </span>
        </div>
      </div>
    </div>

    <!-- tab区域 -->
    <div class="tab-wrap">
      <el-tabs type="border-card">
        <!-- 热门50 -->
        <el-tab-pane label="热门50">
          <el-table :data="hotSongs" stripe>
            <el-table-column type="index" label="#" width="50px"></el-table-column>

            <el-table-column label="歌曲" width="400px">
              <template v-slot="scope">
                <div @dblclick="playMusic(scope.row.id, scope.row.name)">
                  <span class="name">{{scope.row.name}}</span>
                  <i class="iconfont icon-music" @click="playMusic(scope.row.id, scope.row.name)"></i>
                  <i class="iconfont icon-play" v-if="scope.row.mv" @click="playMV(scope.row.mv)"></i>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="歌手" width="150px">
              <span>{{this.artistInfo.name}}</span>
            </el-table-column>

            <el-table-column label="专辑" width="300px">
              <template v-slot="scope">
                <span class="album">{{scope.row.al.name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="时长">
              <template v-slot="scope">
                <span class="time">{{scope.row.dt | formatDuration}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 所有专辑 -->
        <el-tab-pane label="所有专辑">
          <ul class="albums-container">
            <li v-for="(item, index) in hotAlbum" :key="index">
              <div class="album-wrap">
                <img v-lazy="item.picUrl" />
                <p>{{item.name}}</p>
                <p>{{item.artist.name}}</p>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <!-- 相关MV -->
        <el-tab-pane label="相关MV">
          <ul class="mvs-container">
            <li v-for="(item, index) in hotMv" :key="index">
              <div class="img-wrap" @click="playMV(item.id)">
                <img v-lazy="item.imgurl" />
                <div class="num-wrap">
                  <span class="iconfont icon-play"></span>
                  <div class="num">{{item.playCount}}</div>
                </div>
                <div class="time">{{item.duration | formatDuration}}</div>
              </div>
              <div class="info-wrap">
                <div class="name">{{item.name}}</div>
                <div class="artist">{{item.artistName}}</div>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <!-- 艺人介绍 -->
        <el-tab-pane label="艺人介绍">
          <div class="desc-container">
            <p class="title">{{artistInfo.name}}：简介</p>
            <ul class="desc-wrap">
              <li v-for="(item, index) in artistDesc.introduction" :key="index">
                <p class="title">{{item.ti}}</p>
                <p class="desc" v-for="(item1, index1) in item.txt" :key="index1">
                  {{item1}}
                </p>
              </li>
            </ul>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "Artist",
  data() {
    return {
      // 歌手信息
      artistInfo: {},
      // 热门歌曲
      hotSongs: [],
      // 歌手专辑参数
      queryInfo: {
        id: this.$route.query.id,
        limit: 50,
        offset: 0
      },
      // 歌手专辑
      hotAlbum: [],
      // 歌手mv
      hotMv: [],
      // 歌手详情
      artistDesc: {
        // 描述
        briefDesc: {},
        // 介绍
        introduction: []
      }
    };
  },
  watch: {},
  created() {
    let id = this.$route.query.id;
    this.fetchArtistInfo(id);
    this.fetchArtistAlbum(id);
    this.fetchArtistMv(id);
    this.fetchArtistDesc(id);
  },
  methods: {
    // 获取歌手信息
    async fetchArtistInfo(id) {
      const res = await this.$http.get("/artists", {
        params: {
          id
        }
      });
      // console.log(res);
      this.artistInfo = res.data.artist;
      // 获取歌手歌曲
      this.hotSongs = res.data.hotSongs;
    },
    // 获取歌手专辑
    async fetchArtistAlbum(id) {
      const res = await this.$http.get("/artist/album", {
        params: {
          id,
          limit: this.queryInfo.limit,
          offset: this.queryInfo.offset
        }
      });
      // console.log(res);
      this.hotAlbum = res.data.hotAlbums;
    },
    // 获取歌手mv
    async fetchArtistMv(id) {
      const res = await this.$http.get("/artist/mv", {
        params: {
          id,
          limit: 50
        }
      });
      // console.log(res);
      this.hotMv = res.data.mvs;
    },
    // 获取歌手描述
    async fetchArtistDesc(id) {
      const res = await this.$http.get("/artist/desc", {
        params: {
          id
        }
      });
      // console.log(res);
      this.artistDesc.briefDesc = res.data.briefDesc;
      res.data.introduction.forEach(item => {
        item.txt = item.txt.split("\n");
      });
      this.artistDesc.introduction = res.data.introduction;
      console.log(this.artistDesc.introduction);
    },
    // 播放音乐
    playMusic(id, name, insert = true) {
      this.$store.dispatch("getAudioInfo", {
        id,
        isInsert: insert
      });
      this.$Bus.$emit("play");
      this.$notify({
        title: "开始播放：" + name,
        offset: 50
      });
    },
    // 播放MV
    playMV(id) {
      this.$router.push(`/mv?id=${id}`);
    }
  }
};
</script>

<style lang="less">
.w-500 {
  width: 500px;
  top: -20px;
}
.artist-container {
  .top-wrap {
    display: flex;
    margin-top: 20px;
    img {
      width: 400px;
      height: 320px;
      border-radius: 20px;
      margin-right: 70px;
    }
    .desc-wrap {
      .name {
        font-size: 26px;
      }
      .briefDesc-wrap {
        // height: 260px;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 12;
      }
      .icon {
        margin-top: 20px;
        span {
          margin-right: 20px;
          font-size: 26px;
          i {
            font-size: 20px;
          }
        }
      }
    }
  }
  .tab-wrap {
    margin-top: 20px;
    margin-bottom: 100px;
    .el-tabs__item {
      width: 275px;
      text-align: center;
    }
    .name {
      margin-right: 14px;
    }
    .icon-music {
      font-size: 22px;
      margin-right: 8px;
    }
    .icon-play {
      font-size: 20px;
    }
    .albums-container {
      margin: 10px;
      display: flex;
      flex-wrap: wrap;
      li {
        // padding: 30px;
        width: 172px;
        height: 200px;
        justify-content: center;
        align-items: center;
        .album-wrap {
          position: relative;
          margin: 10px;
          width: 150px;
          height: 150px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
          p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:last-child {
              font-size: 12px;
              color: #c5c5c5;
            }
          }
        }
      }
    }
    .mvs-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      li {
        width: 230px;
        margin-bottom: 10px;
        .img-wrap {
          position: relative;
          width: 100%;
          height: 150px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
          .num-wrap {
            position: absolute;
            top: 0;
            right: 0;
            color: white;
            display: flex;
            align-items: center;
            font-size: 14px;
            padding-right: 5px;
            padding-top: 2px;
            .icon-play {
              font-size: 16px;
              display: flex;
              align-items: center;
              margin-right: 4px;
            }
          }
          .time {
            position: absolute;
            color: white;
            bottom: 5px;
            right: 4px;
            font-size: 14px;
          }
        }
        .info-wrap {
          .name {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 15px;
          }
          .artist {
            font-size: 14px;
            color: #c5c5c5;
          }
        }
      }
    }
    .desc-container {
      .title {
        font-size: 20px;
        font-weight: 600;
        line-height: 2;
      }
      li {
        margin: 20px 0;
        .desc {
          font-size: 14px;
          line-height: 2;
          text-indent: 2em;
        }
      }
    }
  }
}
</style>