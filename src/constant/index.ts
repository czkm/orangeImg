import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';

// 图片上传类别
export enum ImgUploadTypeEnum {
    ORIGINAL = 'original',// 原图上传
    COMPRESS = 'compress',// 压缩

}
// 图片上传状态
export enum ImgUploadStatusEnum {
    FAIL = 'fail',//  失败
    SUCCESS = 'success',// 成功
    UPLOADING='uploading' // 上传中

}
// 用户操作枚举
export enum UserOptionStrEnum {
    INFO = 'info',
    ADD_FOLDER = 'orangeImg add a folder',
    DEL_FOLDER = 'orangeImg delete init file',
    DEL_IMG = 'orangeImg delete a image',
    UPLOAD_IMG = 'upload a image by orangeImg',

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
export interface UploadImgInterface {
    name: string;
    original_size: number;
    upload_type: ImgUploadTypeEnum;
    ext: string;
    compress_size: number;
    original_base64data: string;
    original_base64: string;
    base64data: string;
    base64: string;
    folder: string;
    status: string;
    download_url: string;
    git_url: string;
    html_url: string;
    sha: string;
    url: string;
    cdn_url: string;
}
export interface reposImgInterface {
    download_url: string;
    git_url: string;
    html_url: string;
    name: string;
    sha: string; // sha值
    type: string; // 类型
    cdn_url?: string; // cdn加速
}

// 上传图片
export interface uploadImgItemInterface extends File{
    name: string; // 名称
    size: number; // 大小
    type: string; // 类型
    [props: string]: any;
}

declare global {
    interface Window {
        $message: MessageApiInjection;
    }
}
