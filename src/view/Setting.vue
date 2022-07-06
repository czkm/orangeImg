<template>
    <div class="config_form">
        <div v-show="userInfo.name || userInfo.login" class="user-info">
            <n-avatar round :size="48" :src="userInfo.avatar_url" />
            <div class="name">HI~{{ userInfo.name || userInfo.login }}</div>
        </div>
        <n-space vertical>
            <n-form
                ref="formRef"
                :model="settingModel"
                label-placement="top"
                :label-width="150"
            >
                <!--                <p class="tips">-->
                <!--                    如何获取access token？ <br />-->

                <!--                    Tips：access token-->
                <!--                    只会储存在你的本机的浏览器内，清空缓存则需要重新登陆-->
                <!--                </p>-->
                <n-descriptions label-placement="top">
                    <n-descriptions-item>
                        <template #label>
                            <a
                                class="urlTips"
                                target="_blank"
                                :href="getAccessBlogUrl"
                                >如何获取access token？</a
                            >
                        </template>
                        <p class="tips">
                            access token
                            只会储存在你的本机的浏览器内，清空缓存则需要重新登陆
                        </p>
                    </n-descriptions-item>
                </n-descriptions>
                <n-form-item :label="settingFormTitle.tokenLabel">
                    <n-input
                        placeholder="请输入Access token"
                        v-model:value="settingModel.tokenValue"
                    />
                </n-form-item>

                <n-form-item :label="settingFormTitle.reposLabel">
                    <n-select
                        placeholder="请选择Github 仓库"
                        :loading="select_loading"
                        v-model:value="settingModel.repoId"
                        :options="reposOptions"
                    />
                </n-form-item>
            </n-form>

            <n-button
                v-show="!showSaveBtn"
                class="default_btn"
                :loading="confirm_loading"
                type="primary"
                @click="SetToken"
            >
                确认token
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

        <!--    <div class="form">-->
        <!--      <lew-form-item-->
        <!--        title="Github access token"-->
        <!--        small_title="如何获取？"-->
        <!--        small_title_link="https://juejin.cn/post/6989307240633073700"-->
        <!--        :tips="-->
        <!--          repos.length == 0-->
        <!--            ? `注意： <br />Pichub不会对你的 access token-->
        <!--          进行储存和转移，它只会储存在你的本机的浏览器内，所以它是相对安全的。如果你试图去浏览器的缓存中清除掉它，你会发现，它需要重新登陆了，但我们不推荐这样操作。-->
        <!--         `-->
        <!--            : ''-->
        <!--        "-->
        <!--      >-->
        <!--        <lew-input-->
        <!--          :disabled="repos.length > 0"-->
        <!--          v-model="token"-->
        <!--          placeholder="请输入"-->
        <!--        ></lew-input>-->
        <!--      </lew-form-item>-->

        <!--      <lew-form-item v-show="repos.length > 0" title="选择一个 Github 仓库">-->
        <!--        <lew-select-->
        <!--          v-model="user.repoId"-->
        <!--          :option="repos"-->
        <!--          label="name"-->
        <!--          value="id"-->
        <!--        ></lew-select>-->
        <!--      </lew-form-item>-->
        <!--    </div>-->

        <!--    <lew-form-item direction="row" v-show="repos.length > 0" title="暗黑模式">-->
        <!--      <lew-switch v-model="user.isDark" @change="changeDarkModel"></lew-switch>-->
        <!--    </lew-form-item>-->

        <!--    <lew-button-->
        <!--      type="primary"-->
        <!--      v-show="repos.length == 0"-->
        <!--      @click=";(loading_1 = true), SetToken()"-->
        <!--      :loading="loading_1"-->
        <!--    >-->
        <!--      确定-->
        <!--    </lew-button>-->
        <!--    <lew-button-->
        <!--      type="gray"-->
        <!--      v-show="repos.length == 0"-->
        <!--      @click="-->
        <!--        ;((loading_4 = true),-->
        <!--        (token = 'ghp_T9wL5cqtYhLHgshM8en' + '' + 'QsA26TnTqzW2CeT6E')),-->
        <!--          SetToken()-->
        <!--      "-->
        <!--      :loading="loading_4"-->
        <!--    >-->
        <!--      少废话，先看东西。-->
        <!--    </lew-button>-->
        <!--    <lew-button-->
        <!--      type="primary"-->
        <!--      v-show="repos.length > 0"-->
        <!--      @click="Save()"-->
        <!--      :loading="loading_2"-->
        <!--    >-->
        <!--      保存配置-->
        <!--    </lew-button>-->
        <!--    <lew-button-->
        <!--      type="danger"-->
        <!--      v-show="repos.length > 0"-->
        <!--      @click="Exit()"-->
        <!--      :loading="loading_3"-->
        <!--    >-->
        <!--      退出登录-->
        <!--    </lew-button>-->
    </div>
</template>

<script setup lang="ts">
import { reposInterface, userInfoInterface } from '@/constant';
import axios from '../axios/http';
import { computed, onMounted, ref } from 'vue';
import { TimerOutline, Help, CheckmarkOutline } from '@vicons/ionicons5';
import { useInfoStore } from '@/store/info';

const formRef = ref(null);
let confirm_loading = ref(false);
let select_loading = ref(false);
const infoStore = useInfoStore();
const demoTokenValue = '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';
const demoRepoId = 510652790;
const getAccessBlogUrl =
    'https://www.google.com/search?q=nativeui+%E8%A1%A8%E5%8D%95%E6%8F%8F%E8%BF%B0&oq=&aqs=chrome.0.35i39i362l8.36723029j0j15&sourceid=chrome&ie=UTF-8';
const settingModel = ref({
    tokenValue: '',
    repoId: ref(null),
});
const showSaveBtn = computed(() => {
    return !!(settingModel.value.tokenValue && settingModel.value.repoId);
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

onMounted(() => {
    if (localStorage.getItem('github_token')) {
        settingModel.value.tokenValue = localStorage.getItem(
            'github_token',
        ) as any;
        GetUser();
    }
});

const SetToken = () => {
    localStorage.setItem('github_token', settingModel.value.tokenValue);
    infoStore.updateToken(settingModel.value.tokenValue);
    GetUser();
};
// 退出
const LoginOut = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('repos');
    infoStore.reset();
    window.$message.success('成功退出登陆');
    location.reload();
};
const GotoDemo = async () => {
    settingModel.value.tokenValue = demoTokenValue;
    localStorage.setItem('github_token', settingModel.value.tokenValue);
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
            console.log(localRepos, reposOptions);
            if (localRepos) {
                settingModel.value.repoId = localRepos.id;
                Save();
            }
        })
        .finally(() => {
            select_loading.value = false;
        });
};

const Save = () => {
    if (!settingModel.value.repoId) {
        window.$message.error('请先输入Github access token后选择仓库');
        return;
    } else {
        let repos = reposOptions.value.find(
            (item: reposInterface) => item.id == settingModel.value.repoId,
        ) as reposInterface;
        infoStore.updateReposPath(repos.name);
        localStorage.setItem('repos', JSON.stringify(repos));
    }
    window.$message.success('保存成功');
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
.urlTips {
    text-decoration: underline;
}
.urlTips:hover {
    color: #0071de;
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
