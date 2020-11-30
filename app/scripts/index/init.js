
const { templateRepo, gameRepoGrounpName,employeePermissions, groupPermissions, departmentId } = require("./statics/gitlab_config");
const fs = require("fs");
const { createRepositoryX } = require("./gitlab");
const { excuteX } = require("./utils");
const prettier = require("prettier");

async function initReponsitory(name, needCreateRemote, url = templateRepo) {
  let gameRepoUrl;
  if (needCreateRemote) {
    gameRepoUrl = await createRepositoryX({
      name,
      namespace: gameRepoGrounpName,
      employeePermissions,
      groupPermissions,
      departmentId
    }).catch(() => {
      throw new Error("创建仓库失败，未收到返回链接");
    });
    if (typeof gameRepoUrl !== "string") {
      throw new Error("创建仓库失败，返回链接非字符串");
    }
  } else {
    console.log("本次无需创建远端仓库");
  }
  // 开始克隆代码
  await excuteX(`git clone ${url} ${name}`);
  initPackageName(name);
  let cmd;
  if (needCreateRemote) {
    // 需要设定origin链接及把代码推送至远端
    cmd = `
      set -eux &&
      cd ./${name} &&
      git remote set-url origin ${gameRepoUrl} &&
      git remote add template ${url} &&
      yarn &&
      git add . &&
      git commit -m "feat: init project name" && 
      git push origin
    `
  } else {
    // 无需设定origin链接及把代码推送至远端
    cmd = `
      set -eux &&
      cd ./${name} &&
      git remote add template ${url} &&
      yarn &&
      git add . &&
      git commit -m "feat: init project name"
    `
  }

  // 开始初始化仓库
  await excuteX(cmd);
  console.log("准备工作已完成");
}

function initPackageName(name) {
  const packagePath = `./${name}/package.json`;
  if (!fs.existsSync(packagePath)) {
    console.log("未检测到package.json文件,无需修改package名称");
    return;
  }
  const text = fs.readFileSync(packagePath, { encoding: "utf8" });
  const json = JSON.parse(text);
  json.name = name;
  let resStr = JSON.stringify(json);
  resStr = prettier.format(resStr, { semi: false, parser: "json" });
  fs.writeFileSync(packagePath, resStr, { encoding: "utf8" });
}

module.exports = {
  initReponsitory
}

