## 简介

* tiny-png是一个图片压缩工具，基于tinypng平台
* 使用tinypng免费通道压缩图片，不收费
* 并行上传图片并压缩，速度快
* 压缩后的图片将覆盖原图，可用于项目构建时压缩，pre-commit时压缩

## 用法
*安装npm包*
```wendang
  // yarn安装  
  yarn global add @byted/tiny-png
  // npm安装
  npm install -g @byted/tiny-png
```
```
  tiny -f "./path/" -r
  // -f | --file为文件路径参数，可以是指定图片文件路径或者文件夹路径，文件夹路径默认会压缩直接子目录所有图片
  // -r | --recursive为递归遍历参数，只针对-f是文件夹时有效，将递归遍历文件夹下所有图片
```