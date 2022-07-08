<template>
    <div class="config_form">
        <div v-show="userInfo.name || userInfo.login" class="user-info">
            <n-avatar round :size="48" :src="userInfo.avatar_url" />
            <div class="name">HI~{{ userInfo.name || userInfo.login }}</div>
        </div>
        <n-space vertical>
            <n-form
                ref="formRef"
                :model="settingForm"
                label-placement="top"
                :label-width="150"
            >
                <n-descriptions label-placement="top">
                    <n-descriptions-item>
                        <template #label>
                            <n-a
                                href="https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F"
                                target="_blank"
                            >
                                如何获取access token？
                            </n-a>
                        </template>
                        <n-text depth="3">
                            access token
                            只会储存在你的本机的浏览器内，清空缓存则需要重新登陆
                        </n-text>
                    </n-descriptions-item>
                </n-descriptions>
                <n-form-item :label="settingFormTitle.tokenLabel">
                    <n-input
                        placeholder="请输入Access token"
                        v-model:value="settingForm.tokenValue"
                    />
                </n-form-item>

                <n-form-item :label="settingFormTitle.reposLabel">
                    <n-select
                        placeholder="请选择Github 仓库"
                        :loading="select_loading"
                        v-model:value="settingForm.repoId"
                        :options="reposOptions"
                    />
                </n-form-item>
            </n-form>
            <n-space>
                <n-tag
                    v-show="!!tag_list"
                    v-for="(tag, index) in tag_list"
                    type="info"
                    :key="index"
                >
                    {{ tag }}
                </n-tag>
                <n-descriptions label-placement="top" v-show="!!description">
                    <n-descriptions-item>
                        <template #label> 项目描述 </template>
                        {{ description }}
                    </n-descriptions-item>
                </n-descriptions>
            </n-space>

            <n-button
                class="default_btn"
                :loading="confirm_loading"
                type="primary"
                @click="SetToken"
            >
                {{ !showSaveBtn ? '确认token' : '换个token' }}
            </n-button>
            <n-button
                v-show="!showSaveBtn"
                strong
                secondary
                class="default_btn"
                @click="GotoDemo"
            >
                不想去配置 给我随便整个
            </n-button>
            <n-button
                v-show="showSaveBtn"
                class="default_btn"
                type="info"
                @click="Save"
            >
                保存配置
            </n-button>
            <n-button
                v-show="showSaveBtn"
                class="default_btn"
                type="error"
                @click="LoginOut"
            >
                退出
            </n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { reposInterface, userInfoInterface } from '@/constant';
import axios from '../axios/http';
import { computed, onMounted, ref, watch } from 'vue';
import { TimerOutline, Help, CheckmarkOutline } from '@vicons/ionicons5';
import { useInfoStore } from '@/store/info';
import {GetDefData} from "@/util/util";

const formRef = ref(null);
let confirm_loading = ref(false);
let select_loading = ref(false);
const infoStore = useInfoStore();
const demoTokenValue = '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';
const demoRepoId = 510652790;
const getAccessBlogUrl =
    'https://www.google.com/search?q=nativeui+%E8%A1%A8%E5%8D%95%E6%8F%8F%E8%BF%B0&oq=&aqs=chrome.0.35i39i362l8.36723029j0j15&sourceid=chrome&ie=UTF-8';
const settingForm = ref({
    tokenValue: '',
    repoId: ref(null),
});
const showSaveBtn = computed(() => {
    return !!(settingForm.value.tokenValue && settingForm.value.repoId);
});
let userInfo = ref({
    login: '',
    name: '',
    avatar_url: '',
} as userInfoInterface);
let userToken = ref('' as any);
const settingFormTitle = {
    tokenLabel: 'Github access token',
    reposLabel: 'Github 仓库',
};
const reposOptions = ref<reposInterface[]>([]);
// 标签
let tag_list = ref([] as string[]);
let description = ref('');
watch(
    () => settingForm.value.repoId,
    (n: any) => {
        setTag();
    },
);
// 本地local中存在数据则丛缓存中拿
onMounted(() => {
    if (
        localStorage.getItem('github_token') &&
        localStorage.getItem('userInfo')
    ) {
        GetDefData(infoStore)
        settingForm.value.tokenValue = localStorage.getItem(
            'github_token',
        ) as any;
        userInfo.value = JSON.parse(localStorage.getItem('userInfo') as string);
        GetRepos();
    }
});
const getCurrentReposInfo = () => {
    return reposOptions.value.find(
        (item: reposInterface) => item.id == settingForm.value.repoId,
    ) as reposInterface;
};

const setTag = () => {
    const repos = getCurrentReposInfo();
    tag_list.value = repos.topics || [];
    description.value = repos.description || '';
};
const SetToken = () => {
    localStorage.setItem('github_token', settingForm.value.tokenValue);
    infoStore.updateToken(settingForm.value.tokenValue);
    GetUser();
};
// 退出
const LoginOut = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('repos');
    localStorage.removeItem('userInfo');
    infoStore.$reset();
    window.$message.success('成功退出登陆');
    location.reload();
};
const GotoDemo = async () => {
    settingForm.value.tokenValue = demoTokenValue;
    localStorage.setItem('github_token', settingForm.value.tokenValue);
    localStorage.setItem('repos', JSON.stringify({ id: demoRepoId }));
    SetToken();
};
// 获取用户信息
const GetUser = () => {
    confirm_loading.value = true;
    axios
        .get({
            url: `/user`,
        })
        .then((res: any) => {
            userInfo.value = res.data as userInfoInterface;
            localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
            infoStore.updateInfo(userInfo.value);
            GetRepos();
        })
        .finally(() => {
            confirm_loading.value = false;
        });
};
// 获取仓库信息
const GetRepos = () => {
    select_loading.value = true;
    axios
        .get({
            url: `/users/${userInfo.value.login}/repos?type=public&sort=created&per_page=100`,
        })
        .then((res: any) => {
            reposOptions.value = res.data.map((item: reposInterface) => ({
                ...item,
                label: item.name,
                value: item.id,
            }));

            const localRepos = JSON.parse(
                localStorage.getItem('repos') as string,
            );
            if (localRepos) {
                settingForm.value.repoId = localRepos.id;
                Save(false);
            }
        })
        .finally(() => {
            select_loading.value = false;
        });
};

const Save = (showTips: boolean = true) => {
    if (!settingForm.value.repoId) {
        window.$message.error('请先输入Github access token后选择仓库');
        return;
    } else {
        const repos = getCurrentReposInfo();
        localStorage.setItem('repos', JSON.stringify(repos));
        infoStore.updateRepos(repos);
    }
    if (showTips) {
        window.$message.success('保存成功');
    }
};
</script>

<style lang="scss" scoped>
.config_form {
    width: 400px;
    margin: 0 auto;
}

.default_btn {
    width: 400px;
    float: right;
}
.config_icon {
    margin-left: 20px;
}

.user-info {
    display: flex;
    align-content: center;
    justify-content: center;
    margin-bottom: 20px;
    padding: 20px 0;
    .avatar {
        width: 150px;
        border-radius: 50%;
        border: var(--border-width) var(--border-color) solid;
    }
    .name {
        font-size: 18px;
        line-height: 48px;
        margin-left: 10px;
        color: var(--text-color);
    }
}
.tips {
    white-space: pre-line;
    margin-bottom: 16px;
    font-size: 14px;
    color: var(--text-color-2);
    line-height: 18px;
}
.n-a {
    text-decoration: underline;
}

.token-demo {
    width: 100%;
    background-color: rgb(243, 255, 245);
    border-radius: 14px;
    margin-bottom: 20px;
    padding: 15px;
    line-height: 30px;
}
</style>