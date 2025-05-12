<template>
  <div>
   <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">Tabelas</el-menu-item>
      <el-menu-item index="2" disabled>Pesquisar</el-menu-item>
      <el-menu-item index="3" disabled>Mapa</el-menu-item>
    </el-menu>
   </div>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>