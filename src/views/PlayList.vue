<template>
  <div class="playlist-container">
    <!-- 头部信息 -->
    <div class="top-wrap">
      <!-- 图片区域 -->
      <div class="img-wrap">
        <img v-lazy="playList.coverImgUrl" class="border-radius" />
        <div class="play-count iconfont icon-play">
          {{ playList.playCount | ellipsisPlayCount }}
        </div>
      </div>
      <!-- 信息区域 -->
      <div class="info-wrap">
        <!-- 歌单名称 -->
        <p class="main-title">{{ playList.name }}</p>
        <!-- 用户信息 -->
        <div class="creator-wrap">
          <!-- 头像 -->
          <img v-lazy="playList.creator.avatarUrl" class="avatar" />
          <!-- 名称 -->
          <span class="name">{{ playList.creator.nickname }}</span>
          <!-- 创建时间 -->
          <span class="time"
            >{{ playList.updateTime | localeTimeString }}更新</span
          >
        </div>
        <!-- 播放 -->
        <div class="play-wrap">
          <el-tooltip
            class="item"
            effect="dark"
            content="替换播放列表"
            placement="bottom"
          >
            <span class="text iconfont icon-circle-play">播放全部</span>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="添加到播放列表"
            placement="right"
          >
            <span class="add-playlist iconfont icon-add"></span>
          </el-tooltip>
        </div>
        <!-- 标签 -->
        <div class="tag-wrap">
          <span class="title">标签：</span>
          <ul>
            <li v-for="(item, index) in playList.tags" :key="index">
              {{ item }}
            </li>
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
            <span class="desc">{{
              playList.description || playList.name
            }}</span>
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
              <td class="index">{{ index + 1 }}</td>
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
                  <span class="title">{{ item.name }}</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="添加到播放列表"
                    :enterable="false"
                    placement="bottom"
                  >
                    <span
                      class="iconfont icon-add"
                      @click="playMusic(item.id, item.name, false)"
                    ></span>
                  </el-tooltip>
                  <span
                    class="iconfont icon-mv-line"
                    v-if="item.mvid"
                    @click="playMv(item.mvid)"
                  ></span>
                </div>
              </td>
              <!-- 歌手 -->
              <td>{{ item.ar[0].name }}</td>
              <!-- 专辑 -->
              <td>{{ item.al.name }}</td>
              <!-- 时长 -->
              <td>{{ item.dt | formatDuration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>

      <el-tab-pane :label="'评论(' + commentInfo.total + ')'" name="2">
        <!-- 热评区 -->
        <div class="comment-wrap" v-if="commentInfo.hotComments">
          <p class="title">
            精彩评论
            <span>{{ `(${commentInfo.hotComments.length})` }}</span>
          </p>
          <div class="comments-wrap">
            <div
              class="item"
              v-for="(item, index) in commentInfo.hotComments"
              :key="index"
            >
              <!-- 评论者头像 -->
              <div class="avatar">
                <img v-lazy="item.user.avatarUrl" />
              </div>
              <div class="content-wrap">
                <!-- 评论者区 -->
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <!-- 回复区 -->
                <div class="reply" v-if="item.beReplied[0]">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}：</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <!-- 时间 -->
                <div class="time">
                  <span>{{ item.time | localeTimeString }}</span>
                  <span class="iconfont icon-zan">{{ item.likedCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论区 -->
        <div class="comment-wrap" v-if="commentInfo.comments.length > 0">
          <p class="title">
            最新评论
            <span>{{ `(${commentInfo.total})` }}</span>
          </p>
          <div class="comments-wrap">
            <div
              class="item"
              v-for="(item, index) in commentInfo.comments"
              :key="index"
            >
              <div class="avatar">
                <img v-lazy="item.user.avatarUrl" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="reply" v-if="item.beReplied[0]">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}：</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="time">
                  <span>{{ item.time | localeTimeString }}</span>
                  <span class="iconfont icon-zan">{{ item.likedCount }}</span>
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
        creator: {},
      },
      // 此歌单的id
      id: "",
      // 当前默认el-tabs的选择项（歌曲列表）
      activeIndex: "1",
      // 获取评论信息所需的参数
      queryInfo: {
        limit: 10,
        // 页码
        page: 0,
      },
      // 评论信息
      commentInfo: {
        comments: [],
        hotComments: [],
        total: 0,
      },
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
      // console.log(this.playList);
    },
    // 获取评论信息
    async fetchMusicComments(id, limit, offset = 0) {
      const res = await this.$http.get(`/comment/playlist`, {
        params: {
          id,
          // 默认每页十条评论
          limit,
          offset,
        },
      });
      this.commentInfo = res.data;
      // console.log(this.commentInfo);

      if (offset > 0) {
        this.commentInfo.comments = res.data.comments;
      } else {
        let newData = {
          comments: res.data.comments,
          total: res.data.total,
        };
        if (
          res.data.hotComments.length !== 0 ||
          res.data.topComments.length !== 0
        ) {
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
        isInsert: insert,
      });
      if (insert) {
        // 子传父 发射事件
        insert && this.$Bus.$emit("play");
        this.$notify({
          title: "开始播放：" + name,
          offset: 50,
        });
      } else {
        this.$notify({
          title: "已添加到播放列表",
          offset: 50,
        });
      }
    },
    // 播放mv
    playMv(id) {
      this.$router.push(`/mv?id=${id}`);
    },
    // 评论条数改变
    sizeChange(newSize) {
      this.queryInfo.limit = newSize;
      this.fetchMusicComments(
        this.id,
        this.queryInfo.limit,
        (this.queryInfo.page - 1) * this.queryInfo.limit
      );
    },
    // 页码改变
    currentPageChange(newPage) {
      this.queryInfo.page = newPage;
      this.fetchMusicComments(
        this.id,
        this.queryInfo.limit,
        (this.queryInfo.page - 1) * this.queryInfo.limit
      );
    },
  },
};
</script>

<style lang="less">
.playlist-container {
  margin: 0 auto;
  .top-wrap {
    display: flex;
    .main-title {
      font-size: 22px;
      margin-bottom: 10px;
    }
    .img-wrap {
      margin-right: 30px;
      position: relative;
      img {
        width: 230px;
        height: 230px;
      }
      .border-radius {
        border-radius: 15px;
      }
      .play-count {
        position: absolute;
        top: 5px;
        right: 10px;
        color: white;
      }
    }
    .info-wrap {
      position: relative;
      .title {
        margin-bottom: 20px;
      }
      .creator-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .name {
          margin-right: 10px;
        }
        .time {
          font-size: 14px;
        }
      }
      .play-wrap {
        width: 130px;
        height: 35px;
        border-radius: 4px;
        background: linear-gradient(to right, #e85e4d, #c6483c);
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 25px;
        user-select: none;
        span {
          color: white;
          &.text {
            font-size: 15px;
            &.add-playlist {
              margin: 0;
              padding-left: 5px;
              border-left: 2px solid;
              height: 100%;
              line-height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          &.add-playlist {
            margin: 0;
            padding-left: 5px;
            border-left: 2px solid;
            height: 100%;
            line-height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .tag-wrap {
        display: flex;
        margin-bottom: 15px;
        span {
          margin: 0;
        }
        ul {
          display: flex;
          align-items: center;
        }
        li {
          font-size: 14px;
          &:not(:last-child)::after {
            content: "/";
            margin: 0 4px;
          }
        }
      }
      .desc-wrap {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        span {
          &:last-child {
            font-size: 15px;
          }
        }
      }
      .desc-wrap1 {
        -webkit-line-clamp: 5;
      }
    }
  }
  .el-tabs {
    margin-bottom: 100px;
  }
  .el-table {
    border-bottom: none !important;
    border-collapse: collapse;
    tbody {
      border-bottom: none;
    }
    &.playlist-table {
      .index {
        text-align: center;
      }
      th {
        font-weight: normal;
        &:first-child {
          width: 50px;
        }
        &:nth-child(2) {
          width: 130px;
        }
        &:nth-child(3) {
          width: 300px;
        }
        &:nth-child(4) {
          width: 200px;
        }
      }
      tr {
        &:nth-child(2n) {
          background-color: #fafafa;
        }
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
    .img-wrap {
      position: relative;
      margin: 0 auto;
      margin-top: 2px;
      width: 70px;
      height: 70px;
      img {
        width: 65px;
        height: 65px;
        border-radius: 5px;
      }
      .icon-play {
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
      &:hover .icon-play {
        opacity: 1;
      }
    }
    .song-wrap {
      margin-left: 26px;
      display: flex;
      /* justify-content: center; */
      align-items: center;
      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .icon-add {
        color: #ee0000;
        border: 1px solid #ee0000;
        margin-left: 4px;
      }
      .icon-mv-line {
        padding-left: 5px;
        color: #ee0000;
      }
    }
  }
  .comment-wrap {
    margin-bottom: 40px;
    .title {
      font-size: 20px;
      .number {
        font-size: 18px;
        color: black;
      }
    }
    .item {
      display: flex;
      padding-top: 20px;
      .avatar {
        margin-right: 15px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }
      &:not(:last-child) .content-wrap {
        border-bottom: 1px #f2f2f1 solid;
      }
      .time {
        color: #bebebe;
        font-size: 14px;
        .icon-zan {
          float: right;
          font-size: 16px;
        }
      }
      .content-wrap {
        flex: 1;
        padding-bottom: 16px;
        .content,
        .reply {
          margin-bottom: 10px;
        }
        .reply {
          padding: 10px;
          background-color: #e6e5e6;
          border-radius: 5px;
        }
      }
      .name {
        color: #517eaf;
        font-size: 14px;
      }
      .comment {
        font-size: 14px;
      }
    }
  }
}
.w-500 {
  max-width: 500px !important;
}
/* .playlist-container .el-table .song-wrap>span {
  margin-top: 20px;
  display: inline-block;
  color: #bebebe;
} */
.el-pagination {
  margin-top: -80px;
  text-align: center;
}
</style>