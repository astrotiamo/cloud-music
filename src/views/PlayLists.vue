<template>
  <div class="playlists-container">
    <!-- 歌单推荐区域 -->
    <div class="top-card">
      <!-- 封面 -->
      <div class="icon-wrap">
        <img v-lazy="topList.coverImgUrl" />
      </div>
      <!-- 内容区 -->
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <!-- 标题 -->
        <div class="title">{{topList.name}}</div>
        <!-- 介绍 -->
        <div class="info">{{topList.description}}</div>
      </div>
      <!-- 歌单背景 -->
      <img v-lazy="topList.coverImgUrl" class="bg" />
      <div class="bg-mask"></div>
    </div>

    <!-- 标签栏及其内容区域 -->
    <div class="tab-container">
      <!-- 顶部tab栏 -->
      <div class="tab-bar">
        <span :class="['item', {active: selected == '全部'}]" @click="selected = '全部'">全部</span>
        <span :class="['item', {active: selected == '欧美'}]" @click="selected = '欧美'">欧美</span>
        <span :class="['item', {active: selected == '华语'}]" @click="selected = '华语'">华语</span>
        <span :class="['item', {active: selected == '流行'}]" @click="selected = '流行'">流行</span>
        <span :class="['item', {active: selected == '说唱'}]" @click="selected = '说唱'">说唱</span>
        <span :class="['item', {active: selected == '摇滚'}]" @click="selected = '摇滚'">摇滚</span>
        <span :class="['item', {active: selected == '民谣'}]" @click="selected = '民谣'">民谣</span>
        <span :class="['item', {active: selected == '电子'}]" @click="selected = '电子'">电子</span>
        <span :class="['item', {active: selected == '轻音乐'}]" @click="selected = '轻音乐'">轻音乐</span>
        <span :class="['item', {active: selected == '影视原声'}]" @click="selected = '影视原声'">影视原声</span>
        <span :class="['item', {active: selected == 'ACG'}]" @click="selected = 'ACG'">ACG</span>
        <span :class="['item', {active: selected == '怀旧'}]" @click="selected = '怀旧'">怀旧</span>
      </div>
      <!-- tab内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div
            class="item"
            v-for="(item, index) in list"
            :key="index"
            @click="toPlayListDetail(item.id)"
          >
            <div class="img-wrap">
              <div class="number-wrap">
                <span class="number">播放量：{{item.playCount | ellipsisPlayCount}}</span>
              </div>
              <img v-lazy="item.coverImgUrl" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 
      分页器
      total 总条数
      current-page  当前页
      page-size 每页多少条数据
    -->
    <el-pagination
      class="pagination-bottom"
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginationForm.page"
      :page-sizes="[5, 10, 15, 20, 50]"
      :page-size="paginationForm.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paginationForm.total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "PlayLists",
  data() {
    return {
      // 顶部推荐歌单
      topList: {},
      // 当前选中的标签
      selected: "全部",
      // 歌单列表
      list: [],
      // 分页表
      paginationForm: {
        // 总条数
        total: 0,
        // 页码
        page: 0,
        // 页容量
        size: 10
      }
    };
  },
  watch: {
    // 监听tag标签改变的事件发生
    selected() {
      // 获取新的顶部推荐歌单
      this.fetchRecommendList(1, this.selected);
      // 获取新的歌单列表
      this.fetchList(10, this.selected);
    }
  },
  created() {
    // 获取顶部推荐歌单
    this.fetchRecommendList(1, "全部");
    // 获取歌单列表
    this.fetchList(10, "全部");
  },
  methods: {
    // 获取顶部推荐歌单
    async fetchRecommendList(limit, cat) {
      const res = await this.$http.get("/top/playlist/highquality", {
        params: {
          limit,
          cat
        }
      });
      this.topList = res.data.playlists[0];
    },
    // 获取歌单列表
    async fetchList(limit, cat, offset = 0) {
      const res = await this.$http.get("/top/playlist", {
        params: {
          limit,
          offset,
          cat
        }
      });
      this.paginationForm.total = res.data.total;
      this.list = res.data.playlists;
    },
    // 跳转歌单详情页
    toPlayListDetail(id) {
      this.$router.push(`playlist?id=${id}`);
    },
    // 当前页码发生改变
    handleCurrentChange(val) {
      this.paginationForm.page = val
      this.fetchList(this.paginationForm.size, this.selected, ((this.paginationForm.page-1)*this.paginationForm.size))
    },
    // 页容量改变
    handleSizeChange(val) {
      this.paginationForm.size = val
      this.fetchList(this.paginationForm.size, this.selected, ((this.paginationForm.page-1)*this.paginationForm.size))
    }
  }
};
</script>

<style scoped>
.top-card {
  padding: 20px;
  height: 200px;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}
.top-card .icon-wrap {
  margin-right: 20px;
}
.top-card .icon-wrap img {
  width: 160px;
  height: 160px;
}
.top-card .content-wrap .tag {
  color: #dfac67;
  border: 1px solid #dfac67;
  width: 100px;
  height: 30px;
  text-align: center;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
}
.top-card .content-wrap .title {
  color: white;
  padding-top: 10px;
}
.top-card .content-wrap .info {
  color: #888482;
  font-size: 14px;
  padding-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}
.top-card .bg {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  filter: blur(20px); /* 模糊度 */
}
.top-card .bg-mask {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
.tab-container {
  padding-top: 30px;
  /* margin-bottom: 60px; */
}
.tab-container .tab-bar {
  display: flex;
  justify-content: flex-end;
}
.tab-container .tab-bar .item {
  font-size: 15px;
  color: grey;
  margin-right: 20px;
  cursor: pointer;
}
.tab-container .tab-bar .active {
  color: #ee0000;
}
.tab-container .tab-content {
  margin-top: 20px;
}
.tab-container .tab-content .items {
  display: flex;
  flex-wrap: wrap;
}
.tab-container .tab-content .items .item {
  width: 200px;
  margin: 10px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.tab-container .tab-content .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}
.tab-container .tab-content .items .item .number-wrap {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  color: white;
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding-left: 5px;
  background-color: rgba(0, 0, 0, 0.2);
  top: -30px;
}
.tab-container .tab-content .items .item:hover .number-wrap {
  top: 0;
}
.tab-container .tab-content .items .item .img-wrap {
  position: relative;
}
.tab-container .tab-content .items .item .img-wrap .icon-play {
  position: absolute;
  right: 10px;
  bottom: 13px;
  color: #ee0000;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
}
.tab-container .tab-content .items .item .img-wrap:hover .icon-play {
  opacity: 1;
}
.tab-container .tab-content .items .item .name {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.pagination-bottom {
  margin-top: 20px;
  margin-bottom: 80px;
  text-align: center;
}
</style>