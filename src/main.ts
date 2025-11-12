import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'

const app = createApp(App)


app.use(PrimeVue)

app.mount('#app')