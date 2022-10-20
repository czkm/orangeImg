import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import naive from 'naive-ui';
import router from '@/router';

import './assets/css/var.scss'
import './assets/css/reset.scss'
import './assets/css/main.scss'
// 通用字体
import 'vfonts/Lato.css';
// // 等宽字体
import 'vfonts/FiraCode.css';
// 创建vue实例
const app = createApp(App);
app.use(store);
app.use(router);
app.use(naive);
router.beforeEach((to, from,next) => {
    if (to.fullPath === '/folder/') {
        next(from.fullPath);
    }else {
        next()
    }
})
// 挂载实例
app.mount('#app');
