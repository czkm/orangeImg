<template>
    <div
        class="upload-modal transition"
        id="drop-area"
        @paste="PasteUpload"
        :class="{ isOpen: props.isOpen }"
    >
        <n-icon size="20" class="icon-close">
            <close @click="emit('Close')" />
        </n-icon>
        <n-select
            placeholder="请选择文件夹"
            style="margin-top: 10px"
            v-model:value="folder"
            :options="props.folders"
        />

        <div class="upload-list">
            <label
                class="upload-box"
                :class="{
                    dropActive: drop_active,
                    uploadBoxLoading: add_upload_loading,
                }"
            >
                <n-icon size="60" class="upload-icon">
                    <cloud-upload />
                </n-icon>
                {{
                    drop_active
                        ? `松开鼠标上传文件`
                        : `点击、拖拽、粘贴到此处上传文件`
                }}
                <input
                    @change="ClickUpload"
                    v-show="false"
                    type="file"
                    name="file"
                    accept="image/*"
                    multiple
                />
            </label>
            <div v-show="upload_list.length > 0" class="title-label">
                待上传图片
            </div>
            <div v-for="item in upload_list" :key="item.name" class="item">
                <div class="status-box">
                    <n-icon
                        size="14"
                        class="icon icon-success"
                        v-show="item.status === ImgUploadStatusEnum.SUCCESS"
                    >
                        <CheckmarkSharp />
                    </n-icon>
                    <n-icon
                        size="14"
                        class="icon icon-uploading"
                        v-show="item.status === ImgUploadStatusEnum.UPLOADING"
                    >
                        <Reload />
                    </n-icon>
                    <n-icon
                        size="14"
                        class="icon icon-fail"
                        v-show="item.status === ImgUploadStatusEnum.FAIL"
                    >
                        <Close />
                    </n-icon>
                </div>
                <div class="info">
                    <div class="name">
                        {{ `${item.name}_.jpeg` }}
                    </div>
                    <div class="tag-box">
                        <n-tag class="folder tag_item">
                            {{ item.folder }}
                        </n-tag>
                        <n-tag type="success" class="original-size tag_item">
                            {{ GetFileSize(item.original_size) }}
                        </n-tag>
                        <n-tag type="info" class="compress-size tag_item">
                            {{ GetFileSize(item.compress_size) }}
                        </n-tag>
                    </div>
                </div>
                <img :src="item.base64" class="image" alt="压缩图片" />
            </div>
            <div class="btn-box">
                <n-button
                    type="warning"
                    v-show="showUploadBtn"
                    @click="upload_list = []"
                >
                    清空列表
                </n-button>
                <n-button
                    type="primary"
                    v-show="showUploadBtn"
                    :loading="upload_OriImg_loading"
                    @click="Upload(ImgUploadTypeEnum.ORIGINAL)"
                >
                    原图上传
                </n-button>
                <n-button
                    type="info"
                    v-show="showUploadBtn"
                    :loading="upload_ComImg_loading"
                    @click="Upload(ImgUploadTypeEnum.COMPRESS)"
                >
                    压缩上传
                </n-button>
            </div>

            <div v-show="history_list?.length > 0" class="upload-list">
                <div class="title-label">上传历史</div>
                <div v-for="item in history_list" :key="item.name" class="item">
                    <div class="status-box">
                        <n-icon
                            size="14"
                            class="icon icon-success"
                            v-show="item.status === ImgUploadStatusEnum.SUCCESS"
                        >
                            <CheckmarkSharp />
                        </n-icon>
                        <n-icon
                            size="14"
                            class="icon icon-uploading"
                            v-show="
                                item.status === ImgUploadStatusEnum.UPLOADING
                            "
                        >
                            <Reload />
                        </n-icon>
                        <n-icon
                            size="14"
                            class="icon icon-fail"
                            v-show="item.status === ImgUploadStatusEnum.FAIL"
                        >
                            <Close />
                        </n-icon>
                    </div>
                    <div class="info">
                        <div class="name">
                            {{
                                item?.upload_type === ImgUploadTypeEnum.ORIGINAL
                                    ? `${item.name}_${item.ext}`
                                    : `${item.name}_.jpeg`
                            }}
                        </div>
                        <div class="tag-box">
                            <n-tag class="folder tag_item">
                                {{ item.folder }}
                            </n-tag>
                            <n-tag
                                type="success"
                                class="original-size tag_item"
                            >
                                {{ GetFileSize(item.original_size) }}
                            </n-tag>
                            <n-tag type="info" class="compress-size tag_item">
                                {{ GetFileSize(item.compress_size) }}
                            </n-tag>

                            <n-tag
                                class="copy-btn"
                                v-bind:data-clipboard-text="
                                    GetMarkdownText(item.cdn_url)
                                "
                                @click="CopyText()"
                                >markdown</n-tag
                            ><n-tag
                                class="copy-btn"
                                v-bind:data-clipboard-text="
                                    GetCdnText(item.cdn_url)
                                "
                                @click="CopyText()"
                                >cdn</n-tag
                            >
                        </div>
                    </div>
                    <img :src="item.base64" class="image" alt="历史图片" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import axios from '@/axios/http';
import { GetCdnText, GetMarkdownText } from '@/util/util';
import {
    Close,
    CloudUpload,
    ApertureOutline,
    CheckmarkSharp,
    Reload,
} from '@vicons/ionicons5';
import { uploadHelper } from '@/util/uploadHelper';
import { onMounted, watch, ref, computed, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GetFileSize, CopyText } from '@/util/util';
import {
    ImgUploadStatusEnum,
    ImgUploadTypeEnum,
    UploadImgInterface,
    uploadImgItemInterface,
    UserOptionStrEnum,
} from '@/constant';
import { useInfoStore } from '@/store/info';

const route = useRoute();
const router = useRouter();

/***
 * @Author: Czk
 * @Date: 2022/7/1
 * @Description: isOpen 是否展开，folders 文件夹数组
 */
const props = defineProps({ isOpen: Boolean, folders: Array as any });
const emit = defineEmits(['Close', 'SetLoading']);

let folder: any = ref(route.params.name); // 文件夹
let upload_list = ref<UploadImgInterface[]>([]); // 上传列表
let history_list: any = ref<UploadImgInterface[]>([]); // 历史列表
let upload_ComImg_loading = ref(false);
let upload_OriImg_loading = ref(false);

const infoStore = useInfoStore();

// 监听路由变化 改变 需要上传文件夹
watch(
    () => route.params.name,
    (folderName: any) => {
        folder.value = folderName || '';
    },
);

// 监听路由变化 上传文件夹改变 则改路由
watch(
    () => folder.value,
    (n: any) => {
        router.push(`/folder/${n}`);
    },
);
const showUploadBtn = computed(() => {
    return upload_list.value.length > 0;
});

let add_upload_loading = ref(false); // 加载按钮

let drop_active = ref(false); // 拖拽状态

onMounted(() => {
    // 历史列表
    if (localStorage.getItem('history_list')) {
        history_list.value = JSON.parse(
            localStorage.getItem('history_list') as any,
        );
    }
    // 拖拽接听
    let drop_area: any = document.getElementById('drop-area');
    drop_area.addEventListener('drop', DropUpload, false);
    let timer: any = '';
    drop_area.addEventListener('dragleave', (e: Event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            e.stopPropagation();
            e.preventDefault();
            drop_active.value = false;
        }, 200);
    });

    drop_area.addEventListener('dragover', (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        drop_active.value = true;
    });
});

// 拖拽上传
const DropUpload = (e: any) => {
    if (!folder.value) {
        window.$message.error('请选择文件夹');
        return;
    }
    let files = e.dataTransfer.files;
    drop_active.value = false;
    e.stopPropagation();
    e.preventDefault();
    let image_files = [] as any;
    // 搜索剪切板items
    for (let i = 0; i <= files.length - 1; i++) {
        console.log(files[i].type.indexOf('image') !== -1);
        if (files[i].type.indexOf('image') !== -1) {
            image_files.push(files[i]);
        } else {
            window.$message.error(`${files[i].name} 不是图片文件`);
        }
    }
    AddImageToList(image_files);
};

// 监听粘贴操作
const PasteUpload = (e: any) => {
    if (!folder.value) {
        window.$message.error('请选择文件夹');
        return;
    }
    const items = e.clipboardData.items; //  获取剪贴板中的数据
    let files: any = null; //  用来保存 files 对象
    if (items.length > 0) {
        //  判断剪贴板中是否是文件
        if (items[0].kind == 'file') {
            files = items[0].getAsFile(); //  获取文件
            //  判断是否是图片
            if (files.type.indexOf('image') >= 0) {
                AddImageToList([files]);
            } else {
                window.$message.error('请粘贴图片文件');
            }
        } else {
            window.$message.error('请粘贴图片文件');
        }
    }
};

// 点击上传
const ClickUpload = (e: any) => {
    if (!folder.value) {
        window.$message.error('请选择github文件夹');
        return;
    }
    let files = e.target.files;
    AddImageToList(files);
};

// 添加图片到上传列表
const AddImageToList = async (files: uploadImgItemInterface[]) => {
    add_upload_loading.value = true;
    window.$message.loading('图片转码压缩中');
    let upload_files: any;
    upload_files = await Promise.all(
        [...files].map((e: uploadImgItemInterface) => {
            // 等待图片压缩异步操作完成，返回执行结果
            return uploadHelper(e, folder.value);
        }),
    );
    add_upload_loading.value = false;
    upload_list.value = upload_list.value.concat(upload_files);
    window.$message.success('图片转码成功');
};

// 上传到github
const Upload = async (type: ImgUploadTypeEnum) => {
    const loadingObj = {
        original: upload_OriImg_loading,
        compress: upload_ComImg_loading,
    };

    loadingObj[type].value = true;
    let timer = 0;
    await Promise.all(
        upload_list.value.map((e, i) => {
            upload_list.value[i].status = ImgUploadStatusEnum.UPLOADING;
            // 等待异步操作完成，返回执行结果
            return new Promise((resolve) => {
                let filename =
                    type == ImgUploadTypeEnum.ORIGINAL
                        ? `${e.name}_${e.ext}`
                        : `${e.name}_.jpeg`;
                setTimeout(() => {
                    axios
                        .put({
                            url: `/repos/${infoStore.userInfo.login}/${infoStore.repos.name}/contents/${folder.value}/${filename}`,
                            data: {
                                message: UserOptionStrEnum.UPLOAD_IMG,
                                content:
                                    type == ImgUploadTypeEnum.ORIGINAL
                                        ? e.original_base64data
                                        : e.base64data,
                            },
                        })
                        .then((res: any) => {
                            const image = res.data.content;
                            e.status = ImgUploadStatusEnum.SUCCESS;
                            upload_list.value[i].status =
                                ImgUploadStatusEnum.SUCCESS;
                            e.url = image.url;
                            e.download_url = image.download_url;
                            e.cdn_url = `https://cdn.jsdelivr.net/gh/${infoStore.userInfo.login}/${infoStore.repos.name}@master/${route.params.name}/${image.name}`;
                            // e.cdn_url = `https://git.poker/${infoStore.userInfo.login}/${infoStore.repos.name}/blob/main/${route.params.name}/${image.name}?raw=true`;
                            e.git_url = image.git_url;
                            e.sha = image.sha;
                            e.upload_type = type;
                            e.html_url = image.html_url;
                            addHistory(e);
                            resolve(200);
                        })
                        .catch((error) => {
                            console.log(error);
                            e.status = ImgUploadStatusEnum.FAIL;
                            upload_list.value[i].status =
                                ImgUploadStatusEnum.FAIL;
                            resolve(400);
                        });
                }, (timer += 1000));
            });
        }),
    );

    window.$message.success('上传完成');
    loadingObj[type].value = false;
    upload_list.value = upload_list.value.filter(
        (e) => e.status !== ImgUploadStatusEnum.SUCCESS,
    );
    const path = toRaw(route.fullPath) + '?time=' + new Date().getTime();
    router.push(path);
    localStorage.setItem('history_list', JSON.stringify(history_list.value));
};

// 添加历史记录
const addHistory = (e: UploadImgInterface) => {
    let item = {
        name: e.name,
        original_size: e.original_size,
        compress_size: e.compress_size,
        base64: e.base64,
        folder: e.folder,
        status: e.status,
        ext: e.ext,
        cdn_url: e.cdn_url,
    };
    history_list.value.unshift(item);
};
</script>

<style lang="scss" scoped>
.upload-modal {
    position: fixed;
    left: 0;
    top: 64px;
    z-index: 1;
    transform: translateX(-300px);
    width: 500px;
    height: 100vh;
    background: var(--background-2);
    border-right: var(--border-width) var(--border-color) solid;
    box-sizing: border-box;
    padding: 28px 14px;
    overflow-y: scroll;
    .btn-box {
        display: flex;
        .n-button {
            margin-right: 7px;
        }
        .n-button:last-child {
            margin-right: 0;
        }
    }
    .icon-close {
        position: absolute;
        right: 0;
        top: 0;
        width: 24px;
        height: 24px;
        padding: 12px;
        opacity: 0.4;
        transform: scale(1);
        cursor: pointer;
        transition: all 0.15s;
    }
    .icon-close:hover {
        opacity: 0.8;
        transform: scale(1.2);
    }
    .icon-close:active {
        opacity: 1;
        transform: scale(1);
    }
    .upload-box {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 100%;
        color: #999;
        background: var(--background);
        margin: 10px 0;
        border-radius: 12px;
        height: 200px;
        border: 3px dashed rgba($color: #000000, $alpha: 0.2);
        box-sizing: border-box;
        cursor: pointer;
        transition: all 0.15s;
        .upload-icon {
            width: 80px;
            height: 80px;
            margin-bottom: 10px;
        }
    }

    .upload-box::after {
        position: absolute;
        top: 50%;
        left: 50%;
        content: '';
        border: 2px solid rgba(194, 194, 194, 0.4);
        border-left-color: var(--primary-color);
        border-radius: 50%;
        width: 14px;
        height: 14px;
        opacity: 0;
        animation: donut-spin 1s linear infinite;
        transition: all 0.15s;
        transform: translate(-50%, -50%);
        outline: var(--background) solid 1000px;
        background: var(--background);
    }
    @keyframes donut-spin {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
    .uploadBoxLoading::after {
        opacity: 1;
    }
    .dropActive {
        border: 3px dashed var(--primary-color);
        color: var(--primary-color);
        .upload-icon {
            color: var(--primary-color);
        }
    }
    .upload-box:hover {
        border: 3px dashed var(--primary-color);
        color: var(--primary-color);
        .upload-icon {
            color: var(--primary-color);
        }
    }
    .title-label {
        margin-bottom: 10px;
        margin-top: 30px;
    }

    .upload-list {
        .item {
            position: relative;
            display: flex;
            align-items: center;
            border-radius: 12px;
            background: var(--background);
            margin-bottom: 7px;
            width: 100%;
            height: 70px;
            box-sizing: border-box;
            border: var(--border-width) solid var(--border-color);
            padding: 10px;
            overflow: hidden;

            .status-box {
                position: absolute;
                top: 5px;
                right: 10px;
                .icon {
                    width: 14px;
                    height: 14px;
                    border-radius: 30px;
                    padding: 2px;
                }
                .icon-success {
                    background: rgb(88, 212, 160);
                    color: #fff;
                }
                .icon-fail {
                    background: rgb(223, 118, 118);
                    color: #fff;
                }
                .icon-uploading {
                    background: rgb(45, 165, 212);
                    color: #fff;
                    animation: uploading 0.8s linear infinite;
                }
                @keyframes uploading {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            }

            .image {
                width: 50px;
                height: 100%;
                object-fit: cover;
                border-radius: 7px;
                border: var(--border-width) solid var(--border-color);
            }

            .info {
                margin-right: 10px;
                margin-left: 3px;
                width: calc(100% - 70px);

                .name {
                    position: relative;
                    width: calc(100% - 20px);
                    color: var(--text-color);
                    font-size: 14px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .tag-box {
                    margin-top: 10px;
                    .tag_item {
                        padding: 2px 4px;
                        margin-right: 10px;
                        border-radius: 2px;
                        font-size: 12px;
                    }
                    .copy-btn {
                        //padding: 2px 6px;
                        //border-radius: 4px;
                        margin: 0 3px;
                        //height: 20px;
                        //line-height: 20px;
                        background: #fff;
                        //color: rgba(122, 122, 122, 1);
                        //border: var(--border-width) rgba(89, 89, 89, 1) solid;
                    }
                    .copy-btn:hover {
                        //border: var(--border-width) #36ad6a solid;
                        background: #36ad6a;
                        color: #fff;
                        cursor: pointer;
                    }
                    .original-size {
                        text-decoration: line-through;
                        color: var(--text-color-2);
                    }
                    .compress-size {
                    }
                }
            }
        }
    }
}
.isOpen {
    transform: translateX(200px);
}
</style>
