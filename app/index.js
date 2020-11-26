const program = require("commander");
const { initReponsitory } = require("./init");

function initProgram() {
  program.version('0.0.1');
  program
    .command("init <name>")
    .option("-r, --resource <resource>", "模板代码仓库地址")
    .action((name, obj) => {
      console.log(name, obj.resource);
      console.log("开始初始化...")
      initReponsitory(name, obj.resource);
      console.log("初始化完毕");
    })

  program.parse(process.argv)
}
module.exports = {
  initProgram
}