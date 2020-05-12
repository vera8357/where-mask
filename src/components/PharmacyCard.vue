<template>
  <div>
    <div
      class="store-wrap"
      v-for="(item, index) in data"
      :key="index"
    >
      <h3>{{item.properties.name}}<span @click="googleUrl(item.properties.address)"><i class="fas fa-link"></i></span></h3>
      <div>
        <span
          class="mask-num"
          :class="{'mask-safety': item.properties.mask_adult > 200,'mask-danger':item.properties.mask_adult<=200}"
        >
          <p>成人口罩</p>
          <b>{{item.properties.mask_adult}}</b>/片
        </span>
        <span
          class="mask-num"
          :class="{'mask-safety': item.properties.mask_child > 200,'mask-danger':item.properties.mask_child<=200}"
        >
          <p>小孩口罩</p>
          <b>{{item.properties.mask_child}}</b>/片
        </span>
      </div>
      <p>{{item.properties.phone}}</p>
      <p>{{item.properties.address}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
  methods: {
    googleUrl (addres) {
      window.open(`https://www.google.com.tw/maps/place/${addres}`, '_blank')
    }
  }
}
</script>
