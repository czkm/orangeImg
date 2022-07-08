import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Index from '@/view/index.vue';
import Setting from '@/view/Setting.vue';
import ImgContainer from '@/view/ImgContainer.vue'

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
        path: '/folder/:name',
        name: 'ImgContainer',
        component: ImgContainer,
        meta: {},
    },
    // {
    //   path: '/About',
    //   name: 'About',
    //   component: About,
    //   meta: {},
    // },
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
