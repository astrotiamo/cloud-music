<template>
  <div class="songs-container">
    <!-- 导航栏 -->
    <div class="tab-bar">
      <span :class="['item', {active: type == '0'}]" @click="type = 0">全部</span>
      <span :class="['item', {active: type == '7'}]" @click="type = 7">华语</span>
      <span :class="['item', {active: type == '96'}]" @click="type = 96">欧美</span>
      <span :class="['item', {active: type == '8'}]" @click="type = 8">日本</span>
      <span :class="['item', {active: type == '16'}]" @click="type = 16">韩国</span>
    </div>
    <!-- 音乐表格 -->
    <table class="el-table">
      <thead>
        <th>序号</th>
        <th>封面</th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in currentList"
          :key="index"
          @dblclick="playMusic(item.id, item.name)"
        >
          <!-- 序号 -->
          <td class="index">{{index + 1 + (queryInfo.offset - 1) * queryInfo.limit}}</td>
          <!-- 封面 -->
          <td>
            <div class="img-wrap" @click="playMusic(item.id, item.name)">
              <img v-lazy="item.album.picUrl" />
              <span class="iconfont icon-play"></span>
            </div>
          </td>
          <!-- 音乐标题 -->
          <td>
            <div class="song-wrap">
              <span>{{item.name}}</span>
              <el-tooltip
                class="item"
                effect="dark"
                content="添加到播放列表"
                :enterable="false"
                placement="bottom"
              >
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
          <td class="time">{{item.duration | formatDuration}}</td>
        </tr>
      </tbody>
    </table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.offset"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.length">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Songs",
  data() {
    return {
      // 全部歌曲列表
      list: [],
      // 当前展示的歌曲列表
      currentList: [],
      // 标签类型，默认全部
      type: 0,
      queryInfo: {
        limit: 10,
        offset: 1
      }
    };
  },
  created() {
    this.fetchNewMusic();
  },
  watch: {
    type() {
      this.queryInfo.offset = 1
      this.fetchNewMusic()
    }
  },
  methods: {
    // 获取最新音乐
    async fetchNewMusic() {
      const res = await this.$http.get(`/top/song`, {
        params: {
          type: this.type,
          offset: 1
        }
      });
      console.log(res);
      this.list = res.data.data;
      this.currentList = this.list.splice(0, this.queryInfo.limit);
      console.log(this.currentList);
    },
    // 播放音乐
    playMusic(id, name, insert = true) {
      this.$store.dispatch("getAudioInfo", {
        id,
        isInsert: insert
      });
      if (insert) {
        insert && this.$Bus.$emit("play");
        this.$notify({
          title: "开始播放：" + name,
          offset: 50
        });
      } else {
        this.$notify({
          title: name,
          message: `已添加到播放列表~`,
          offset: 50
        });
      }
    },
    // 播放mv
    playMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
    // 监听歌曲数目改变
    handleSizeChange(newSize) {
      this.queryInfo.limit = newSize
      let start = (this.queryInfo.offset - 1) * this.queryInfo.limit
      let end = start + this.queryInfo.limit
      this.currentList = this.list.slice(start, end)
    },
    // 监听页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.offset = newPage
      let start = (this.queryInfo.offset - 1) * this.queryInfo.limit
      let end = start + this.queryInfo.limit
      this.currentList = this.list.slice(start, end)
    }
  }
};
</script>

<style scoped>
.songs-container .tab-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 14px;
}
.songs-container .tab-bar .item {
  font-size: 15px;
  color: grey;
  margin-right: 20px;
  cursor: pointer;
}
.songs-container .tab-bar .item.active {
  color: #ee0000;
}
.songs-container .el-table {
  margin-bottom: 20px;
}
.songs-container .el-table .index {
  text-align: center;
}
.songs-container .el-table th {
  font-weight: normal;
}
.songs-container .el-table td {
  border: none;
}
.songs-container .el-table th:first-child {
  width: 50px;
}
.songs-container .el-table th:nth-child(2) {
  width: 130px;
}
.songs-container .el-table th:nth-child(3) {
  width: 300px;
}
.songs-container .el-table th:nth-child(4) {
  width: 200px;
}
.songs-container .el-table th:nth-child(5) {
  width: 300px;
}
.songs-container .el-table .img-wrap {
  position: relative;
  width: 70px;
  height: 70px;
  margin: 0 auto;
}
.songs-container .el-table .img-wrap img {
  margin-top: 2px;
  width: 65px;
  height: 65px;
  border-radius: 5px;
}
.songs-container .el-table .img-wrap .icon-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ee0000;
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
}
.songs-container .el-table .img-wrap:hover .icon-play {
  opacity: 1;
}
.songs-container .el-table .song-wrap > span {
  display: inline-block;
}
.songs-container .el-table .song-wrap .icon-add {
  color: #ee0000;
  border: 1px solid #ee0000;
  margin: 0 6px;
}
.songs-container .el-table .song-wrap .icon-mv-line {
  font-size: 20px;
  color: #ee0000;
}
.songs-container .el-table .time {
  text-align: center;
}
.songs-container .el-table tr:nth-child(2n) {
  background-color: #fafafa;
}

.songs-container .el-table tr:hover {
  background-color: #f5f7fa;
}
.songs-container .el-pagination {
  margin-bottom: 80px;
  text-align: center;
}
</style>