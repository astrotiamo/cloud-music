import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import mixins from './utils/mixin'

// 全局混入
Vue.mixin(mixins)

// 导入图片懒加载lazyload
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: import('./assets/img/error.svg'), //加载失败显示的图片
  loading: require('./assets/img/loadding.svg'), // 加载中显示的图片
  attempt: 3, 
  // listenEvents: [ 'scroll' ]
})

//导入Aplayer
// import APlayer from '@moefe/vue-aplayer'
// Vue.use(APlayer)

// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 导入iconfont
import './assets/css/index.css'
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false

// 导入http
import http from '../src/axios/http'
Vue.prototype.$http = http

Vue.prototype.$Bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
