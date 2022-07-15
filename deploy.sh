#!/usr/bin/env sh

# 发生错误时终止
set -e

rm -rf docs
# 构建
npm run build

# 进入构建文件夹
mv dist docs


cd -
