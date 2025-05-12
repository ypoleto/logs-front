// plugins/element-plus.ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus)
})
