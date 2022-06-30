import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import naive from 'naive-ui'
import router from '@/router';

// import {
//     // create naive ui
//     create,
//     // component
//     NButton
// } from 'naive-ui'
// const naive = create({
//     components: [NButton]
// })
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
// 创建vue实例
const app = createApp(App);

app.use(store);
app.use(naive);
app.use(router)


// 挂载实例
app.mount('#app');
