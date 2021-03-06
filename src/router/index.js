import Vue from 'vue'
import VueRouter from 'vue-router'

const Discovery = () => import('../views/Discovery')
const PlayLists = () => import('../views/PlayLists')
const PlayList = () => import('../views/PlayList')
const Songs = () => import('../views/Songs')
const Mvs = () => import('../views/Mvs')
const Mv = () => import('../views/Mv')
const Result = () => import('../views/Result')
const Artist = () => import('../views/Artist')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/discovery'
  },
  {
    path: '/discovery',
    component: Discovery
  },
  {
    path: '/playlists',
    component: PlayLists
  },
  {
    path: '/playlist',
    component: PlayList
  },
  {
    path: '/songs',
    component: Songs
  },
  {
    path: '/mvs',
    component: Mvs
  },
  {
    path: '/mv',
    component: Mv
  },
  {
    path: '/result',
    component: Result
  },
  {
    path: '/artist',
    component: Artist
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
