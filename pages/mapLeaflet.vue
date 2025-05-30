<template>
    <div class=" shadow-2xl absolute top-20 z-1 left-1/2 text-gray-600 font-semibold text-2xl bg-white/50 p-2 px-3 rounded-xl">
        <h1>{{ andarAtual === 1 ? "Térreo" : "1° Andar" }}</h1>
    </div>
    <div id="map" class="map z-0"></div>
    <div class="absolute bottom-10 left-10 z-1">
        <el-button :disabled="andarAtual === 2" @click="mostrarAndar(2)">
            <el-icon>
                <ArrowUp />
            </el-icon>
        </el-button>
        <el-button :disabled="andarAtual === 1" @click="mostrarAndar(1)">
            <el-icon>
                <ArrowDown />
            </el-icon>
        </el-button>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const andarAtual = ref(1)

let map
let andar1
let andar2
let layerAtual

function mostrarAndar(andar) {
  andarAtual.value = andar

  if (layerAtual) {
    map.removeLayer(layerAtual)
  }
  layerAtual = andarAtual.value === 1 ? andar1 : andar2

  layerAtual.addTo(map)
}

onMounted(async () => {
  const L = await import('leaflet')
  await import('leaflet/dist/leaflet.css')

  map = L.map('map', {
    center: [-24.061530, -52.386278],
    zoom: 20,
    zoomControl: false
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  andar1 = L.layerGroup([
    L.circleMarker([-24.060530, -52.386278], { color: 'blue', radius: 2 }).bindPopup('Andar 1 - Sala 101'),
    L.circleMarker([-24.060430, -52.386078], { color: 'blue', radius: 2 }).bindPopup('Andar 1 - Sala 102')
  ])

  andar2 = L.layerGroup([
    L.circleMarker([-24.060630, -52.386278], { color: 'red', radius: 2 }).bindPopup('Andar 2 - Sala 201')
  ])

  andar1.addTo(map)
  layerAtual = andar1
})
</script>


<style scoped>
.map {
    height: 93vh;
    width: 100%;
}
</style>