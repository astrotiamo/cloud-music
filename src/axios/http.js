import axios from 'axios'
import Vue from 'vue' 

const http = axios.create({
  // baseURL: 'https://autumnfish.cn/'
  baseURL: 'http://localhost:3000' //静态接口地址
})

export default http