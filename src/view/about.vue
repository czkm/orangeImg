<script setup lang="ts">
import {GetAssetsFile} from "@/util/util";
</script>

<template>
    <div class="about-wrapper">
        <div class="title-1">关于我</div>

        <div class="content">
            普通的前端工程师

            <n-a target="_blank" href="https://github.com/czkm">
                <n-avatar
                    class="meAvatar"
                    round
                    size="large"
                    :src="GetAssetsFile('me.jpeg')"
                />
                czkm</n-a
            >
            <br /><br />
            这个项目是一个简单的图床，也可以是相册，就看你咋用。<br /><br />
            特别之处？
            <ul>
                <li>支持点击、拖拽、复制图片上传</li>
                <li>
                    用了
                    <n-a
                        href="https://www-npmjs-com.translate.goog/package/compressorjs?_x_tr_sl=en&_x_tr_tl=zh-CN&_x_tr_hl=zh-CN&_x_tr_pto=sc"
                        target="_blank"
                        >compressorjs</n-a
                    >
                    来压缩图片
                </li>
                <li>安全且快速，数据只存在本地。</li>
                <li>复制转换 Markdown 格式</li>
                <li>
                    技术选型:
                    <n-a href="https://v3.cn.vuejs.org/" target="_blank">
                        <n-avatar
                            class="logo"
                            size="small"
                            :src="GetAssetsFile('vuelogo.png')"
                        />
                        vue3</n-a
                    >+
                    <n-a href="https://pinia.web3doc.top/" target="_blank">
                        <n-avatar
                            class="logo"
                            size="small"
                            :src="GetAssetsFile('pinialogo.svg')"

                        />
                        pinia</n-a
                    >
                    <n-a href="https://cn.vitejs.dev/" target="_blank">
                        <n-avatar
                            class="logo"
                            size="small"
                            :src="GetAssetsFile('vitelogo.svg')"
                        />
                        vite</n-a
                    >
                    ui库：<n-a
                        href="https://www.naiveui.com/zh-CN/light"
                        target="_blank"
                    >
                        <n-avatar
                            class="logo"
                            size="small"
                            :src="GetAssetsFile('naivelogo.svg')"

                        />Naive UI</n-a
                    >
                    代码就随便看看，多提提宝贵意见，这个项目也是随手一写
                </li>
            </ul>
            <br />待办事项<br />
            <ul>
                <li>黑夜模式</li>
                <del>更友好的使用指引(已完成)</del>
                <li>国际化处理</li>
                <li>适配移动端</li>
                <li>样式优化</li>
                <li>换肤</li>
                <li>......剩下的看我想到啥加啥</li>
            </ul>
            <br />
            <div>
                <n-a target="_blank" href="https://github.com/czkm/orangeImg"
                    >项目地址</n-a
                >
            </div>
            <div>
                项目布局参考
                <n-a href="https://github.com/lewkamtao/PicHub" target="_blank"
                    >PicHub</n-a
                >
            </div>
            <div style="padding-bottom: 20px">欢迎提建议和bug，喜欢的话点个star！</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.about-wrapper {
    max-width: 700px;
    margin: 20px auto;
    color: var(--text-color);
    .meAvatar {
        display: inline-block;
    }
    .logo {
        background-color: #ffffff;
    }
    .content {
        margin-top: 20px;
        color: var(--text-color);
        line-height: 30px;
    }
}
</style>
