<template>
  <div class="playlist-container">
    <!-- 头部信息 -->
    <div class="top-wrap">
      <!-- 图片区域 -->
      <div class="img-wrap">
        <img v-lazy="playList.coverImgUrl" class="border-radius" />
        <div class="play-count iconfont icon-play">{{playList.playCount | ellipsisPlayCount}}</div>
      </div>
      <!-- 信息区域 -->
      <div class="info-wrap">
        <!-- 歌单名称 -->
        <p class="title">{{playList.name}}</p>
        <!-- 用户信息 -->
        <div class="creator-wrap">
          <!-- 头像 -->
          <img v-lazy="playList.creator.avatarUrl" class="avatar" />
          <!-- 名称 -->
          <span class="name">{{playList.creator.nickname}}</span>
          <!-- 创建时间 -->
          <span class="time">{{playList.updateTime | localeTimeString}}更新</span>
        </div>
        <!-- 播放 -->
        <div class="play-wrap">
          <el-tooltip class="item" effect="dark" content="替换播放列表" placement="bottom">
            <span class="text iconfont icon-circle-play">播放全部</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="添加到播放列表" placement="right">
            <span class="add-playlist iconfont icon-add"></span>
          </el-tooltip>
        </div>
        <!-- 标签 -->
        <div class="tag-wrap">
          <span class="title">标签：</span>
          <ul>
            <li v-for="(item, index) in playList.tags" :key="index">{{item}}</li>
          </ul>
        </div>
        <!-- 简介 -->
        <div class="desc-wrap">
          <span class="title">简介：</span>
          <!-- <span class="desc">{{playList.description || playList.name}}</span> -->
          <!-- el-tooltip样式不能用scoped包裹 -->
          <el-tooltip
            popper-class="w-500"
            effect="dark"
            :content="playList.description"
            placement="bottom"
          >
            <span class="desc">{{playList.description || playList.name}}</span>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 歌曲列表及评论区 -->
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
        <table class="el-table playlist-table">
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
              v-for="(item, index) in playList.tracks"
              :key="index"
              @dblclick="playMusic(item.id, item.name)"
            >
              <!-- 序号 -->
              <td class="index">{{index + 1}}</td>
              <!-- 封面 -->
              <td>
                <div class="img-wrap">
                  <div @click="playMusic(item.id, item.name)">
                    <img v-lazy="item.al.picUrl" />
                    <span class="iconfont icon-play"></span>
                  </div>
                </div>
              </td>
              <!-- 歌名 -->
              <td>
                <div class="song-wrap">
                  <span class="title">{{item.name}}</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="添加到播放列表"
                    :enterable="false"
                    placement="bottom"
                  >
                    <span class="iconfont icon-add" @click="playMusic(item.id, item.name, false)"></span>
                  </el-tooltip>
                  <span class="iconfont icon-mv-line" v-if="item.mvid" @click="playMv(item.mvid)"></span>
                </div>
              </td>
              <!-- 歌手 -->
              <td>{{item.ar[0].name}}</td>
              <!-- 专辑 -->
              <td>{{item.al.name}}</td>
              <!-- 时长 -->
              <td>{{item.dt | formatDuration}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>

      <el-tab-pane :label="'评论(' + (commentInfo.total) + ')'" name="2" >
        <!-- 热评区 -->
        <div class="comment-wrap" v-if="commentInfo.hotComments">
          <p class="title">
            精彩评论
            <span>{{`(${commentInfo.hotComments.length})`}}</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in commentInfo.hotComments" :key="index">
              <!-- 评论者头像 -->
              <div class="avatar">
                <img v-lazy="item.user.avatarUrl" />
              </div>
              <div class="content-wrap">
                <!-- 评论者区 -->
                <div class="content">
                  <span class="name">{{item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <!-- 回复区 -->
                <div class="reply" v-if="item.beReplied[0]">
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <!-- 时间 -->
                <div class="time">
                  <span>{{item.time | localeTimeString}}</span>
                  <span class="iconfont icon-zan">{{item.likedCount}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论区 -->
        <div class="comment-wrap" v-if="commentInfo.comments.length > 0">
          <p class="title">
            最新评论
            <span>{{`(${commentInfo.total})`}}</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in commentInfo.comments" :key="index">
              <div class="avatar">
                <img v-lazy="item.user.avatarUrl" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div class="reply" v-if="item.beReplied[0]">
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="time">
                  <span>{{item.time | localeTimeString}}</span>
                  <span class="iconfont icon-zan">{{item.likedCount}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChange"
          @current-change="currentPageChange"
          :current-page="queryInfo.page"
          :page-sizes="[5, 10, 20, 30, 50]"
          :page-size="queryInfo.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="commentInfo.total"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "PlayList",
  data() {
    return {
      // 歌单信息
      playList: {
        creator: {}
      },
      // 此歌单的id
      id: '',
      // 当前默认el-tabs的选择项（歌曲列表）
      activeIndex: '1',
      // 获取评论信息所需的参数
      queryInfo: {
        limit: 10,
        // 页码
        page: 0
      },
      // 评论信息
      commentInfo: {
        comments: [],
        hotComments: [],
        total: 0
      }
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.fetchMusicListDetail(this.id);
    this.fetchMusicComments(this.id, this.queryInfo.limit);
  },
  methods: {
    // 获取歌单详情
    async fetchMusicListDetail(id) {
      const res = await this.$http.get(`/playlist/detail?id=${id}`);
      this.playList = res.data.playlist;
      console.log(this.playList);
    },
    // 获取评论信息
    async fetchMusicComments(id, limit, offset = 0) {
      const res = await this.$http.get(`/comment/playlist`, {
        params: {
          id,
          // 默认每页十条评论
          limit,
          offset
        }
      });
      this.commentInfo = res.data;
      // console.log(this.commentInfo);

      if (offset > 0) {
        this.commentInfo.comments = res.data.comments;
      } else {
        let newData = {
          comments: res.data.comments,
          total: res.data.total
        };
        if((res.data.hotComments.length !== 0 || res.data.topComments.length !== 0)) {
          newData.hotComments = res.data.hotComments || res.data.topComments;
        }
        this.commentInfo = newData;
        // console.log(this.commentInfo);
      }
    },
    // 播放音乐
    playMusic(id, name, insert = true) {
      this.$store.dispatch("getAudioInfo", {
        id,
        isInsert: insert
      });
      if (insert) {
        // 子传父 发射事件
        insert && this.$Bus.$emit("play");
        this.$notify({
          title: "开始播放：" + name,
          offset: 50
        });
      } else {
        this.$notify({
          title: "已添加到播放列表",
          offset: 50
        });
      }
    },
    // 播放mv
    playMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
    // 评论条数改变
    sizeChange(newSize) {
      this.queryInfo.limit = newSize;
      this.fetchMusicComments(this.id, this.queryInfo.limit, ((this.queryInfo.page-1)*this.queryInfo.limit));
    },
    // 页码改变
    currentPageChange(newPage) {
      this.queryInfo.page = newPage;
      this.fetchMusicComments(this.id, this.queryInfo.limit, ((this.queryInfo.page-1)*this.queryInfo.limit));
    }
  }
};
</script>

<style>
.playlist-container {
  margin: 0 auto;
}
.playlist-container .top-wrap {
  display: flex;
}
.playlist-container .top-wrap .img-wrap {
  margin-right: 30px;
  position: relative;
}
.playlist-container .top-wrap .img-wrap img {
  width: 230px;
  height: 230px;
}
.playlist-container .top-wrap .img-wrap .border-radius {
  border-radius: 15px;
}
.playlist-container .top-wrap .img-wrap .play-count {
  position: absolute;
  top: 5px;
  right: 10px;
  color: white;
}
.playlist-container .top-wrap .info-wrap {
  position: relative;
}
.playlist-container .top-wrap .info-wrap .title {
  margin-bottom: 20px;
}
.playlist-container .top-wrap .info-wrap .creator-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}
.playlist-container .top-wrap .info-wrap .creator-wrap img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
}
.playlist-container .top-wrap .info-wrap .creator-wrap .name {
  margin-right: 10px;
}
.playlist-container .top-wrap .info-wrap .creator-wrap .time {
  font-size: 14px;
}
.playlist-container .top-wrap .info-wrap .play-wrap {
  width: 130px;
  height: 35px;
  border-radius: 4px;
  background: linear-gradient(to right, #e85e4d, #c6483c);
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 25px;
  user-select: none;
}
.playlist-container .top-wrap .info-wrap .play-wrap span {
  color: white;
}
.playlist-container .top-wrap .info-wrap .play-wrap span.text {
  font-size: 16px;
}
.playlist-container .top-wrap .info-wrap .play-wrap span.add-playlist {
  margin: 0;
  padding-left: 5px;
  border-left: 2px solid;
  height: 100%;
  line-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.playlist-container .top-wrap .info-wrap .tag-wrap {
  display: flex;
  margin-bottom: 15px;
}
.playlist-container .top-wrap .info-wrap .tag-wrap span {
  margin: 0;
}
.playlist-container .top-wrap .info-wrap .tag-wrap ul {
  display: flex;
  align-items: center;
}
.playlist-container .top-wrap .info-wrap .tag-wrap li {
  font-size: 14px;
}
.playlist-container .top-wrap .info-wrap .tag-wrap li:not(:last-child)::after {
  content: "/";
  margin: 0 4px;
}
.playlist-container .top-wrap .info-wrap .desc-wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.playlist-container .top-wrap .info-wrap .desc-wrap1 {
  -webkit-line-clamp: 5;
}
.playlist-container .top-wrap .info-wrap .desc-wrap span:last-child {
  font-size: 15px;
}
.w-500 {
  max-width: 500px !important;
}
.playlist-container .el-tabs {
  margin-bottom: 100px;
}
.playlist-container .el-table {
  border-bottom: none !important;
  border-collapse: collapse;
}
.playlist-container .el-table tbody {
  border-bottom: none;
}
.playlist-container .el-table.playlist-table .index {
  text-align: center;
}
.playlist-container .el-table.playlist-table th {
  font-weight: normal;
}
.playlist-container .el-table.playlist-table th:first-child {
  width: 50px;
}
.playlist-container .el-table.playlist-table th:nth-child(2) {
  width: 130px;
}
.playlist-container .el-table.playlist-table th:nth-child(3) {
  width: 300px;
}
.playlist-container .el-table.playlist-table th:nth-child(4) {
  width: 200px;
}
.playlist-container .el-table.playlist-table tr:nth-child(2n) {
  background-color: #fafafa;
}
.playlist-container .el-table.playlist-table tr:hover {
  background-color: #f5f7fa;
}
.playlist-container .el-table .img-wrap {
  position: relative;
  margin: 0 auto;
  margin-top: 2px;
  width: 70px;
  height: 70px;
}
.playlist-container .el-table .img-wrap img {
  width: 65px;
  height: 65px;
  border-radius: 5px;
}
.playlist-container .el-table .img-wrap .icon-play {
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
.playlist-container .el-table .img-wrap:hover .icon-play {
  opacity: 1;
}
/* .playlist-container .el-table .song-wrap>span {
  margin-top: 20px;
  display: inline-block;
  color: #bebebe;
} */
.playlist-container .el-table .song-wrap {
  margin-left: 26px;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
.playlist-container .el-table .song-wrap .title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.playlist-container .el-table .song-wrap .icon-add {
  color: #ee0000;
  border: 1px solid #ee0000;
  margin-left: 4px;
}
.playlist-container .el-table .song-wrap .icon-mv-line {
  padding-left: 5px;
  color: #ee0000;
}
.playlist-container .comment-wrap {
  margin-bottom: 120px;
}
.playlist-container .comment-wrap .title {
  font-size: 20px;
}
.playlist-container .comment-wrap .title .number {
  font-size: 18px;
  color: black;
}
.playlist-container .comments-wrap .item {
  display: flex;
  padding-top: 20px;
}
.playlist-container .comments-wrap .item .avatar {
  margin-right: 15px;
}
.playlist-container .comments-wrap .item .avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.playlist-container .comments-wrap .item:not(:last-child) .content-wrap {
  border-bottom: 1px #f2f2f1 solid;
}
.playlist-container .comments-wrap .item .time {
  color: #bebebe;
  font-size: 14px;
}
.playlist-container .comments-wrap .item .time .icon-zan {
  float: right;
  font-size: 16px;
}
.playlist-container .comments-wrap .item .content-wrap {
  flex: 1;
  padding-bottom: 16px;
}
.playlist-container .comments-wrap .item .name {
  color: #517eaf;
  font-size: 14px;
}
.playlist-container .comments-wrap .item .comment {
  font-size: 14px;
}
.playlist-container .comments-wrap .item .content-wrap .content,
.playlist-container .comments-wrap .item .content-wrap .reply {
  margin-bottom: 10px;
}
.playlist-container .comments-wrap .item .content-wrap .reply {
  padding: 10px;
  background-color: #e6e5e6;
  border-radius: 5px;
}
.el-pagination {
  margin-top: -80px;
  text-align: center;
}
</style>