#!/usr/bin/env node

const path = require('path');
const project = path.join(__dirname, '../tsconfig.json');

//读取环境变量NODE_ENV(zsh通过执行export NODE_ENV=dev添加环境变量)
const NODE_ENV = process.env.NODE_ENV;
const dev = NODE_ENV === 'dev';
if (dev) {
  require('ts-node').register({ project });
  console.log("dev环境")
}

require(`../${dev ? 'src' : 'lib'}/`);
