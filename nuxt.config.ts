import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devServer: {
    host: '0.0.0.0',
    port: 8000
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  plugins: [
    { src: './plugins/element-plus', ssr: true }
  ],
  modules: [
    ['@nuxtjs/google-fonts', {
      families: {
        Roboto: true,
        'Josefin+Sans': true,
        Lato: [100, 300],
        Raleway: {
          wght: [100, 400],
          ital: [100]
        },
        Inter: '200..700',
        'Crimson Pro': {
          wght: '200..900',
          ital: '200..700',
        }
      }
    }],
    '@element-plus/nuxt'
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

});