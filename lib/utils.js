const path = require("path");
const { promisify } = require("util")
const Inquirer = require("inquirer") // 交互式用户选择
const ora = require("ora"); // 命令行 loading 效果
const chalk = require("chalk"); // 命令行中输出内容的样式
const downloadGitRepo = promisify(require("download-git-repo"))
const { getZhuRongRepo, getTagsByRepo, getTemplate } = require("./api")

// 获取模板信息及用户最终选择的模板
async function getRepoInfo() {
  // 获取组织下的仓库信息
  let repoList = getTemplate();
  // 提取仓库名
  // const repos = repoList.map((item) => item.name);
  // 选取模板信息
  let { repo } = await new Inquirer.prompt([
    {
      name: "repo",
      type: "list",
      message: "Please choose a template",
      choices: repoList,
    },
  ]);
  return repo;
}

async function getTagInfo(repo) {
  let tagList = await getTagsByRepo(repo);
  const tags = tagList.map((item) => item.name);
  // 选取模板信息
  let { tag } = await new Inquirer.prompt([
    {
      name: "repo",
      type: "list",
      message: "Please choose a version",
      choices: tags,
    },
  ]);
  return tag;
}

function sleep(n) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, n);
  });
}

async function loading(message, fn, ...args) {
  const spinner = ora(message);
  spinner.start(); // 开启加载
  try {
    let executeRes = await fn(...args);
    // 加载成功
    spinner.succeed();
    return executeRes;
  } catch (error) {
    // 加载失败
    spinner.fail("request fail, refetching");
    await sleep(1000);
    // 重新拉取
    return loading(message, fn, ...args);
  }
}

async function download(branch, projectName) {
  // 模板下载地址
  const templateUrl = `github:BlueBiuBiu/template-for-cli#${branch}`;
  // console.log("正在拉取",chalk.cyan(templateUrl));
  // 调用 downloadGitRepo 方法将对应模板下载到指定目录
  await loading(
    "downloading template, please wait",
    downloadGitRepo,
    templateUrl,
    path.join(process.cwd(), `./${projectName}`) // 项目创建位置
  );
}


module.exports = {
  getRepoInfo,
  getTagInfo,
  sleep,
  loading,
  download
}