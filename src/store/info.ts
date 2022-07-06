import { defineStore } from 'pinia';
import { reposInterface, userInfoInterface } from '@/constant';

export const useInfoStore = defineStore({
    id: 'info', // id必填，且需要唯一
    state: () => {
        return {
            github_token: '',
            userInfo: {},
            repos: [] as reposInterface[],
            repos_path:''
        };
    },
    actions: {
        updateInfo(userInfo: userInfoInterface) {
            this.userInfo = userInfo;
        },
        updateToken(token: string) {
            this.github_token = token;
        },
        updateRepos(repos: reposInterface[]) {
            this.repos = repos;
        },
        updateReposPath(path: string) {
            this.repos_path = path;
        },
        reset() {
            this.github_token = '';
            this.userInfo = {};
            this.repos = [];
            this.repos_path=''
        },
    },
});
