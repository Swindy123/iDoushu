import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局样式
import './assets/styles/variables.css'
import './assets/styles/global.css'

const app = createApp(App)

app.use(router)
app.mount('#app')