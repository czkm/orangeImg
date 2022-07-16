<template>
    <div class="body_layout">
        <n-layout position="absolute">
            <n-layout-header class="layout_header" bordered>
                <div class="orange_icon">
                    <img src="../assets/logo.png" alt="logo" />
                </div>
            </n-layout-header>
            <n-layout has-sider position="absolute" class="layout_contain">
                <n-layout-sider
                    width="200"
                    content-style=" padding: 16px 10px 0;overflow-y: hidden;"
                    bordered
                >
                    <n-space vertical>
                        <n-button
                            class="optionItem"
                            v-for="(item, index) in data.optionList"
                            :key="index"
                            @click="item.func()"
                        >
                            {{ item.title }}
                        </n-button>
                        <n-divider></n-divider>
                        <div v-show="folders.length === 0 && !scroll_loading">
                            <n-descriptions
                                label-placement="top"
                                title="这啥都没有"
                            >
                                <n-descriptions-item>
                                    <n-button
                                        v-show="scroll_loading"
                                        class="optionItem"
                                        type="success"
                                        secondary
                                        @click="openFolderForm"
                                    >
                                        要不建一个？
                                    </n-button>
                                </n-descriptions-item>
                            </n-descriptions>
                        </div>
                        <transition name="slide-fade">
                            <div class="created_card" v-show="isAddModal">
                                <n-space vertical>
                                    <n-input
                                        placeholder="输入文件夹名称"
                                        v-model:value="folderName"
                                    />
                                    <n-space
                                        justify="space-between"
                                        size="large"
                                    >
                                        <n-button
                                            type="info"
                                            :loading="addFolder_loading"
                                            @click="addFolder"
                                        >
                                            确定</n-button
                                        >
                                        <n-button
                                            type="error"
                                            @click="
                                                () => {
                                                    isAddModal = false;
                                                }
                                            "
                                        >
                                            取消
                                        </n-button>
                                    </n-space>
                                </n-space>
                            </div>
                        </transition>

                        <div class="emptyAccessTips" v-show="hasToken">
                            <div>未配置access token</div>
                        </div>
                    </n-space>
                    <n-spin :show="scroll_loading">
                        <n-scrollbar style="max-height: 300px">
                            <template
                                v-for="(item, index) in folders"
                                :key="index"
                            >
                                <n-button
                                    class="folder_item"
                                    :class="{
                                        isActive:
                                            route.params.name === item.name,
                                    }"
                                    :type="
                                        route.params.name === item.name
                                            ? 'success'
                                            : 'tertiary'
                                    "
                                    @click="activeFolder(item, index)"
                                >
                                    <n-ellipsis style="max-width: 150px">
                                        {{ item.name }}
                                    </n-ellipsis>
                                </n-button>
                                <div
                                    v-show="route.params.name === item.name"
                                    class="breathe-div"
                                ></div>
                            </template>
                        </n-scrollbar>
                    </n-spin>
                </n-layout-sider>
                <n-layout content-style="padding: 24px 0;z-index:2">
                    <div
                        class="upload_imgList transition"
                        :style="
                            infoStore.getModelType()
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
            @OpenUploadModel="changeImageModel"
            :isOpen="infoStore.getModelType()"
            :folders="folders"
            @Close="changeImageModel"
        ></upload-modal>
    </div>
</template>
<script setup lang="ts">
import UploadModal from '@/components/uploadModal.vue';
import { PersonOutline, Close } from '@vicons/ionicons5';
import { onMounted, reactive, ref, toRaw, watch } from 'vue';
import { reposImgInterface, UserOptionStrEnum } from '@/constant';
import router from '@/router';
import { useInfoStore } from '@/store/info';
import axios from '../axios/http';
import { useRoute } from 'vue-router';
import { GetDefData, isEmptyObj } from '@/util/util';
const route = useRoute();

const infoStore = useInfoStore();
watch(
    () => infoStore.getRepos(),
    (value: any) => {
        if (!isEmptyObj(value)) {
            getFolders();
        }
    },
);
watch(
    () => infoStore.getToken(),
    (value: string) => {
        hasToken.value = value !== '';
    },
);
onMounted(() => {
    if (infoStore.repos && infoStore.userInfo) {
        GetDefData(infoStore);
    }
});

const hasToken = ref(false);
let folders = ref([] as any);
let isAddModal = ref(false);
let addFolder_loading = ref(false);
let scroll_loading = ref(false);
let delFolder_loading = ref(false);

let folderName = ref('');
const initFolderStr =
    '6K+l5paH5Lu255Sxb3JhbmdlSW1n8J+NiuWIm+W7uu+8jOeUqOS6juaWh+S7tuWkueWIneWni+WMlg==';
// 获取文件夹
const activeFolder = (item: any, index: number) => {
    router.push(`/folder/${item.name}`);
};
const getFolders = () => {
    scroll_loading.value = true;
    axios
        .get({
            url: `/repositories/${
                infoStore.repos.id
            }/contents?t=${new Date().getTime()}`,
        })
        .then((res: any) => {
            // 过滤所有文件夹
            folders.value = res.data.filter((item: any) => item.type == 'dir');
            folders.value = folders.value.map((item: reposImgInterface) => ({
                ...item,
                label: item.name,
                value: item.name,
            }));
            infoStore.updateFolderList(folders.value);
            if (route.path == '/' && !route.params.name) {
                router.push(`/folder/${folders.value[0].name}`);
            }
        })
        .finally(() => {
            scroll_loading.value = false;
        });
};
const openFolderForm = () => {
    if (isEmptyObj(infoStore.userInfo) || isEmptyObj(infoStore.repos)) {
        window.$message.error('请先选择一个仓库');
        return;
    }
    isAddModal.value = true;
};
const addFolder = () => {
    if (folderName.value === '') {
        window.$message.error('请输入文件夹名称');
        return;
    }
    addFolder_loading.value = true;
    axios
        .put({
            url: `/repos/${infoStore.userInfo.login}/${infoStore.repos.name}/contents/${folderName.value}/init
`,
            data: {
                message: UserOptionStrEnum.ADD_FOLDER,
                content: initFolderStr,
            },
        })
        .then((res: any) => {
            window.$message.success('创建成功');
            folderName.value = '';
            getFolders();
        })
        .finally(() => {
            addFolder_loading.value = false;
        });
};

const toSetting = () => {
    router.push('/setting');
};
const toAbout = () => {
    router.push('/about');
};
const changeImageModel = () => {
    if (isEmptyObj(infoStore.repos)) {
        window.$message.error('请先完成配置信息');
        return;
    }

    infoStore.updateModelType(!infoStore.getModelType());
};

const data = reactive({
    optionList: [
        { title: '新建文件夹', func: openFolderForm },
        { title: '应用配置⚙️', func: toSetting },
        { title: '上传图片⏫', func: changeImageModel },
        { title: '关于', func: toAbout },
    ],
});
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
            width: 30px;
            height: 30px;
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
    .created_card {
        background-color: rgb(250, 250, 252);
        color: rgb(51, 54, 57);
    }
    .folder_item {
        width: 100%;
        margin: 10px 0;
        display: inline-block;
        &.isActive {
            transition: all 0.15s;
            width: 85%;
        }
    }
    .breathe-div {
        width: 6px;
        height: 6px;
        display: inline-block;
        border: 1px solid #18a058;
        border-radius: 50%;
        text-align: center;
        cursor: pointer;
        margin-left: 10px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        -webkit-animation-timing-function: ease-in-out;
        -webkit-animation-name: breathe;
        -webkit-animation-duration: 1500ms;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-direction: alternate;
    }

    @-webkit-keyframes breathe {
        0% {
            opacity: 0.4;
            box-shadow: 0 1px 2px #0c7a43, 0 1px 1px #18a058 inset;
        }

        100% {
            opacity: 1;
            border: 1px solid #18a058;
            box-shadow: 0 1px 4px #36ad6a, 0 1px 10px #36ad6a inset;
        }
    }
    .folder_del_btn {
        width: 0;
        display: inline-block;
        &.isActive {
            top: 6px;
            transition: all 0.15s;
            width: 10%;
            cursor: pointer;
        }
    }
    .slide-fade-enter-active {
        transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateX(20px);
        opacity: 0;
    }
    .upload_imgList {
        height: 100%;
    }
}
</style>
