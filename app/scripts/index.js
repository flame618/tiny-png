const program = require("commander");
const { initReponsitory } = require("./init");
const update = require("./update");

function initProgram() {
  program.version('1.0.0');
  program
    .command("init <name>")
    .option("-r, --repo <repo>", "模板代码仓库地址")
    .option("-o, --remote <remote>", "是否需要创建远程仓库")
    .action(async (name, obj) => {
      console.log("开始初始化...");
      await initReponsitory(name, obj.remote === "false" ? false : true,  obj.repo);
      console.log("初始化完毕");
    });
  program
    .command("update")
    .option("-r, --repo <repo>", "指定具体模板仓库链接")
    .option("-b, --branch <branch>", "指定模板仓库具体分支名")
    .action(async (obj) => {
      console.log("开始根据模板仓库更新代码...");
      await update(obj.repo);
      console.log("更新完毕");
    });
  program.parse(process.argv);
}
module.exports = {
  initProgram
}