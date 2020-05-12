<template>
  <div class="msg-prompt" :class="{'d-none' : item.msgDisplay}" @click="msgDisplay">
    <div class="msg-content">
      <h2>{{item.county}}—{{item.area}}</h2>
      <p>此區域沒有藥局資訊</p>
      <a @click.prevent="msgDisplay">關閉</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  methods: {
    msgDisplay: function () {
      this.$emit('updateMaskModel')
    }
  }
}
</script>
