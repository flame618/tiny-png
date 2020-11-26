const { repo } = require("./data");
const { excuteX } = require("./utils");

async function initReponsitory(name, url = repo) {
  //await excuteX(`mkdir ${name}`);
  await excuteX(`git clone ${url} ${name}`);
}

module.exports = {
  initReponsitory
}