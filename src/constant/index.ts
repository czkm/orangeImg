import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';

// 用户操作枚举
export enum UserOptionEnum {
    INFO = 'info',
    ADD_FOLDER = 'orangeImg add a folder',
    DEL_FOLDER = 'orangeImg delete init file',
    DEL_IMG = 'orangeImg delete a image',


}
export enum ImgSuffixEnum {
    png = 'png',
    jpg = 'jpg',
    jpeg = 'jpeg',
    bmp = 'bmp',
    gif = 'gif',
    webp = 'webp',
    psd = 'psd',
    svg = 'svg',
    tiff = 'tiff',
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

export interface reposImgInterface {
    download_url: string
    git_url: string
    html_url: string
    name:string
    sha:string // sha值
    type:string // 类型
    cdn_url?:string // cdn加速
}


declare global {
    interface Window {
        $message: MessageApiInjection;
    }
}
