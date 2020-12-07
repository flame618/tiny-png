const { spawn } = require("child_process");
const { glob } = require("glob");
const path = require("path");

export function excuteX(command: string) {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true
    });
    child.stdout.on("data", (data: any) => {
      console.log(`${data}`);
    });
    child.stderr.on("data", (data: any) => {
      console.error(`${data}`);
    });
    child.on("close", resolve);
  })
}

export function getRandomIP() {
  return Array.from(Array(4))
    .map(() => Math.round(Math.random() * 255))
    .join(".");
}

export function getAllImageFiles(directory: any, isRecursive: boolean) {
  return new Promise((resolve, reject) => {
    const pattern = isRecursive? "**/*.{png,jpg,jpeg}" : "*.{png,jpg,jpeg}";
    glob(pattern, {
      cwd: directory
    }, (err: any, files: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.map((file: any) => path.join(directory, file)));
      }
    })
  })
}