const path = require("path");
const fs = require("fs-extra"); // 更友好的文件操作
const Inquirer = require("inquirer") // 交互式用户选择
const ora = require("ora"); // 命令行 loading 效果
const chalk = require("chalk"); // 命令行中输出内容的样式
const figlet = require("figlet") // 生成基于 ASCII 的艺术字
const { getRepoInfo, getTagInfo, download } = require("./utils")


// 核心创建逻辑 —— 创建项目部分
async function create(projectName) {
  // 仓库信息 —— 模板信息
  let repo = await getRepoInfo();
  // 标签信息 —— 版本信息
  let tag = await getTagInfo(repo);
  // 下载模板到模板目录
  await download(repo, tag, projectName);
  // 模板使用提示
  console.log(`\r\nSuccessfully created project ${chalk.cyan(projectName)}`);
  console.log(`\r\n  cd ${chalk.cyan(projectName)}`);
  console.log("  npm install\r\n");
  console.log("  npm run dev\r\n");
}

async function createJudge (projectName, options) {
  // 获取当前工作目录
  const cwd = process.cwd();
  // 拼接得到项目目录
  const targetDirectory = path.join(cwd, projectName);
  // 判断目录是否存在
  if (fs.existsSync(targetDirectory)) {
    // 判断是否使用 --force 参数
    if (options.force) {
      // 删除重名目录(remove是个异步方法)
      await fs.remove(targetDirectory);
      create(projectName)
    } else {
      let { isOverwrite } = await new Inquirer.prompt([
        // 返回值为promise
        {
          name: "isOverwrite", // 与返回值对应
          type: "list", // list 类型
          message: "Target directory exists, Please choose an action",
          choices: [
            { name: "Overwrite", value: true },
            { name: "Cancel", value: false },
          ],
        },
      ]);
      // 选择 Cancel
      if (!isOverwrite) {
        console.log("Cancel");
        return;
      } else {
        // 选择 Overwirte ，先删除掉原有重名目录
        console.log("\r\nRemoving");
        await fs.remove(targetDirectory);
        create(projectName)
      }
    }
  } else {
    create(projectName)
  }
}; 

module.exports =  createJudge