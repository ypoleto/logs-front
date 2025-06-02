<template>
  <div
    class=" shadow-2xl absolute top-20 z-1 left-1/2 text-gray-600 font-semibold text-2xl bg-white/50 p-2 px-3 rounded-xl">
    <h1>{{ andarAtual === 1 ? "Térreo" : "1° Andar" }}</h1>
    <span class="text-xs">Terreo: {{ aps.terreo.length }} | Andar1: {{ aps.andar1.length }}</span>
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
import blocos from "../utils/blocos.json";
import aps from "../utils/aps.json";
console.log(aps);

const andarAtual = ref(1)

let map
let terreo
let andar1
let layerAtual

function mostrarAndar(andar) {
  andarAtual.value = andar

  if (layerAtual) {
    map.removeLayer(layerAtual)
  }
  layerAtual = andarAtual.value === 1 ? terreo : andar1

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

  terreo = L.layerGroup(
    blocos.map(bloco =>
      L.polygon(bloco.coordenadas, { color: 'blue', weight: 0.5, fillOpacity: 0 })
        .bindPopup(bloco.nome)
    ).concat(
      aps.terreo.map(ap =>
        L.circleMarker(ap.coordenadas, { color: 'blue', radius: 2 }).bindTooltip(ap.nome)
      )
    )
  );


  andar1 = L.layerGroup(
    blocos.map(bloco =>
      L.polygon(bloco.coordenadas, { color: 'green', weight: 0.5, fillOpacity: 0 })
        .bindPopup(bloco.nome)
    ).concat(
      aps.andar1.map(ap =>
        L.circleMarker(ap.coordenadas, { color: 'green', radius: 2 }).bindTooltip(ap.nome)
      )
    )
  );

  terreo.addTo(map)
  layerAtual = terreo
})
</script>


<style scoped>
.map {
  height: 93vh;
  width: 100%;
}
</style>