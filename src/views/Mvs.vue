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
      <div></div>
      <!-- 排序 -->
      <div></div>
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
        page: 0,
        limit: 8
      }
    };
  },
  created() {
    this.fetchMvs();
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
          // offset: (this.paginationForm.page - 1) * this.paginationForm.limit
          // offset: this.paginationForm.page
        }
      });
      this.mvList = res.data;
      if(res.data.count) {
        this.paginationForm.total = res.data.count
      }
    }
  }
};
</script>

<style scoped>
.mvs-container {
  padding-top: 20px;
}
</style>