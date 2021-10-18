export default {
  filters: {
    // 播放量
    ellipsisPlayCount(val) {
      if(val < 100000) {
        return val
      } else {
        return parseInt(val/10000) + '万'
      }
    },
    // 时间处理
    localeTimeString(dateTime) {
      if(!dateTime) {
        return ''
      }
      let newDateTime = new Date(dateTime)
      return newDateTime.toLocaleString()
    },
    // 播放时间处理
    formatDuration(duration) {
      let minute = Math.floor(duration / 1000 / 60).toString().padStart(2, '0')
      let second = Math.floor(duration % 60).toString().padStart(2, '0')
      return minute + ':' + second
    }
  }
}