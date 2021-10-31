<template>
  <div class="mv-container">
    <!-- mv与评论区域 -->
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>

      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="mvUrl"></video>
      </div>

      <!-- 信息区域 -->
      <div class="info-wrap">
        <!-- 歌手信息 -->
        <div class="artist-info">
          <!-- 图片 -->
          <div class="avatar-wrap">
            <img v-lazy="artistAvatarUrl">
          </div>
          <!-- 名称 -->
          <span class="name">{{mvDetail.artistName}}</span>
        </div>
        <!-- mv信息 -->
        <div class="mv-info">
          <h2 class="title">{{mvDetail.name}}</h2>
          <span class="date">发布：{{mvDetail.publishTime}}</span>
          <span class="number">播放：{{mvDetail.playCount}}</span>
          <p class="desc">{{mvDetail.desc}}</p>
        </div>
      </div>

      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="mvCommentInfo.isHotComment">
        <p class="title">
          精彩评论
          <span class="number">{{mvCommentInfo.hotComments.length}}</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in mvCommentInfo.hotComments" :key="index">
            <!-- 头像 -->
            <div class="avatar-wrap">
              <img v-lazy="item.user.avatarUrl">
            </div>
            <!-- 内容 -->
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{item.user.nickname}}：</span>
                <span class="comment">{{item.content}}</span>
              </div>
              <div class="date">
                {{item.time | localeTimeString}}
                <span class="iconfont icon-zan">{{item.likedCount}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最新评论 -->
      <div class="comment-wrap" v-if="mvCommentInfo.isComment">
        <p class="title">
          最新评论
          <span class="number">{{mvCommentInfo.total}}</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in mvCommentInfo.comments" :key="index">
            <div class="avatar-wrap">
              <img v-lazy="item.user.avatarUrl">
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{item.user.nickname}}</span>
                <span class="comment">{{item.content}}</span>
              </div>
              <div class="reply" v-if="item.beReplied[0]">
                <span class="name">{{item.beReplied[0].user.nickname}}</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">
                {{item.time | localeTimeString}}
                <span class="iconfont icon-zan">{{item.likedCount}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChange"
          @current-change="currentPageChange"
          :current-page="page"
          :page-sizes="[5, 10, 20, 30, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mvCommentInfo.total"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 相关推荐区 -->
    <div class="recommend-wrap">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="item" v-for="(item, index) in similarMv" :key="index" @click="toMv(item.id)">
          <div class="img-wrap">
            <img v-lazy="item.cover">
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <span class="iconfont icon-play"></span>
              <div class="num">{{item.playCount | ellipsisPlayCount}}</div>
            </div>
            <span class="time">{{item.duration | formatDuration}}</span>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="artistName">{{item.artistName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mv",
  data() {
    return {
      // 当前mv的id
      id: '',
      // mv信息
      mvUrl: '',
      // mv详情
      mvDetail: {},
      // 歌手头像
      artistAvatarUrl: '',
      // 评论信息
      mvCommentInfo: {
        // 是否有评论
        isComment: false,
        // 是否有热评
        isHotComment: false,
        // 评论总数
        total: 0,
        comments: [],
        hotComments: []
      },
      // 评论信息（分页）
      commentQueryInfo: {
        id: '',
        limit: 10,
        offset: 0
      },
      // 当前页数
      page: 0,
      // 相关推荐
      similarMv: []
    }
  },
  created() {
    this.id = this.$route.query.id
    this.commentQueryInfo.id = this.id
    this.fetchMvUrl(this.id)
    this.fetchMvDetail(this.id)
    this.fetchMvComment()
    this.fetchSimilarMvInfo(this.id)
  },
  methods: {
    // 获取mv地址
    async fetchMvUrl(id) {
      const res = await this.$http.get('/mv/url', {
        params: {
          id
        }
      })
      // console.log(res);
      this.mvUrl = res.data.data.url
    },
    // 获取mv数据
    async fetchMvDetail(id) {
      const res = await this.$http.get(`/mv/detail`, {
        params: {
          mvid: id
        }
      })
      console.log(res.data.data);
      this.mvDetail = res.data.data
      this.fetchArtistDetail(this.mvDetail.artists[0].id)
    },
    // 获取歌手数据
    async fetchArtistDetail(id) {
      const res = await this.$http.get('/artist/detail', {
        params: {
          id
        }
      })
      // console.log(res);
      this.artistAvatarUrl = res.data.data.artist.cover
    },
    // 获取mv评论信息
    async fetchMvComment() {
      const res = await this.$http.get('/comment/mv', {
        params: this.commentQueryInfo
      })
      console.log(res.data);
      // 是否显示最新评论
      if(res.data.comments.length > 0) {
        this.mvCommentInfo.isComment = true
      } else {
        this.mvCommentInfo.isComment = false
      }
      // 是否显示热评
      if(res.data.hotComments) {
        this.mvCommentInfo.isHotComment = true
      } else {
        this.mvCommentInfo.isHotComment = false
      }
      this.mvCommentInfo.total = res.data.total
      this.mvCommentInfo.comments = res.data.comments
      this.mvCommentInfo.hotComments = res.data.hotComments
    },
    // 获取相似mv数据
    async fetchSimilarMvInfo(id) {
      const res = await this.$http.get(`/simi/mv`, {
        params: {
          mvid: id
        }
      })
      this.similarMv = res.data.mvs
      console.log(this.similarMv);
    },
    // 点击类似mv重新渲染数据
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
      this.id = id
      this.commentQueryInfo.id = this.id
      this.fetchMvUrl(this.id)
      this.fetchMvDetail(this.id)
      this.fetchMvComment()
      this.fetchSimilarMvInfo(this.id)
    },
    // 监听页容量的改变
    sizeChange(newSize) {
      this.commentQueryInfo.limit = newSize
      this.fetchMvComment()
    },
    // 监听页码的改变
    currentPageChange(newPage) {
      this.page = newPage
      this.commentQueryInfo.offset = (this.page - 1) * this.commentQueryInfo.limit
      this.fetchMvComment()
    }
  }
}
</script>

<style scoped>
.mv-container {
  display: flex;
}
.mv-container .title {
  margin-bottom: 20px;
}
.mv-container .mv-wrap {
  width: 700px;
  margin-right: 35px;
}
.mv-container .mv-wrap .video-wrap {
  width: 100%;
  height: 390px;
  margin-bottom: 20px;
}
.mv-container .mv-wrap .video-wrap video {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  outline: none;
}
.mv-container .mv-wrap .info-wrap {
  margin-bottom: 50px;
}
.mv-container .mv-wrap .info-wrap .artist-info {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
}
.mv-container .mv-wrap .info-wrap .artist-info .avatar-wrap {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
}
.mv-container .mv-wrap .info-wrap .artist-info .avatar-wrap img {
  width: 100%;
  height: 100%;
}
.mv-container .mv-wrap .info-wrap .mv-info .title {
  font-size: 30px;
}
.mv-container .mv-wrap .info-wrap .mv-info .date {
  margin-right: 25px;
  color: #bebebe;
  font-size: 14px;
}
.mv-container .mv-wrap .info-wrap .mv-info .desc {
  font-size: 15px;
  margin-top: 20px;
}
.mv-container .mv-wrap .comment-wrap {
  margin-bottom: 70px;
}
.mv-container .mv-wrap .comment-wrap .title {
  font-size: 25px;
}
.mv-container .mv-wrap .comment-wrap .title .number {
  font-size: 20px;
}
.mv-container .mv-wrap .comments-wrap .item {
  display: flex;
  padding-top: 20px;
}
.mv-container .mv-wrap .comments-wrap .item .avatar-wrap {
  margin-right: 15px;
}
.mv-container .mv-wrap .comments-wrap .item .avatar-wrap img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.mv-container .mv-wrap .comments-wrap .item:not(:last-child) .content-wrap {
  border-bottom: 1px solid #f2f2f1;
}
.mv-container .mv-wrap .comments-wrap .item .content-wrap {
  padding-bottom: 20px;
  flex: 1;
}
.mv-container .mv-wrap .comments-wrap .item .content-wrap .name {
  color: #517eaf;
  font-size: 14px;
}
.mv-container .mv-wrap .comments-wrap .item .content-wrap .comment {
  font-size: 14px;
}
.mv-container .mv-wrap .comments-wrap .item .content-wrap .date {
  margin-top: 10px;
  font-size: 14px;
  color: #bebebe;
}
.mv-container .mv-wrap .comments-wrap .item .content-wrap .date .icon-zan {
  float: right;
}
.mv-container .mv-wrap .comment-wrap .item .content-wrap .content,
.mv-container .mv-wrap .comment-wrap .item .content-wrap .reply {
  margin-bottom: 10px;
}
.mv-container .mv-wrap .comment-wrap .item .content-wrap .reply {
  padding: 10px;
  background-color: #e6e5e6;
  border-radius: 5px;
}
.mv-container .el-pagination {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 80px;
}
.mv-container .recommend-wrap {
  flex: 1;
}
.mv-container .recommend-wrap .mvs {
  display: flex;
  flex-wrap: wrap;
}
.mv-container .recommend-wrap .mvs .item {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
}
.mv-container .recommend-wrap .mvs .item:hover {
  background-color: #f5f5f5;
}
.mv-container .recommend-wrap .mvs .item .img-wrap {
  width: 180px;
  position: relative;
  margin-right: 10px;
}
.mv-container .recommend-wrap .mvs .item .img-wrap img {
  width: 100%;
  border-radius: 5px;
}
.mv-container .recommend-wrap .mvs .item .img-wrap>.icon-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ee0000;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
}
.mv-container .recommend-wrap .mvs .item .img-wrap:hover>.icon-play {
  opacity: 1;
}
.mv-container .recommend-wrap .mvs .item .img-wrap .num-wrap {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  padding-right: 5px;
}
.mv-container .recommend-wrap .mvs .item .img-wrap .num-wrap .icon-play {
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 4px;
}
.mv-container .recommend-wrap .mvs .item .img-wrap .time {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: white;
  font-size: 15px;
}
.mv-container .recommend-wrap .mvs .item .info-wrap {
  flex: 1;
}
.mv-container .recommend-wrap .mvs .item .info-wrap .name {
  font-size: 15px;
}
.mv-container .recommend-wrap .mvs .item .info-wrap .artistName {
  font-size: 14px;
  color: #c5c5c5;
}
</style>