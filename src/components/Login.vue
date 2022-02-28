<template>
  <div class="login-container">
    <!-- 登录窗口 -->
    <div class="loginBox" ref="loginBoxRef">
      <h2 @mousedown="moveLogin">
        <span>登录</span>
        <span @click="close">x</span>
      </h2>
      <!-- 二维码登录 -->
      <p v-show="qrShow" class="qrStatus">二维码不存在或已过期，请刷新</p>

      <div class="qr" v-if="toggle">
        <img :src="qr64" />
        <span class="iconfont icon-jiantou_zuoyouqiehuan" @click="togglePh"></span>
        <span class="iconfont icon-shuaxin" @click="refreshQr"></span>
      </div>

      <!-- 密码登录 -->
      <div class="login" v-else>
        <el-form :model="loginForm" :rules="loginRules" ref="loginRef" label-width="70px">
          <!-- prop: 表单域 model 字段 -->
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="loginForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              show-password
              @keydown.enter.native="loginBtn"
            ></el-input>
          </el-form-item>
          <div class="btn">
            <el-button type="primary" size="mini" @click="loginBtn">登录</el-button>
          </div>
          <span class="iconfont icon-erweima" @click="toggleQr"></span>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Vue from 'vue'
export default {
  name: "Login",
  props: ["ctrIsShow"],
  data() {
    // 验证手机规则
    var checkPhone = (rule, value, cb) => {
      // 验证手机号的正则
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };
    return {
      // 二维码状态信息
      qrShow: false,
      // 是否切换登录
      toggle: false,
      // 登录二维码 base64编码
      qr64: null,
      // 密码登录表单数据
      loginForm: {
        phone: null,
        password: ""
      },
      // 登录表单验证规则
      loginRules: {
        phone: [
          { required: true, message: "请填写手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          { min: 6, max: 15, message: "密码长度为6~15个字符", trigger: "blur" }
        ]
      },
      // 定时器对象
      time: null
    };
  },
  created() {
    this.fetchQrInfo();
  },
  methods: {
    // vuex mapMutations 相关处理函数
    ...mapMutations(["profileMutation"]),
    // 关闭
    close() {
      // 通过自定义事件向父组件传值
      this.$emit("ctrClose");
    },
    // 登录框的移动
    moveLogin(e) {
      // 获取登录框元素
      let box = this.$refs.loginBoxRef;
      // 计算鼠标相对位置
      let disX = e.clientX - box.offsetLeft;
      let disY = e.clientY - box.offsetTop;
      document.onmousemove = e => {
        // 登录框元素跟随鼠标移动而移动
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        box.style.left = left + "px";
        box.style.top = top + "px";
      };
      document.onmouseup = e => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    // 登录成功的操作
    loginSuccess(res) {
      this.close();
      // 将用户信息存储到vuex中
      let profile = {
        nickname: res.data.profile.nickname,
        avatarUrl: res.data.profile.avatarUrl,
        userId: res.data.profile.userId
      };
      this.profileMutation(profile);
      // 将用户信息存储到sessionStorage
      window.sessionStorage.setItem("profile", JSON.stringify(profile));
      // console.log(window.sessionStorage);
      this.$emit("ctrLoginBtn");
      return this.$message.success("登录成功");
    },
    // 获取二维码信息并检测状态 调用接口时带上时间戳，防止缓存
    async fetchQrInfo() {
      const res = await this.$http.get(
        `/login/qr/key?timerstamp=${Date.now()}`,
        {
          withCredentials: true
        }
      );
      const unikey = res.data.data.unikey;
      const result = await this.$http.get(
        `/login/qr/create?key=${unikey}&qrimg=66&timerstamp=${Date.now()}`,
        {
          withCredentials: true
        }
      );
      // console.log(result);
      this.qr64 = result.data.data.qrimg;
      // console.log(this.qr64);
      // 设置定时器，定时检测二维码是否仍然有效
      let that = this
      this.time = setInterval(async () => {
        const result1 = await that.$http.get(
          `/login/qr/check?key=${unikey}&timerstamp=${Date.now()}`,
          {
            withCredentials: true
          }
        );
        // console.log(result1);
        if (result1.data.code == 800) {
          that.qrShow = true;
        }
        if (result1.data.code == 803) {
          const resultStatus = await that.$http.get(
            `/login/status?timerstamp=${Date.now()}`,
            {
              withCredentials: true
            }
          );
          // console.log(resultStatus);
          that.loginSuccess(resultStatus.data);
          clearInterval(that.time)
        }
      }, 30000);
    },
    // 获取登录信息
    async fetchLoginInfo() {
      // 发送登录请求
      const res = await this.$http.get("/login/cellphone", {
        params: {
          phone: this.loginForm.phone,
          md5_password: this.$md5(this.loginForm.password)
        }
      });
      clearInterval(this.time)
      console.log(res);
      if (res.data.code != 200) {
        return this.$message.error("登录失败");
      } else if (res.data.code == 200) {
        this.loginSuccess(res);
      }
    },
    // 手机号密码登录
    loginBtn() {
      // 请求前进行表单预验证
      this.$refs.loginRef.validate(valid => {
        if (!valid) {
          return this.$message.info("手机号或密码位数不正确");
        }
        this.fetchLoginInfo();
      });
    },
    // 切换到二维码登录
    toggleQr() {
      this.toggle = true;
      // this.qrShow = true
      // 获取二维码登录信息
      this.fetchQrInfo();
    },
    // 切换到手机号登录
    togglePh() {
      this.toggle = false;
      this.qrShow = false;
    },
    // 点击刷新按钮刷新二维码
    refreshQr() {
      this.fetchQrInfo();
    }
  }
};
</script>

<style scoped>
* {
  transition: 0s;
}
.login-container .loginBox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
  width: 500px;
  height: 350px;
  background-color: #fff;
  box-shadow: 0 0 1px;
}
.login-container .loginBox h2 {
  position: relative;
  background-color: #2d2d2d;
  cursor: move;
}
.login-container .loginBox h2::after {
  content: "";
  display: block;
  clear: both;
}
.login-container .loginBox h2 span:first-child {
  float: left;
  height: 16px;
  margin: 15px 20px;
  font-size: 16px;
  font-weight: normal;
  color: #fff;
}
.login-container .loginBox h2 span:last-child {
  position: absolute;
  top: 8px;
  right: 20px;
  color: #888;
  font-size: 25px;
  cursor: pointer;
}
.login-container .loginBox .el-form {
  margin: 40px 40px;
}
.login-container .loginBox .el-form .el-form-item {
  width: 400px;
  margin-bottom: 40px;
}
.login-container .loginBox .el-form .btn {
  float: right;
}
.login-container .loginBox .el-form span {
  position: absolute;
  bottom: 30px;
  right: 50px;
  font-size: 30px;
  cursor: pointer;
}
.login-container .loginBox .qr {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.5);
}
.login-container .loginBox .qr img {
  width: 160px;
  height: 160px;
}
.login-container .loginBox .qr .icon-jiantou_zuoyouqiehuan {
  cursor: pointer;
  position: absolute;
  top: 95%;
  right: 5%;
}
.login-container .loginBox .qr .icon-shuaxin {
  position: absolute;
  top: 95%;
  left: 5%;
  cursor: pointer;
}
.login-container .loginBox .qrStatus {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5px;
  font-size: 5px;
  color: #888;
}
</style>