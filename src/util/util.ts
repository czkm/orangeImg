// @ts-ignore
import Clipboard from 'clipboard';

function GetFileSize(size: number) {
    //把字节转换成正常文件大小
    if (!size) return '';
    const num = 1024.0; //byte
    if (size < num) return size + ' b';
    if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + ' KB'; //kb
    if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + ' M'; //M
    if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + ' G'; //G
    return (size / Math.pow(num, 4)).toFixed(2) + ' T'; //T
}

function CopyText() {
    const clipboard = new Clipboard('.copy-btn');
    clipboard.on('success', (e: any) => {
        // 复制成功消息通知
        window.$message.success('复制成功');
        clipboard.destroy();
    });
    clipboard.on('error', (e: any) => {
        // 复制失败消息通知
        window.$message.error('复制失败');
        clipboard.destroy();
    });
}
//
function FormatErrorMessage(text: string) {
    switch (true) {
        case text == 'Bad credentials': {
            return 'access token 错误,再好好看看';
        }
        case text.indexOf("wasn't supplied") >= 0: {
            return '请勿重复上传相同内容';
        }
        case text == 'This repository is empty.': {
            return '当前仓库为空，请新建一个文件夹';
        }
        case text == 'path cannot start with a slash': {
            return '名称不能为空';
        }
        case text == 'Requires authentication': {
            return 'access token 错误,再好好看看';
        }
        default:
            return '未知错误';
    }
}
function GetDefData(infoStore: any) {
    const tokenValue = localStorage.getItem('github_token') as any;
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const repos = JSON.parse(localStorage.getItem('repos') || '{}');
    infoStore.updateInfo(userInfo);
    infoStore.updateToken(tokenValue);
    infoStore.updateRepos(repos);
}
// 获取Markdown
const GetMarkdownText = (url: string) => {
    const alt = url.substring(url.lastIndexOf('/') + 1);
    return `![${alt}](${url})`;
};
// 获取cdn
const GetCdnText = (url: string) => {
    return ` ${url}`;
};

const isEmptyObj = (obj: Object): boolean => {
    return JSON.stringify(obj) === '{}';
};
// 获取assets静态资源
const GetAssetsFile = (url: string) => {
    return new URL(`../assets/${url}`, import.meta.url).href;
};
export {
    GetAssetsFile,
    GetMarkdownText,
    GetCdnText,
    isEmptyObj,
    GetDefData,
    GetFileSize,
    CopyText,
    FormatErrorMessage,
};
