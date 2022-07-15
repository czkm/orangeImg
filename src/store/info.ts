import { defineStore } from 'pinia';
import {reposImgInterface, reposInterface, userInfoInterface} from '@/constant';

export const useInfoStore = defineStore({
    id: 'info', // id必填，且需要唯一
    state: () => {
        return {
            github_token: '',
            userInfo: {} as userInfoInterface,
            repos: {} as reposInterface,
            folderList:[] as reposImgInterface[],
            modelType:false
        };
    },
    actions: {
        updateInfo(userInfo: userInfoInterface) {
            this.userInfo = userInfo;
        },
        updateToken(token: string) {
            this.github_token = token;
        },
        updateRepos(repos: reposInterface) {
            this.repos = repos;
        },
        updateFolderList(folderList: reposImgInterface[]) {
            this.folderList = folderList;
        },
        updateModelType(type: boolean) {
            this.modelType = type;
        },
        getRepos(){
            return  this.repos
        },
        getToken(){
            return  this.github_token
        },
        getModelType(){
            return  this.modelType
        }
    },
});
