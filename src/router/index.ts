import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Setting from '@/view/Setting.vue';
import ImgContainer from '@/view/ImgContainer.vue'
import About from '@/view/about.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Index',
        redirect: '/setting',
        meta: {},
    },
    {
        path: '/setting',
        name: 'Setting',
        component: Setting,
        meta: {},
    },
    {
        path: '/about',
        name: 'About',
        component: About,
        meta: {},
    },
    {
        path: '/folder/:name',
        name: 'ImgContainer',
        component: ImgContainer,
        meta: {},
    }

];
const router = createRouter({
    history: createWebHashHistory(''),
    routes,
    scrollBehavior() {
        return {
            el: '#app',
            top: 0,
            behavior: 'smooth',
        };
    },
});

export default router;
