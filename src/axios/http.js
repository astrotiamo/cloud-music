import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000' //静态接口地址
})

export default http