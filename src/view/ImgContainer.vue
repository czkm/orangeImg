<template>
    <!-- 图片列表 -->
    <div class="index-wrapper">
        <div v-show="images.length === 0" class="not-found">
            <div class="title">暂无图片</div>
            <div class="message">你可以点击左侧的上传图片按钮进行上传。</div>
            <!--/*            <div style="margin-top: 10px">*/-->
            <n-space vertical>
                <n-button
                    @click="emit('OpenUploadModel')"
                    type="primary"
                    style="width: 120px; margin: 10px auto"
                    >上传图片</n-button
                >
                <n-button
                    @click="DeleteFolder"
                    type="error"
                    :loading="deleteFolder_loading"
                    style="width: 120px; margin: 0 auto"
                    >删除文件夹</n-button
                >
            </n-space>
            <!--            </div>-->
        </div>

        <div v-show="images.length > 0" class="list">
            <n-spin :show="imagesList_loading">
                <div v-for="item in images" :key="`${item.name}`" class="item">
                    <div @click="DeleteImage(item)" class="del"></div>
                    <a
                        class="image"
                        :data-info="FormatWImageInfo(item)"
                        :href="item.cdn_url"
                        data-fancybox="gallery"
                    >
                        <img :src="item.cdn_url" loading="lazy" alt=""
                    /></a>
                    <div class="info">
                        <div class="name">{{ item.name }}</div>
                        <div class="copy-box">
                            <span
                                class="copy-btn"
                                v-bind:data-clipboard-text="
                                    GetMarkdownText(item.cdn_url)
                                "
                                @click="CopyText()"
                                >markdown</span
                            ><span
                                class="copy-btn"
                                v-bind:data-clipboard-text="
                                    GetCdnText(item.cdn_url)
                                "
                                @click="CopyText()"
                                >cdn</span
                            >
                        </div>
                    </div>
                </div>
            </n-spin>
        </div>
        <div v-if="images.length > 0" class="footer">
            共 {{ images.length }} 张图
        </div>
    </div>
</template>
<script setup lang="ts">
import { GetFileSize, CopyText } from '../util/util';
// import LewButton from '../components/base/LewButton.vue'

import axios from '../axios/http';
import { onMounted, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInfoStore } from '@/store/info';
import { ImgSuffixEnum, reposImgInterface, UserOptionEnum } from '@/constant';

const emit = defineEmits(['SetLoading', 'OpenUploadModel']);

const route = useRoute();
const router = useRouter();
const infoStore = useInfoStore();

watch(
    () => route.params.name,
    (folderName: any) => {
        // if (n.folder) {
        GetImages(folderName);
        // }
    },
);

let images = ref([] as reposImgInterface[]);
let files = ref([] as any);
let imagesList_loading = ref(false);
onMounted(() => {
    if (infoStore.userInfo.login) {
        GetImages(route.params.name as string);
    } else {
        router.push('/setting');
    }
});

const GetImages = (folderPath: string) => {
    imagesList_loading.value = true;
    axios
        .get({
            url: `/repositories/${infoStore.repos.id}/contents/${
                folderPath || ''
            }?t=${new Date().getTime()}`,
        })
        .then((res: any) => {
            files.value = res.data;
            res.data.forEach((img: reposImgInterface) => {
                if (img.download_url) {
                    img.cdn_url = `https://cdn.jsdelivr.net/gh/${infoStore.userInfo.login}/${infoStore.repos.name}@master/${folderPath}/${img.name}`;
                    // 非cdn    img.cdn_url = `https://git.poker/${infoStore.userInfo.login}/${infoStore.repos.name}/blob/main/${folderPath}/${img.name}?raw=true`;
                }
            });
            images.value = res.data.filter((img: reposImgInterface) =>
                isAssetTypeAnImage(img.name),
            );
        })
        .finally(() => {
            imagesList_loading.value = false;
        });
};
const isAssetTypeAnImage = (imgName: string) => {
    // 获取最后一个.的位置
    let index = imgName.lastIndexOf('.');
    // 获取后缀
    let ext = imgName.substr(index + 1);
    let arr = Object.values(ImgSuffixEnum) as string[];
    return arr.indexOf(ext.toLowerCase()) >= 0;
};
const GetMarkdownText = (url: string) => {
    const alt = url.substring(url.lastIndexOf('/') + 1);
    return `![${alt}](${url})`;
};

const GetCdnText = (url: string) => {
    return ` ${url}`;
};

let deleteFolder_loading = ref(false);

const DeleteFolder = () => {
    if (files.value[0]?.name == 'init') {
        deleteFolder_loading.value = true;
        axios
            .delete({
                url: `/repos/${infoStore.userInfo.login}/${infoStore.repos.name}/contents/${route.params.name}/init`,
                data: {
                    message: UserOptionEnum.DEL_FOLDER,
                    sha: files.value[0]?.sha,
                },
            })
            .then(() => {
                window.$message.success('删除成功');
                deleteFolder_loading.value = false;
                router.push(`/folder/${infoStore.folderList[0].name}`);
            });
    } else {
        window.$message.error(
            '该文件夹内有其他文件，请先登录Github中删除所有文件。',
        );
    }
};

const DeleteImage = (item: reposImgInterface) => {
    imagesList_loading.value = true;

    axios
        .delete({
            url: `/repos/${infoStore.userInfo.login}/${infoStore.repos.name}/contents/${route.params.name}/${item.name}`,
            data: {
                message: UserOptionEnum.DEL_IMG,
                sha: item.sha,
            },
        })
        .then(() => {
            window.$message.success('删除成功');
            GetImages(route.params.name as string);
        })
        .finally(() => {
            imagesList_loading.value = true;
        });
};

const FormatWImageInfo = (image: any) => {
    return `
    <div class="image-info">
    <div class="item"><span>名称</span><div>${image.name}</div></div>
    <div class="item"><span>大小</span><div>${GetFileSize(
        image.size,
    )}</div></div>
    <div class="item"><span>url</span><div>${image.url}</div></div>
    <div class="item"><span>html_url</span><div>${image.html_url}</div></div>
    <div class="item"><span>git_url</span><div>${image.git_url}</div></div>
    <div class="item"><span>download_url</span><div>${
        image.download_url
    }</div> </div>
  `;
};

defineExpose({
    GetImages,
});
</script>

<style>
.image-info .item {
    font-size: 14px;
    margin-bottom: 20px;
}
.image-info div {
    word-wrap: break-word;
    width: 100%;
}
.image-info div span {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #999;
}
</style>

<style lang="scss" scoped>
.index-wrapper {
    position: relative;
    width: 100%;
    height: calc(100vh - 88px);
    overflow-y: auto;
    box-sizing: border-box;
    .list {
        display: grid;
        align-content: flex-start;
        padding: 0 15px;
        grid-gap: 15px;
        min-height: calc(100vh - 129px);
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        list-style: none;
        .item {
            position: relative;
            height: 0;
            padding-bottom: 100%;
            background: var(--background-2);
            margin-bottom: 0px;
            border-radius: 12px;
            border: var(--border-width) rgba(247, 245, 245, 0) solid;
            overflow: hidden;
            cursor: pointer;
            .name {
                width: 80%;
                margin: 0 auto;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .image {
                position: absolute;
                left: 50%;
                top: calc(50% - 10px);
                transform: translate(-50%, -50%);
                display: flex;
                align-items: center;
                max-width: 110px;
                max-height: 110px;
                width: 110px;
                transition: all 0.1s;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 4px;
                }
            }
            .del {
                position: absolute;
                left: 5px;
                top: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 20px;
                height: 20px;
                border-radius: 50px;
                background: rgba($color: #d34343, $alpha: 0.25);
                opacity: 0;
                transition: all 0.1s;
                border: var(--border-width) rgba($color: #d34343, $alpha: 0.25)
                    solid;
            }
            .del::after {
                width: 12px;
                height: 2px;
                content: '';
                border-radius: var(--border-width);
                background: rgba(175, 71, 71, 0.8);
            }
            .del:hover {
                background: rgba($color: #d34343, $alpha: 0.55);
            }
            .del:hover::after {
                background: rgba(190, 84, 84, 1);
            }
            .info {
                position: absolute;
                left: 0px;
                bottom: 0px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                transition: all 0.1s;
                width: 100%;
                font-size: 13px;
                color: var(--text-color-2);
                .copy-box {
                    display: none;
                    height: 40px;
                    opacity: 0;
                    transition: all 0.1s;
                    span {
                        padding: 2px 6px;
                        border-radius: 4px;
                        margin: 0px 3px;
                        height: 20px;
                        line-height: 20px;
                        background: #18a058;
                        color: #fff;
                        border: var(--border-width) #18a058 solid;
                    }
                    span:hover {
                        border: var(--border-width) #36ad6a solid;
                        background: #36ad6a;
                        color: #fff;
                    }
                }
            }
        }
        .item:hover {
            border: var(--border-width) var(--border-color) solid;
            .image {
                top: calc(50% - 20px);
            }
            .name {
                display: none;
            }
            .copy-box {
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 1;
            }
            .info {
                height: 40px;
                background-color: var(--background);
                color: var(--text-color);
            }
            .del {
                opacity: 1;
            }
        }
    }
    .footer {
        position: sticky;
        bottom: 0px;
        right: 0px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        text-align: center;
        color: var(--text-color-2);
        border-top: var(--border-width) var(--border-color) solid;
        background: var(--background);
        opacity: 0.7;
    }
    .not-found {
        position: absolute;

        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: var(--text-color-2);
        text-align: center;
        .title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .message {
            font-size: 16px;
            margin-bottom: 55px;
        }
    }
}
</style>