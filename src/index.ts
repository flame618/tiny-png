import { startTiny } from "./tinypng";

const program = require("commander");
const pkg = require("../package.json");
/**
 * 初始化命令行程序
 */
function initProgram() {
  program.version(pkg.version);
  program
    .option("-r, --recursive", "是否递归文件夹所有图片")
    .option("-f, --file <file>", "文件名称")
    .action(async (obj: any) => {
      console.log(obj.file);
      startTiny(obj.file, obj.recursive);
    });
  
  program.parse(process.argv);
}

initProgram();