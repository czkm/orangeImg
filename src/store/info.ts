import { defineStore } from 'pinia';

export const usInfoStore = defineStore({
    id: 'info', // id必填，且需要唯一
    state: () => {
        return {
            name: 'czkm',
        };
    },
    actions: {
        updateInfo(name: string) {
            this.name = name;
        },
    },
});
