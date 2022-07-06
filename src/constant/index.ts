import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';


// 用户操作枚举
export enum UserOptionEnum {
    INFO = 'info',
}

export interface userInfoInterface {
    login: string; // 用户login
    name: string; // 用户名
    avatar_url: string; // 用户头像
    [prop: string]: any;
}


export interface reposInterface {
    id: string; // 仓库id
    name: string; // 仓库名
    description?: string; // 描述
    default_branch?: string; // 分支
    language?: string;
    topics?: string[]; // 关键词
}

declare global {
    interface Window {
        $message: MessageApiInjection;
    }
}
