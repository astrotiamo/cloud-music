<template>
  <div class="userInfoBox">
    <div class="sanjiao"></div>
    <div>
      <slot name="level"></slot>
    </div>
    <div>
      <slot name="listenSongs"></slot>
    </div>
    <div>
      <slot name="createDays"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserInfo"
}
</script>

<style>
.userInfoBox {
  position: absolute;
  z-index: 1000;
  left: 75%;
  top: 46px;
  width: 200px;
  background-color: rgb(245, 245, 245);
  box-shadow: 0 0 2px;
}
.userInfoBox .sanjiao {
  position: absolute;
  z-index: 1001;
  left: 15%;
  top: -60px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-bottom-color: rgba(rgb(13, 12, 14), .1);
}
.userInfoBox div {
  margin: 40px 15px;
  color: #000;
  font-size: 14px;
  font-weight: 600;
}
</style>