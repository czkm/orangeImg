# Vue 3 + Typescript + Vite
## 起因

事情是这样的，vue3出现已经很久了，而在我日常工作的过程中大多数仍然在用vue2版本，新技术的学习总是需要做一些项目然后不断踩坑才能巩固。再加上平常写作的过程中存，所使用的图片分散各地没办法有一个统一的图床来管理。

因此在不考虑项目稳定性的情况下，我选用了都是比较新的技术来实现这一效果，还用上了`cdn的加速`和`compressorjs`的压缩，让图片展示的效果更好，当然你现在看的这篇文章中的图片也存放在这个项目中

## 废话不多说，先看效果
[演示地址](https://czkm.github.io/orangeImg/)

- 配置界面

  ![界面配置](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0a9a7b5650748d6bd3688552216cfa3~tplv-k3u1fbpfcp-zoom-1.image)

  ![先看效果](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1154fd427f644d1a6d2c47b11f240c5~tplv-k3u1fbpfcp-zoom-1.image)
  在这里得先输入你的GitHub token 如何生成我已经写在链接中了，在此不在赘述，如果你只是想体验，或者懒得配置，也可以点`不想配置`获取一个我设置好的通用token

- 操作相关
  选择一个仓库后就可以对图片进行简单的增删查改操作了，简单截几张图
  ![上传图片_m5dvka_.png?raw=true](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdfa4b2adab24e4e92af9bcbbd754415~tplv-k3u1fbpfcp-zoom-1.image)
  点击上传，这里-   支持点击、拖拽、复制图片上传，当然都是可以批量操作的
  ![截屏2022-07-16 下午9.19.15_pvckwv_.jpeg?raw=true](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cfe88a04af3437889d4f4100cb0e434~tplv-k3u1fbpfcp-zoom-1.image)

  这里可以选择原图或者经过`compressorjs`压缩过的图片，图片不会有太大失真
  ![上传成功_klr1ad_.png?raw=true](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6a6d68961b448758ab320c96f3c7539~tplv-k3u1fbpfcp-zoom-1.image)

  ![图片删除_bwer5u_.png?raw=true](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2b4279795354f5388f0b56bcb20180a~tplv-k3u1fbpfcp-zoom-1.image)
  上传成功之后就可以点图片进行删除或者获取图片的`markdown`,`cdn`地址了，这对我们日常写作的帮助还是很大的

## 工程结构
以上就是简单的项目介绍，那么现在看看我们的项目工程
```js
    ├── package-lock.json
    ├── package.json
    ├── public
    │   └── favicon.ico
    ├── README.md
    ├── components.d.ts
    ├── src
    │   ├── App.vue
    │   ├── assets
    │   ├── axios
    │   ├── components
    │   ├── constant
    │   ├── env.d.ts
    │   ├── main.ts
    │   ├── router
    │   ├── store
    │   ├── util
    │   └── view
    ├── tsconfig.json
    ├── vite.config.bak
    ├── vite.config.ts
```
可以看到我们的模块还是很简单的，前端技术选型也是[vue3](https://v3.cn.vuejs.org/)作为主体,用[pinia](https://pinia.web3doc.top/)代替原有的vuex作为整个项目的全局信息管理工具，然后ui库选用来[naiveui](https://www.naiveui.com/zh-CN/light)，最后的工程化工具选取了[vite](https://cn.vitejs.dev/)

这里就不细致到每一步的操作，如果有疑问可以联系我，或者直接阅读源码，下面就看下几个比较重要的模块
## 模块拆解
- 插件的安装 项目初始化
    ```
    npm i vite-plugin-components -D # yarn add vite-plugin-components -D
    ```

    ```js
    import Vue from '@vitejs/plugin-vue'
    import ViteComponents from 'vite-plugin-components'

    export default {
      plugins: [
        Vue(),
        ViteComponents()
      ],
    };
    ```
  这里用了[vite-plugin-components](https://www.npmjs.com/package/vite-plugin-components)这个插件能让那个我们在开发过程中，使用插件按需引入，且直接在模板使用即可
### 工具类的配置
  ```ts
    import axios from 'axios';
    import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
    import {FormatErrorMessage} from "@/util/util";
    //将axios封装到类中
    class Request {
        instance: AxiosInstance; //axios的实例将被保存到这里
        constructor(config: AxiosRequestConfig) {
            //构造器里的config包括baseURL，timeout等
            this.instance = axios.create(config); //创建axios实例
            this.instance.interceptors.request.use(
                //实例中的请求拦截器
                (config: AxiosRequestConfig) => {
                    //请求成功的拦截
                    let token = localStorage.getItem('github_token');
                    if (token) {
                        config.headers = {
                            Authorization: `token ${token}`,
                        };
                    }
                    return config;
                },
                (error) => {
                    //请求失败的拦截
                    return Promise.reject(error);
                },
            );
            this.instance.interceptors.response.use(
                //实例中的响应拦截器
                (response: AxiosResponse) => {
                    //响应成功的拦截
                    return response;
                },
                (error) => {
                    window.$message.error(FormatErrorMessage(error.response.data.message),)
                    //响应失败的拦截
                    return Promise.reject(error);
                },
            );
        }
  ```
### 图片压缩
```ts
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
        const base64File: any = await fileByBase64(compressFile); // 压缩过的图
        const original_base64: any = await fileByBase64(file); // 原始图

        resolve({
            name: `${file.name.substring(
                0,
                file.name.lastIndexOf('.'),
            )}_${createHash(6)}`,
            original_size: file.size,
            compress_size: compressFile.size||0,
            base64data: base64File.replace(/^data:image/\w+;base64,/, ''),
            base64: base64File,
            original_base64data: original_base64.replace(
                /^data:image/\w+;base64,/,
                '',
            ),
            original_base64: original_base64,
            folder: folder,
            ext: getFileExtendingName(file.name), // 获取文件后缀名
        });
    });
};
```
### 拖拽,粘贴事件的监听
```html
    <div
        class="upload-modal transition"
        id="drop-area"
        @paste="PasteUpload"
        :class="{ isOpen: props.isOpen }"
    >
    //......
    </div>
```
```js
// 在vue 文件中
onMounted(() => {
    // 拖拽接听
    let drop_area:Document= document.getElementById('drop-area');
    drop_area.addEventListener('drop', DropUpload, false);
    let timer: any = '';
    drop_area.addEventListener('dragleave', (e: Event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            e.stopPropagation();
            e.preventDefault();
            drop_active.value = false;
        }, 200);
    });

    drop_area.addEventListener('dragover', (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        drop_active.value = true;
    });
});

// 拖拽上传
const DropUpload = (e: any) => {
    if (!folder.value) {
        window.$message.error('请选择文件夹');
        return;
    }
    let files = e.dataTransfer.files;
    drop_active.value = false;
    e.stopPropagation();
    e.preventDefault();
    let image_files = [] as any;
    // 搜索剪切板items
    for (let i = 0; i <= files.length - 1; i++) {
        console.log(files[i].type.indexOf('image') !== -1);
        if (files[i].type.indexOf('image') !== -1) {
            image_files.push(files[i]);
        } else {
            window.$message.error(`${files[i].name} 不是图片文件`);
        }
    }
    AddImageToList(image_files); //添加文件上传
};
```

```
// 监听粘贴操作
const PasteUpload = (e: any) => {
    if (!folder.value) {
        window.$message.error('请选择文件夹');
        return;
    }
    const items = e.clipboardData.items; //  获取剪贴板中的数据
    let files: any = null; //  用来保存 files 对象
    if (items.length > 0) {
        //  判断剪贴板中是否是文件
        if (items[0].kind == 'file') {
            files = items[0].getAsFile(); //  获取文件
            //  判断是否是图片
            if (files.type.indexOf('image') >= 0) {
                AddImageToList([files]);
            } else {
                window.$message.error('请粘贴图片文件');
            }
        } else {
            window.$message.error('请粘贴图片文件');
        }
    }
};
```



### 用户信息的保留
```
├── store
│   ├── index.ts
│   ├── info.ts
```
```ts
// index.ts
import { createPinia } from 'pinia'
const store = createPinia()
export default store
```
```ts
// info.ts
import { defineStore } from 'pinia';
export const useInfoStore = defineStore({
    id: 'info', // id必填，且需要唯一
    state: () => {
        return {
            github_token: '', //初始化变量
        };
    },
    actions: {
        updateToken(token: string) {
            this.github_token = token;
        }
        getToken(){
            return  this.github_token
        }
        //......
    },
});
```
这里就是我们使用`pinia`构建的store，用来存放全局的数据，例如用户信息等等

```ts
// vue文件中使用
const infoStore = useInfoStore(); // 声明store
infoStore.updateToken('value') // 更新token值
infoStore.getToken() // 获取最新的token值
```

`pinia`的用法比较简单，只要先声明完成后，就可以在在vue文件中调用香港的方法了


### vite图片引用
```
// 获取assets静态资源
const GetAssetsFile = (url: string) => {
    return new URL(`../assets/${url}`, import.meta.url).href;
};
```
```html
// 使用
    <n-avatar
        class="meAvatar"
        round
        size="large"
        :src="GetAssetsFile('me.jpeg')"
    />
```
`vite`可能出现本地读取正常，打包后，或者放到服务器上后读取不到图片资源的问题，可以用这个方法来解决。

## 后记

项目代码也是随手一写，存有很多瑕疵，大家凑合着看，希望可以帮助到大家。也希望大家多去[项目地址](https://github.com/czkm/orangeImg)看看，帮助我做出一些优化和改进。

