const { excuteX } = require("./utils");
const childProcess = require("child_process");
const { templateRepo } = require("./statics/gitlab_config");
/**
 * 从模板更新代码
 */
async function update() {
  const remoteRepos = childProcess.execSync("git remote", {encoding: "utf-8"});
  let cmd;
  // 如果存在template源
  if (remoteRepos.includes("template")) {
    cmd = `
      git pull template master --allow-unrelated-histories
    `
  } else {
    // 如果不存在数据源，则使用默认模板仓库源
    cmd = `
      git remote add template ${templateRepo} &&
      git pull template master --allow-unrelated-histories
    `
  }
  await excuteX(cmd);
}

module.exports = update;