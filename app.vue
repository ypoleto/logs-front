<template>
  <div>
    <div>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="0">Início</el-menu-item>
        <el-menu-item index="1">Pesquisar</el-menu-item>
        <el-menu-item index="2">Mapa</el-menu-item>
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
      pages: [
        '/',
        '/pesquisar',
        '/mapa'
      ],
      activeIndex: '0',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      return navigateTo(this.pages[key], { redirectCode: 301 })
    }
  },
}
</script>