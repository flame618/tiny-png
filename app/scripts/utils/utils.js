const { spawn } = require("child_process");
const { glob } = require("glob");
const path = require("path");

function excuteX(command) {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true
    });
    child.stdout.on("data", (data) => {
      console.log(`${data}`);
    });
    child.stderr.on("data", (data) => {
      console.error(`${data}`);
    });
    child.on("close", resolve);
  })
}

function getRandomIP() {
  return Array.from(Array(4))
    .map(() => parseInt(Math.random() * 255))
    .join(".");
}

function getAllImageFiles(directory, isRecursive) {
  return new Promise((resolve, reject) => {
    const pattern = isRecursive? "**/*.{png,jpg,jpeg}" : "*.{png,jpg,jpeg}";
    glob(pattern, {
      cwd: directory
    }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.map(file => path.join(directory, file)));
      }
    })
  })
}

module.exports = {
  excuteX,
  getRandomIP,
  getAllImageFiles
}