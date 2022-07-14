import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        //设置别名
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        vue(),
        Components({
            resolvers: [NaiveUiResolver()],
        }),
    ],
    base: '/orangeImg/',
    server: {
        port: 8088, //启动端口
        hmr: {
            host: '127.0.0.1',
            port: 8088,
        },
        // 设置 https 代理
        proxy: {
            '/api': {
                target: 'https://api.github.com',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, ''),
            },
        },
    },
});
