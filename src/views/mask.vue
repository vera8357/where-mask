<template>
  <div class="wrap-flex">
    <div class="region-wrap">
      <div class="region-selsec">
        <div class="county">
          <select name="county" v-model="select.county" @change="updatedArea">
            <option :value="item.CityName" v-for="(item, key) in countySelect" :key="key">{{item.CityName}}</option>
          </select>
        </div>
        <div class="area">
          <select name="area" v-model="select.area">
            <option :value="item" v-for="(item, index) in areaSelect" :key="index">{{item}}</option>
          </select>
        </div>
        <div class="search-wrap">
          <button @click="updatedPharmacy(false)">搜尋</button>
          <div class="reload">
            <span>資訊更新時間：{{nowTime}}</span><a href="#" @click="updatePharmacyAll">重整</a>
          </div>
        </div>
      </div>
      <div class="store-data">
        <div class="store-wrap" v-for="(item, index) in CurrentlyPharmacy" :key="index" @click=googleUrl(item.properties.address)>
          <h3>{{item.properties.name}}</h3>
          <div>
            <span class="mask-num" :class="{'mask-safety': item.properties.mask_adult > 200,'mask-danger':item.properties.mask_adult<=200}">
              <p>成人口罩</p>
              <b>{{item.properties.mask_adult}}</b>/片
            </span>
            <span class="mask-num" :class="{'mask-safety': item.properties.mask_child > 200,'mask-danger':item.properties.mask_child<=200}">
              <p>小孩口罩</p>
              <b>{{item.properties.mask_child}}</b>/片
            </span>
          </div>
         <p>{{item.properties.phone}}</p>
         <p>{{item.properties.address}}</p>
        </div>
      </div>
    </div>
    <div class="mask-map">
      <div id="map"></div>
    </div>
    <div class="msg-prompt" :class="{'d-none' : magDisplay}" @click="magDisplay = true">
      <div class="msg-content">
        <h2>{{select.county}}—{{select.area}}</h2>
        <p>此區域沒有藥局資訊</p>
        <a @click.prevent="magDisplay = true">關閉</a>
      </div>
    </div>
  </div>
</template>

<script>
import countySelect from '../assets/CityCountyData.json'
import L from 'leaflet'
let maskMap = {}
export default {
  data () {
    return {
      nowTime: '',
      countySelect,
      areaSelect: [],
      pharmacyAll: {},
      CurrentlyPharmacy: [],
      select: {
        county: '臺北市',
        area: ''
      },
      magDisplay: true
    }
  },
  methods: {
    googleUrl (addres) {
       window.open(`https://www.google.com.tw/maps/place/${addres}`, '_blank');
    },
        getNowTime () {
      var now = new Date()
      var H = now.getHours() + '：'
      var M = now.getMinutes() + '：'
      var S = now.getSeconds()
      this.nowTime = H + M + S
    },
    updatePharmacyAll () {
      let vm = this
      const url = `https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json`
      this.$http.get(url).then(res => {
        vm.pharmacyAll = res.data.features
        this.getNowTime()
        this.updatedPharmacy(true)
      })
    },
    updatedArea () {
      let vm = this
      vm.areaSelect = []
      vm.countySelect.forEach(item => {
        if (item.CityName === vm.select.county) {
          item.AreaList.forEach(data => {
            vm.areaSelect.push(data.AreaName)
          })
        }
      })
      vm.select.area = vm.areaSelect[0]
    },
    updatedPharmacy (status) {
      let vm = this
      let countyPharmacy = vm.pharmacyAll.filter(item => {
        if (item.properties.county === vm.select.county) {
          return item
        }
      })
      let areaPharmacy = countyPharmacy.filter(item => {
        if (item.properties.town === vm.select.area) {
          return item
        }
      })
      vm.CurrentlyPharmacy = areaPharmacy
      this.removeMark()
      this.addToMark()
      if (status !== true) {
        this.updateMap()
      }
    },
    updateMap () {
      let vm = this
      if (this.CurrentlyPharmacy.length === 0) {
        vm.magDisplay = false
      } else {
        let right = this.CurrentlyPharmacy[0].geometry.coordinates[0]
        let left = this.CurrentlyPharmacy[0].geometry.coordinates[1]
        maskMap.setView(new L.LatLng(left, right), 15)
      }
    },
    addToMark () {
      this.CurrentlyPharmacy.forEach(item => {
        let adultColor = item.properties.mask_adult > 200 ? 'mask-safety': 'mask-danger'
        let childColor = item.properties.mask_child > 200 ? 'mask-safety': 'mask-danger'
        L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]]).addTo(maskMap)
          .bindPopup(`<a class="mark-content" href="https://www.google.com.tw/maps/place/${item.properties.address}" target="_blank">
          <h3>${item.properties.name}</h3>
          <span>${item.properties.phone}</span>
          <br>
          <span>${item.properties.address}</span>
          <hr>
          <p class="${adultColor}">成人口罩<span>${item.properties.mask_adult}</span>/片</p>
          <p class="${childColor}">兒童口罩<span>${item.properties.mask_child}</span>/片</p>
          </a>`)
      })
    },
    removeMark () {
      maskMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          maskMap.removeLayer(layer)
        }
      })
    }
  },
  created () {
    this.updatePharmacyAll()
    this.updatedArea()
  },
  mounted () {
    maskMap = L.map('map')
    maskMap.setView(new L.LatLng(25.039253, 121.517641), 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(maskMap)
  }
}
</script>
