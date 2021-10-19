<template>
  <div class="mvs-container">
    <!-- 顶部tab-bar -->
    <div class="filter-wrap">
      <!-- 地区 -->
      <div class="section-wrap">
        <span class="section-type">地区：</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span :class="['title', {active: queryInfo.area == '全部'}]" @click="queryInfo.area = '全部'">全部</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.area == '内地'}]" @click="queryInfo.area = '内地'">内地</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.area == '港台'}]" @click="queryInfo.area = '港台'">港台</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.area == '欧美'}]" @click="queryInfo.area = '欧美'">欧美</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.area == '日本'}]" @click="queryInfo.area = '日本'">日本</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.area == '韩国'}]" @click="queryInfo.area = '韩国'">韩国</span>
          </li>
        </ul>
      </div>
      <!-- 类型 -->
      <div class="type-wrap">
        <span class="type">类型：</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span :class="['title', {active: queryInfo.type == '全部'}]" @click="queryInfo.type = '全部'">全部</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.type == '官方版'}]" @click="queryInfo.type = '官方版'">官方版</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.type == '原声'}]" @click="queryInfo.type = '原声'">原声</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.type == '现场版'}]" @click="queryInfo.type = '现场版'">现场版</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.type == '网易出品'}]" @click="queryInfo.type = '网易出品'">网易出品</span>
          </li>
        </ul>
      </div>
      <!-- 排序 -->
      <div class="order-wrap">
        <span class="order-type">排序：</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span :class="['title', {active: queryInfo.order == '上升最快'}]" @click="queryInfo.order = '上升最快'">上升最快</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.order == '最热'}]" @click="queryInfo.order = '最热'">最热</span>
          </li>
          <li class="tab">
            <span :class="['title', {active: queryInfo.order == '最新'}]" @click="queryInfo.order = '最新'">最新</span>
          </li>
        </ul>  
      </div>
    </div>

    <!-- 推荐mv -->
    <div class="mvs">
      <div class="items">
        <div class="item" v-for="(item, index) in mvList" :key="index" @click="toMv(item.id)">
          <!-- 封面 -->
          <div class="img-wrap"> 
            <img v-lazy="item.cover">
            <!-- 播放量 -->
            <div class="num-wrap">
              <span class="iconfont icon-play"></span>
              <div class="num">{{item.playCount | ellipsisPlayCount}}</div>
            </div>
          </div>
          <!-- 信息 -->
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="artist">{{item.artistName}}</div>
          </div>
        </div>
      </div>

      <!-- 分页器 -->
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginationForm.page"
        :page-sizes="[4, 8, 12, 16, 20, 40]"
        :page-size="paginationForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationForm.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mvs",
  data() {
    return {
      // 顶部tab-bar查询信息
      queryInfo: {
        area: "全部", // 可选：全部、内地、港台、欧美、日本、韩国、不填则为全部
        type: "全部", // 可选：全部、官方版、原生、现场版、网易出品,不填则为全部
        order: "上升最快" // 可选：上升最快、最热、最新、不填则为上升最快
      },
      // mv列表
      mvList: [],
      // 分页信息
      paginationForm: {
        total: 0,
        page: 1,
        limit: 8
      }
    };
  },
  created() {
    this.fetchMvs();
  },
  watch: {
    // 深度监听，可监听到对象、数组的变化
    queryInfo: {
      handler(val) {
        this.paginationForm = {
          total: 0,
          page: 0,
          limit: 8
        }
        this.queryInfo = val
        this.fetchMvs()
      },
      deep: true // 深度监听
    }
  },
  methods: {
    // 获取mv
    async fetchMvs() {
      const res = await this.$http.get("/mv/all", {
        params: {
          area: this.queryInfo.area,
          type: this.queryInfo.type,
          order: this.queryInfo.order,
          limit: this.paginationForm.limit,
          offset: (this.paginationForm.page - 1) * this.paginationForm.limit
        }
      });
      this.mvList = res.data.data;
      console.log(this.mvList);
      if(res.data.count) {
        this.paginationForm.total = res.data.count
      }
    },
    // 查看mv
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
    // 监听页容量变化
    handleSizeChange(newSize) {
      this.paginationForm.limit = newSize
      this.fetchMvs()
    },
    // 监听页码变化
    handleCurrentChange(newPage) {
      this.paginationForm.page = newPage
      // this.queryInfo.offset
      this.fetchMvs()
    }
  }
};
</script>

<style scoped>
.mvs-container {
  padding-top: 20px;
}
.mvs-container .filter-wrap>div {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  /* vertical-align: baseline; */
}
.mvs-container .filter-wrap>div span {
  font-size: 14px;
  height: 100%;
}
.mvs-container .filter-wrap>div span.title {
  margin: 20px;
  color: grey;
  cursor: pointer;
  padding: 5px 20px;
}
.mvs-container .filter-wrap>div span.title.active {
  color: #ee0000;
  background-color: #fcf6f5;
  border-radius: 20px;
}
.mvs-container .filter-wrap>div ul {
  display: flex;
}
.mvs-container .filter-wrap>div ul li:not(:last-child) {
  border-right: 1px solid #f2f2f1;
}
.mvs-container .mvs .items {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.mvs-container .mvs .items .item {
  width: 250px;
  cursor: pointer;
  margin-right: 25px;
  margin-bottom: 30px;
}
.mvs-container .mvs .items .item .img-wrap {
  width: 100%;
  height: 140px;
  position: relative;
}
.mvs-container .mvs .items .item .img-wrap img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.mvs-container .mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  display: flex;
  align-items: center;
  font-size: 15px;
  padding-right: 5px;
  padding-top: 2px;
}
.mvs-container .mvs .items .item .img-wrap .num-wrap .icon-play {
  font-size: 16px;
  display: flex;
  align-items: center;
  margin-right: 4px;
}
.mvs-container .mvs .items .item .info-wrap .name {
  overflow: hidden;
  text-overflow: ellipsis;
  /* display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; */
  white-space: nowrap;
  font-size: 15px;
}
.mvs-container .mvs .items .item .info-wrap .artist {
  font-size: 14px;
  color: #c5c5c5;
}
.mvs-container .el-pagination {
  text-align: center;
  margin-bottom: 100px;
}
</style>