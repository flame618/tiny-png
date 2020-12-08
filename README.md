## Introduction

* tiny-png is a image compression tool，base on tinypng platform
* use tinypng free web api
* Upload pictures in parallel and compress them fast
* The compressed image will overwrite the original image, which can be used for compression during building a project or git pre-commit

## usage
*install npm package*
```
  // yarn install
  yarn global add @byted/tiny-png
  // npm install
  npm install -g @byted/tiny-png
```
```
  tiny -f "./path/" -r
  // -f | --file  it's a image file path or a folder path contains some images
  // -r | --recursive， it's a recursive traversal parameter, only valid when -f is a folder, it will recursively traverse all pictures in the folder
```