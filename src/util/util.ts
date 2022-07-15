// import Moment from 'moment'
// import axios from 'axios';
// @ts-ignore
import Clipboard from 'clipboard';

/**
 * 人性化时间处理 传入国际时间格式
 */
// function GetBeautifyTime(date) {
//   var newdate = Moment(date).format('yyyy-MM-DD HH:mm:ss')
//   var timestamp = new Date(newdate).getTime()
//   var mistiming = Math.round(new Date().getTime() / 1000) - timestamp / 1000
//   var postfix = mistiming > 0 ? '前' : '后'
//
//   mistiming = Math.abs(mistiming)
//   var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒']
//   var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1]
//   for (var i = 0; i < 7; i++) {
//     var inm = Math.floor(mistiming / arrn[i])
//     if (inm != 0) {
//       return inm + ' ' + arrr[i] + postfix
//     }
//   }
// }

/**
 * 人性化时间处理 传入国际时间格式
 */
// function GetDate(date:string) {
//   return Moment(date).format('yyyy年MM月DD日 HH:mm:ss')
// }

/**
 * 得到文件的扩展名
 * @param {} filename
 */
function GetFileExt(filename: string) {
    const d = /\.[^]+$/.exec(filename);
    const ext = String(d);
    const s = ext.toLowerCase();
    return s;
}

/**
 * 得到纯数字时间
 * @param {}
 */
function GetNowTimeNum() {
    const nowTime: Date = new Date();
    const year: number = nowTime.getFullYear();
    const month: number = nowTime.getMonth() + 1;
    const day: number = nowTime.getDate();
    const hour: number = nowTime.getHours();
    const minutes: number = nowTime.getMinutes();
    const seconds: number = nowTime.getSeconds();

    let hourStr: string = '';
    let minutesStr: string = '';
    let secondsStr: string = '';

    if (hour <= 9) {
        hourStr = '0' + hour.toString();
    }
    if (minutes <= 9) {
        minutesStr = '0' + minutes.toString();
    }
    if (seconds <= 9) {
        secondsStr = '0' + seconds.toString();
    }
    return year + month + day + hourStr + minutesStr + secondsStr;
}

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

const isEmptyObj = (obj:Object)=>{
    return JSON.stringify(obj)==='{}'

}
// 获取assets静态资源
const GetAssetsFile = (url: string) => {
    return new URL(`../assets/${url}`, import.meta.url).href
}
export {
    GetAssetsFile,
    GetMarkdownText,
    GetCdnText,
    isEmptyObj,
    // GetBeautifyTime,
    GetDefData,
    GetFileExt,
    GetNowTimeNum,
    // GetDate,
    GetFileSize,
    CopyText,
    FormatErrorMessage,
};
