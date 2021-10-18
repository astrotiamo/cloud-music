import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios/http.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 音乐列表信息 默认歌曲
    audioInfo: [
      {
        id: 132853463,
        src: 'http://m801.music.126.net/20211013223032/0e7ed35b95cdb0f01e6759c6bc35301d/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/11117380680/383b/21f5/81ad/717c2105987a97ce1be2101d45ba8a8a.mp3',
        pic: 'https://p1.music.126.net/-B90Tai_z3RWk0uV1knpOg==/109951166362724771.jpg',
        lrc:
          "[00:00.000] 作词 : 李泊龙\n[00:01.000] 作曲 : 李泊龙\n[00:02.139]找到你\n[00:03.888]制作人：史小鹏\n[00:06.389]编曲：史小鹏\n[00:08.390]钢琴 ：王耑\n[00:10.394]鼓：孟祥博\n[00:13.641]吉他：黄方 阿浩\n[00:16.891]bass：肖锐\n[00:20.389]和音：史小鹏 冷祥霖 胡鹏飞\n[00:22.889]混音：慕永杰\n[00:24.639]监制：李泊龙\n[00:27.399]像是经过一场旅行\n[00:32.395]此刻你的心情也无法言喻\n[00:40.147]爱是一场孤单游戏\n[00:45.389]我习惯的事情却渐渐忘记\n[00:52.643]记起曾经花园不放晴\n[00:58.152]一直追寻花凋落的意义\n[01:05.140]我为你醒在紫色的黎明\n[01:11.643]却独自守着床边看风景\n[01:24.577]你是否也会透过车窗看我心\n[01:26.826]想我此刻是抱着怎样的心情\n[01:30.076]我一直找寻那时给的真心\n[01:36.591]却看到曾经发光背后蓝眼睛\n[01:43.326]天空中坠的星\n[01:47.078]越发光越美丽\n[01:50.335]落在海平面漩涡中心\n[01:56.076]找到你\n[02:11.076]像是经过一场旅行\n[02:16.077]此刻你的心情也无法言喻\n[02:24.076]爱是一场孤单游戏\n[02:29.077]我习惯的事情却渐渐忘记\n[02:35.838]记起曾经你的不犹豫\n[02:43.337]一直追寻你离开的原因\n[02:48.827]我为你醒在紫色的黎明\n[02:55.326]却独自守着床边看风景\n[03:01.582]你是否也会透过车窗看我心\n[03:08.077]想我此刻是抱着怎样的心情\n[03:13.838]我一直找寻那时给的真心\n[03:20.579]却看到曾经发光背后蓝眼睛\n[03:26.826]天空中坠的星\n[03:31.078]越发光越美丽\n[03:34.576]落在海平面漩涡中心\n[03:40.078]找到你\n[03:57.327]我为你醒在紫色的黎明\n[04:03.585]却独自守着床边看风景\n[04:09.585]你是否也会透过车窗看我心\n[04:16.329]想我此刻是抱着怎样的心情\n[04:22.077]我一直找寻那时给的真心\n[04:28.576]却看到曾经发光背后蓝眼睛\n[04:35.078]天空中坠的星\n[04:39.328]越发光越美丽\n[04:42.583]落在海平面漩涡中心\n[04:47.835]找到你\n",
        theme: '#f56c6c',
        title: '找到你',
        artist: '林孝生',
      },
    ]
  },
  mutations: {  //commit 提交mutations同步操作
    // 插入到音乐列表
    updateAudioInfo(state, payload) {
      // 过滤重复的
      state.audioInfo = state.audioInfo.filter(item => item.id != payload.id)
      state.audioInfo.push(payload)
      console.log(state.audioInfo);
    },
    // 插入到最前面
    insertAudioInfo(state, payload) {
      // 过滤重复的
      state.audioInfo = state.audioInfo.filter(item => item.id != payload.id)
      // 插入到前面
      state.audioInfo.unshift(payload)
      console.log(state.audioInfo);
    },
    // 清空播放列表
    clear(state) {
      state.audioInfo = []
    }
  },
  // actions中不能修改state中的数据，要通过mutations中的事件进行修改
  actions: {  //dispatch 分发actions的异步操作
    // 获取歌曲的url  默认第一个参数是context，其值是复制的一份本地store
    fetchMusicUrl(context, id) {
      return new Promise((resolve, reject) => {
        axios.get(`/song/url?id=${id}`).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    },
    // 获取歌曲的信息
    fetchMusicDetail(context, id) {
      return new Promise((resolve, reject) => {
        axios.get(`/song/detail?ids=${id}`).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    },
    // 获取歌曲的歌词
    fetchMusicLyric(context, id) {
      return new Promise((resolve, reject) => {
        axios.get(`/lyric?id=${id}`).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    },

    // 获取歌曲信息
    async getAudioInfo(context, payload) {
      console.log('payload:' + payload);
      // 外部调用函数时传递一个对象，对象有两个属性，一个是id，另一个是isInsert，是否插入
      // payload:{
      //   id:id,
      //   isInsert:true || false
      // }
      let result = {}
      Promise.all([
        // 三个Promise实例
        // 相当于外部:this.$store.dispatch('fetchMusicUrl', payload.id)
        context.dispatch('fetchMusicUrl', payload.id),
        context.dispatch('fetchMusicDetail', payload.id),
        context.dispatch('fetchMusicLyric', payload.id)
      ]).then(res => {
        console.log(res);
        // id区分音频
        result.id = payload.id
        // 音乐地址
        result.src = res[0].data.data[0].url || false
        // 音乐标题
        result.title = res[1].data.songs[0].name || false
        // 歌手
        result.artist = res[1].data.songs[0].ar[0].name || false
        // 封面
        result.pic = res[1].data.songs[0].al.picUrl || false
        // 歌词
        result.lrc = res[2].data.lrc ? res[2].data.lrc.lyric : null
        // 主题
        result.theme = '#f56c6c'

        if (payload.isInsert) {
          // 插入到最前面
          context.commit('insertAudioInfo', result)
        } else {
          // 追加到后面
          context.commit('updateAudioInfo', result)
        }
      }, err => {
        console.log(err);
      })
    }
  },
})