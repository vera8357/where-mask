<template>
  <div class="wrap-flex">
    <div class="region-wrap">
      <div class="region-select">
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
        <PharacyCard :data="CurrentlyPharmacy"></PharacyCard>
      </div>
    </div>
    <div class="mask-map">
      <div id="map"></div>
    </div>
    <MsgModal :item="select" @updateMaskModel="maskMsg"></MsgModal>
    <Loadimg :data="isloading"></Loadimg>
  </div>
</template>

<script>
import MsgModal from '../components/MsgModel'
import PharacyCard from '../components/PharmacyCard'
import Loadimg from '../components/Loading'
import countySelect from '../assets/CityCountyData.json'
import L from 'leaflet'
let maskMap = {}
export default {
  data () {
    return {
      isloading: false,
      nowTime: '',
      countySelect,
      areaSelect: [],
      pharmacyAll: {},
      CurrentlyPharmacy: [],
      select: {
        county: '臺北市',
        area: '',
        msgDisplay: true
      }
    }
  },
  components: {
    MsgModal,
    PharacyCard,
    Loadimg
  },
  methods: {
    maskMsg () {
      this.select.msgDisplay = true
    },
    getNowTime () {
      var now = new Date()
      var H = now.getHours() + '：'
      var M = now.getMinutes() + '：'
      var S = now.getSeconds()
      this.nowTime = H + M + S
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
    updatePharmacyAll () {
      let vm = this
      const url = `https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json`
      vm.$http.get(url).then(res => {
        vm.pharmacyAll = res.data.features
        vm.getNowTime()
        vm.updatedPharmacy(true)
      })
    },
    updatedPharmacy (status) {
      let vm = this
      vm.isloading = true
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
      vm.removeMark()
      vm.addToMark()
      if (status !== true) {
        vm.updateMap()
      }
    },
    updateMap () {
      let vm = this
      if (vm.CurrentlyPharmacy.length === 0) {
        vm.isloading = false
        vm.select.msgDisplay = false
      } else {
        let right = vm.CurrentlyPharmacy[0].geometry.coordinates[0]
        let left = vm.CurrentlyPharmacy[0].geometry.coordinates[1]
        maskMap.setView(new L.LatLng(left, right), 15)
      }
    },
    addToMark () {
      this.CurrentlyPharmacy.forEach(item => {
        let adultColor = item.properties.mask_adult > 200 ? 'mask-safety' : 'mask-danger'
        let childColor = item.properties.mask_child > 200 ? 'mask-safety' : 'mask-danger'
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
      setTimeout(() => {
        this.isloading = false
      }, 1000)
    },
    removeMark () {
      maskMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          maskMap.removeLayer(layer)
        }
      })
    }
  },
  mounted () {
    this.isloading = true
    this.updatePharmacyAll()
    this.updatedArea()
    maskMap = L.map('map')
    maskMap.setView(new L.LatLng(25.039253, 121.517641), 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(maskMap)
  }
}
</script>
