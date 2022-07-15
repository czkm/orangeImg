import Compressor from 'compressorjs';

const uploadHelper = (file: File, folder: string) => {
    return new Promise(async (resolve) => {
        const CompressorFile = new Promise((resolve, reject) => {
            new Compressor(file, {
                quality: 0.6,
                strict: true,
                success(result) {
                    resolve(result);
                },
                error(err) {
                    reject(err.message);
                },
            });
        });

        const compressFile = await CompressorFile as File;
        const base64File: any = await fileByBase64(compressFile);
        const original_base64: any = await fileByBase64(file);

        resolve({
            name: `${file.name.substring(
                0,
                file.name.lastIndexOf('.'),
            )}_${createHash(6)}`,
            original_size: file.size,
            compress_size: compressFile.size||0,
            base64data: base64File.replace(/^data:image\/\w+;base64,/, ''),
            base64: base64File,
            original_base64data: original_base64.replace(
                /^data:image\/\w+;base64,/,
                '',
            ),
            original_base64: original_base64,
            folder: folder,
            ext: getFileExtendingName(file.name),
        });
    });
};
/**
 * 上传附件转base64
 * @param {File} file 文件流
 */
const fileByBase64 = (file: File) => {
    return new Promise(async (resolve) => {
        const reader = new FileReader();
        // 传入一个参数对象即可得到基于该参数对象的文本内容
        reader.readAsDataURL(file);
        reader.onload = function (e: any) {
            // target.result 该属性表示目标对象的DataURL
            resolve(e.target.result);
        };
    });
};

/**
 * 获取文件扩展名
 * @param {String} filename 文件流
 */
function getFileExtendingName(filename: string) {
    // 文件扩展名匹配正则
    const reg = /\.[^\.]+$/;
    const matches = reg.exec(filename);
    if (matches) {
        return matches[0];
    }
    return '';
}

function createHash(hashLength: number) {
    // 默认长度 24
    return Array.from(Array(Number(hashLength) || 24), () =>
        Math.floor(Math.random() * 36).toString(36),
    ).join('');
}

export { uploadHelper, fileByBase64 };
