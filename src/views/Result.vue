<template>
  <div class="result-container">
    <!-- 顶部标题区 -->
    <div class="title-wrap">
      <h2 class="title">{{queryInfo.keywords}}</h2>
      <span class="sub-title">{{`共找到${count}个结果`}}</span>
    </div>

    <!-- 主体区 -->
    <el-tabs v-model="activeIndex">
      <!-- 歌曲 -->
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item, index) in searchResult.songs" :key="index" @dblclick="playMusic(item.id, item.name)">
              <!-- 序号 -->
              <td>{{(queryInfo.page - 1) * limit.songs + index + 1}}</td>
              <!-- 音乐标题 -->
              <td>
                <div class="song-wrap">
                  <!-- 歌名 -->
                  <span class="title">{{item.name}}</span>
                  <!-- 图标 -->
                  <el-tooltip class="item" effect="dark" content="添加到播放列表" :enterable="false" placement="bottom">
                    <span class="iconfont icon-add" @click="playMusic(item.id, item.name, false)"></span>
                  </el-tooltip>
                  <span v-if="item.mvid" class="iconfont icon-mv-line" @click="playMv(item.mvid)"></span>
                </div>
              </td>
              <!-- 歌手 -->
              <td>{{item.artists[0].name}}</td>
              <!-- 专辑 -->
              <td>{{item.album.name}}</td>
              <!-- 时长 -->
              <td>{{item.duration | formatDuration}}</td>
            </tr>
          </tbody>
        </table>
        <!-- 分页器 -->
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChange"
          @current-change="currentPageChange"
          :current-page="queryInfo.page"
          :page-sizes="[5, 10, 15, 20, 50]"
          :page-size="limit.songs"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </el-tab-pane>

      <!-- 歌单 -->
      <el-tab-pane label="歌单" name="playlists">
        <div class="items">
          <div class="item" v-for="(item, index) in searchResult.playlists" :key="index" @click="playList(item.id)">
            <!-- 图片区 -->
            <div class="img-wrap">
              <div class="num-wrap">
                播放量：<span class="num">{{item.playCount | ellipsisPlayCount}}</span>
              </div>
              <img v-lazy="item.coverImgUrl">
              <span class="iconfont icon-play"></span>
            </div>
            <!-- 歌单名 -->
            <p class="name">{{item.name}}</p>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChange"
          @current-change="currentPageChange"
          :current-page="queryInfo.page"
          :page-sizes="[5, 10, 15, 20, 50]"
          :page-size="limit.playlists"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </el-tab-pane>

      <!-- mv -->
      <el-tab-pane label="MV" name="mvs">
        <div class="items mv">
          <div class="item" v-for="(item, index) in searchResult.mvs" :key="index" @click="playMv(item.id)">
            <!-- 图片区 -->
            <div class="img-wrap">
              <img v-lazy="item.cover">
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <span class="iconfont icon-play"></span>
                <span class="num">{{item.playCount | ellipsisPlayCount}}</span>
              </div>
              <span class="time">{{item.duration | formatDuration}}</span>
            </div>
            <!-- 信息区 -->
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="artist">{{item.artists[0].name}}</div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChange"
          @current-change="currentPageChange"
          :current-page="queryInfo.page"
          :page-sizes="[5, 10, 15, 20, 50]"
          :page-size="limit.mvs"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import { mapAction } from 'vuex'
export default {
  name: "Result",
  data() {
    return {
      // 决定tab-bar显示的内容，歌曲，歌单，mv
      activeIndex: 'songs',
      queryInfo: {
        // 搜索关键词
        keywords: '',
        // 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
        type: 1,
        page: 1
      },
      limit: {
        songs: 10,
        playlists: 10,
        mvs: 8
      },
      // 结果
      searchResult: [],
      // 总计
      count: 0,
      // 是否加载更多
      disabled: false
    }
  },
  computed: {
    searchQueryInfo() {
      return this.$route.query.q
    }
  },
  watch: {
    // 切换面板
    activeIndex(newVal) {
      let type = null
      if(newVal == 'songs') {
        type = 1
      } else if(newVal == 'playlists') {
        type = 1000
      } else if(newVal == 'mvs') {
        type = 1004
      }
      this.queryInfo.type = type
      this.searchMusic()
    },
    // 计算属性  在搜索页面中再进行搜索
    searchQueryInfo: {
      handler() {
        this.queryInfo.keywords = this.$route.query.q
        this.searchMusic()
      },
      deep: true
    }
  },  
  created() {
    this.queryInfo.keywords = this.$route.query.q
    this.searchMusic()
  },
  methods: {
    // 监听页容量变化
    sizeChange(newSize) {
      if(this.activeIndex == 'songs') {
        this.limit.songs = newSize
      } else if(this.activeIndex == 'playlists') {
        this.limit.playlists = newSize
      } else if(this.activeIndex == 'mvs') {
        this.limit.mvs = newSize
      }
    },
    // 监听页码变化
    currentPageChange(newPage) {
      this.queryInfo.page = newPage
      this.searchMusic()
    },
    // 搜索音乐
    async searchMusic() {
      let limit
      if(this.activeIndex == 'songs') {
        limit = this.limit.songs
      } else if(this.activeIndex == 'playlists') {
        limit = this.limit.playlists
      } else if(this.activeIndex == 'mvs') {
        limit = this.limit.mvs
      }
      // 获取搜索信息
      const res = await this.$http.get('search', {
        params: {
          keywords: this.queryInfo.keywords,
          type: this.queryInfo.type,
          limit,
          offset: (this.queryInfo.page - 1) * limit
        }
      })
      console.log(res.data);
      this.count = res.data.result.songCount || res.data.result.playlistCount || res.data.result.mvCount
      this.searchResult = res.data.result
    },
    // 播放音乐
    playMusic(id, name, insert = true) {
      this.$store.dispatch('getAudioInfo', {
        id,
        isInsert: insert
      })
      if(insert) {
        insert && this.$Bus.$emit('play')
        this.$notify({
          title: '开始播放：' + name,
          offset: 50,
        })
      } else {
        this.$notify({
          title: name,
          message: `已添加到播放列表~`,
          offset: 50,
        })
      }
    },
    // 播放mv
    playMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
    // 跳转到歌单详情
    playList(id) {
      this.$router.push(`/playlist?id=${id}`)
    }
  }
}
</script>

<style>
.result-container .title-wrap {
  display: flex;
  align-items: flex-end;
  margin-bottom: 30px;
}
.result-container .title-wrap .title {
  margin-right: 10px;
}
.result-container .title-wrap .sub-title {
  font-size: 15px;
  color: #bebebe;
}
tr, th, td, .song-wrap, .name-wrap, .el-table__row {
  user-select: none;
  margin: 12px 0;
}
.result-container .el-tabs__item {
  font-size: 18px !important;
}
.result-container .el-tabs__item.is-active {
  color: #c4373a;
}
.result-container .el-tabs__active-bar {
  background-color: #c4373a;
}
.result-container .el-table {
  border-bottom: none;
  border-collapse: collapse;
}
.result-container .el-table td:first-child {
  padding-left: 10px;
}
.result-container .el-table th {
  font-weight: normal;
}
.result-container .el-table th:first-child {
  width: 50px;
}
.result-container .el-table th:nth-child(2) {
  width: 300px;
}
.result-container .el-table th:nth-child(3) {
  width: 200px;
}
.result-container .el-table th:nth-child(4) {
  width: 480px;
}
.result-container .el-table tr:nth-child(2n) {
  background-color: #fafafa;
}

.result-container .el-table tr:hover {
  background-color: #f5f7fa;
}
.result-container .el-pagination {
  margin-top: 10px;
  margin-bottom: 80px;
  text-align: center;
}
.result-container .el-table .song-wrap .icon-add {
  color: #ee0000;
  border: 1px solid #ee0000;
  margin: 0 6px;
}
.result-container .el-table .song-wrap .icon-mv-line {
  font-size: 20px;
  color: #ee0000;
}
.result-container .items {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.result-container .items .item {
  width: 200px;
  cursor: pointer;
  margin-right: 20px;
  margin-bottom: 20px;
}
.result-container .items .item .img-wrap {
  width: 100%;
  position: relative;
}
.result-container .items .item .img-wrap img {
  width: 100%;
  border-radius: 5px;
}
.result-container .items .item .img-wrap>.icon-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ee0000;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
}
.result-container .items .item .img-wrap:hover>.icon-play {
  opacity: 1;
}
.result-container .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  padding-top: 2px;
  padding-right: 5px;
}
.result-container .items .item .name {
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.result-container .items.mv .item {
  width: 250px;
}
.result-container .items .item .time {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: white;
}
.result-container .items .item .artist {
  font-size: 14px;
  color: #c5c5c5;
}
</style>