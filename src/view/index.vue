<template>
    <div class="body_layout">
        <n-layout position="absolute">
            <n-layout-header class="layout_header" bordered>
                <div class="orange_icon">
                    <img src="src/assets/logo.png" alt="logo" />
                </div>
                <div class="user_icon">
                    <n-dropdown
                        trigger="hover"
                        :options="userOptions"
                        @select="handleSelect"
                    >
                        <n-icon size="20">
                            <person-outline />
                        </n-icon>
                    </n-dropdown>
                </div>
            </n-layout-header>
            <n-layout has-sider position="absolute" class="layout_contain">
                <n-layout-sider
                    width="200"
                    content-style="padding: 24px"
                    bordered
                >
                    <n-space vertical>
                        <n-button
                            class="optionItem"
                            v-for="(item, index) in data.optionList"
                            :key="index"
                            @click="item.func(index)"
                        >
                            {{ item.title }}
                        </n-button>
                        <div>你选择了【{{ data.selectGirl }}】为你服务</div>
                    </n-space>
                </n-layout-sider>
                <n-layout content-style="padding: 24px 0;z-index:2">
                    <div
                        class="upload_imgList transition"
                        :style="
                            isOpenImageModal
                                ? `width:calc(100% - 500px);margin-left:500px`
                                : `width:calc(100%)`
                        "
                    >
                        <RouterView />
                    </div>
                </n-layout>
            </n-layout>
        </n-layout>
        <upload-modal
            :isOpen="isOpenImageModal"
            :folders="folders"
            @Close="changeImageModel"
        ></upload-modal>
    </div>
</template>
<script setup lang="ts">
import UploadModal from '@/components/uploadModal.vue';
import { PersonOutline } from '@vicons/ionicons5';
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { UserOptionEnum } from '@/constant';
import router from '@/router';

// export default defineComponent({
//     name: 'App',
//     setup() {
const userOptions = [
    {
        label: '个人信息',
        key: UserOptionEnum.INFO,
    },
];
const selectGirlFun = (index: number) => {
    data.selectGirl = data.optionList[index];
    // data.selectGirl.value = data.optionList.value[index];
};
let folders = ref([] as any);
let isOpenImageModal = ref(false);

const handleSelect = (key: string | number) => {
    console.log(key);
};
const toSetting = () => {
    router.push('/setting');
};
const changeImageModel = () => {
    // if (!github_config?.repoId) {
    //     Alert({
    //         type: 'danger',
    //         text: '请前往设置，完成配置信息',
    //     })
    //     return
    // }
    isOpenImageModal.value = !isOpenImageModal.value;
};

const data = reactive({
    selectGirl: '',
    optionList: [
        { title: '配置', func: selectGirlFun },
        { title: '应用配置⚙️', func: toSetting },
        { title: '上传文件⏫', func: changeImageModel },
    ],
});
// const refData = toRefs(data);
// return {
//     ...refData,
//     selectGirlFun,
// };
// },
// });
</script>

<style lang="scss">
.body_layout {
    height: 100%;
    position: relative;
    .layout_header {
        height: 64px;
        padding: 24px;
        display: flex;
        justify-content: space-between;
        .user_icon,
        .orange_icon {
            display: inline-block;
        }
        .orange_icon {
            width: 30px;
            img {
                width: 100%;
            }
        }
    }
    .layout_contain {
        top: 64px;
    }
    .n-layout-sider {
        z-index: 2;
    }
    .optionItem {
        width: 100%;
        margin: 0 auto;
        text-align: center;
    }
    .upload_imgList {
        height: 100%;
    }
}
</style>
