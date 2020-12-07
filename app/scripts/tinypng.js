const https = require("https");
const fs = require("fs")
const { getRandomIP, getAllImageFiles } = require("./utils/utils");

/**
 * 开始压缩图片流程
 * @param {string} filePath 要压缩的单个图片路径或者目录路径
 * @param {boolean} isRecursive 是否递归遍历出所有文件，只有filePath是文件夹才有效
 */
async function startTiny(filePath, isRecursive = false) {
  if (!filePath) {
    throw new Error("need input a file or directory path, like tiny -f ./test.png or tiny -f ./ -r")
  }
  if (!fs.existsSync(filePath)) {
    throw new Error("input file or directory does not exist");
  }
  let totalInputSize = 0, totalOutPutSize = 0;
  const lstat = fs.lstatSync(filePath);
  if (lstat.isDirectory()) {
    // 处理文件夹
    const files = await getAllImageFiles(filePath, isRecursive);
    const promises = [];
    files.forEach(curFile => {
      const curPromise = tinypng(curFile).then(({ 
        outputSize,
        inputSize 
      }) => {
        totalInputSize += inputSize;
        totalOutPutSize += outputSize;
      })
      promises.push(curPromise);
    })
    await Promise.all(promises);
  } else {
    // 处理单个文件
    let { outputSize, inputSize } = await tinypng(filePath);
    totalOutPutSize += outputSize;
    totalInputSize += inputSize;
  }
  const saveSpace = Math.round((totalInputSize - totalOutPutSize) / 1024);
  const totalRatio = totalOutPutSize / totalInputSize;
  console.log(`tiny-png compression completed, total ratio: ${totalRatio}, save about ${saveSpace}kb space for you`);
}

/**
 * 压缩指定图片
 * @param {string} imagePath 指定图片路径
 */
async function tinypng(imagePath) {
  const info = await uploadImage(imagePath);
  const url = info.output.url;
  await downloadImage(url, imagePath);
  const outputSize = info.output.size;
  const inputSize = info.input.size;
  console.log(`compression file ${imagePath} success: ${Math.round(outputSize / 1024)}kb/${Math.round(inputSize / 1024)}kb=${outputSize / inputSize}`);
  return {
    outputSize,
    inputSize
  }
}

/**
 * 要上传的指定图片路径
 * @param {string} imagePath 指定图片路径
 */
function uploadImage(imagePath) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      method: "POST",
      hostname: "tinypng.com",
      path: "/web/shrink",
      headers: {
        "X-Forwarded-For": getRandomIP(),
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
      }
    }, (res) => {
      if (res.statusCode !== 201) {
        throw new Error(res.statusMessage);
      }
      // 设置返回数据encoding为utf-8
      res.setEncoding("utf-8");
      res.on("data", (buffer) => {
        resolve(JSON.parse(buffer));
      })
    });
    req.on("error", (err) => {
      reject(err);
    })
    req.setTimeout(30000, () => {
      reject("upload connect time out");
    })
    const readStream = fs.createReadStream(imagePath);
    readStream.pipe(req);
  });
}

/**
 * 根据url下载已经压缩过的线上图片
 * @param {string} url 指定已经压缩过的远程图片url地址
 * @param {string} imagePath 指定图片路径，一般是原图片路径，进行覆盖
 */
function downloadImage(url, imagePath) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "X-Forwarded-For": getRandomIP()
      }
    }, (res) => {
      res.pipe(fs.createWriteStream(imagePath)).on("finish", () => {
        resolve();
      });
    })
    req.on("error", (err) => {
      reject(err);
    })
    req.end();
  })
}

module.exports = {
  startTiny
}