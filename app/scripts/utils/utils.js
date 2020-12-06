const { spawn } = require("child_process");

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

module.exports = {
  excuteX
}