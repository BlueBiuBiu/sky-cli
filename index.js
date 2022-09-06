#! /usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const chalk = require("chalk"); // 命令行中输出内容的样式

/**
 * program
 */
 program.version(require("./package.json").version);
 program
 .command("create <project-name>") // 增加创建指令
 .description("create a new project") // 添加描述信息
 .option("-f, --force", "overwrite target directory if it exists") // 强制覆盖
 .action((projectName, cmd) => {
   // 引入 create 模块，并传入参数
   require("./lib/create")(projectName, cmd);
 });

// create.js
// 当前函数中可能存在很多异步操作，因此我们将其包装为 async
module.exports = async function (projectName, options) {
 console.log(projectName, options);
};

 program
  .command("config [value]") // config 命令
  .description("inspect and modify the config")
  .option("-g, --get <key>", "get value by key")
  .option("-s, --set <key> <value>", "set option[key] is value")
  .option("-d, --delete <key>", "delete option by key")
  .action((value, keys) => {
    // value 可以取到 [value] 值，keys会获取到命令参数
    console.log(value, keys);
  });

program.on("--help", function () {
  console.log();
  console.log(
    `Run ${chalk.cyan(
      "sky-cli <command> --help"
    )} for detailed usage of given command.`
  );
  console.log();
});

program.parse();