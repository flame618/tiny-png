import { spawn } from "child_process";
import path from "path";
import glob from "glob";

export function excuteX(command: string) {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true
    });
    child.stdout.on("data", (data: string) => {
      console.log(`${data}`);
    });
    child.stderr.on("data", (data: string) => {
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

export function getAllImageFiles(directory: string, isRecursive: boolean): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const pattern = isRecursive? "**/*.{png,jpg,jpeg}" : "*.{png,jpg,jpeg}";
    glob(pattern, {
      cwd: directory
    }, (err: any, files: string[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.map((file: string) => path.join(directory, file)));
      }
    })
  })
}