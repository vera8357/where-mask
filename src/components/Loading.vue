<template>
  <div class="mask-img" v-if="data === true">
    <div>
      <ul>
        <li class="loading-1"></li>
        <li class="loading-2"></li>
        <li class="loading-3"></li>
      </ul>
      <div class="loading-img">
        <img src="../assets/img/maskinfo.jpg" alt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data']
}
</script>

<style lang="scss">
.mask-img {
  width: 100%;
  height: 100%;
  background-color: rgba(180, 180, 180, 0.6);
  position: absolute;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  ul {
    text-align: center;
    width: 100%;
    height: 30px;
    li {
      width: 6px;
      height: 6px;
      display: inline-block;
      border-radius: 50%;
      margin: 5px;
      &.loading-1 {
        background-color: rgba(204, 45, 125, 1);
        animation: loading 1.5s 0s linear infinite;
      }
      &.loading-2 {
        background-color: rgb(223, 138, 1);
        animation: loading 1.5s 0.3s linear infinite;
      }
      &.loading-3 {
        background-color: rgba(8, 111, 207, 1);
        animation: loading 1.5s 0.7s linear infinite;
      }
    }
  }
  .loading-img {
    width: 80%;
    margin: auto;
    img {
      width: 100%;
    }
  }
}

@keyframes loading {
  0% {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  50% {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
  100% {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
}
</style>
