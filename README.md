# 知序 CPA

**把看知识点、做题、看解析、复习串在一起，免费给备考的人用。**

知序 CPA 提供 **会计、税法、经济法**三科的知识学习与刷题功能。可以先在浏览器里体验，也可以下载完整包，在自己的电脑上学习、保留记录。

**免费非商业使用 · 本地运行 · 核心源码不公开**

> 仅供个人学习交流，禁止商业用途。轻一、轻二教材及题目版权归原权利人所有。

**[🌐 在线体验](https://zhixucpa.cn/preview)** · **[📦 下载完整包](https://github.com/carrotProgrammer/zhixu-cpa/releases/latest)** · **[🌱 新手指南](docs/getting-started.md)**

## 从知识点，到下一次复习

- **读原书知识**：按科目、章节和小节阅读图片，保留原有表格、公式与排版。
- **随学随练**：知识点对应位置提供随堂例题与案例，配合作答、阅读思考和解析查看。
- **继续做题**：章后同步练习与题库练习衔接，当前题库共 **4,264 道题**。
- **回头巩固**：在本地程序中查看作答记录、错题与复习内容，下次接着学。

## 下载与启动

当前发行版为 **v0.2.0**，完整包名称为 **`zhixu-cpa-full.zip`**。

1. 安装 **[Node.js 22.13 或更高版本](https://nodejs.org/)**。
2. 在 [Release 下载页](https://github.com/carrotProgrammer/zhixu-cpa/releases/latest) 下载完整包，解压后打开 `zhixu-cpa` 文件夹。
3. Windows 双击 **`start-study.cmd`**；macOS / Linux 在该文件夹打开终端，运行 **`sh start-study.sh`**。

首次启动需要联网执行 `npm ci` 安装依赖，随后运行随包提供的**已编译程序**，无需自行编译源码。浏览器打开后，点击 **「开始学习」** 即可。

默认地址是 **[http://127.0.0.1:3000/login](http://127.0.0.1:3000/login)**，无需注册网站账号。

> 请在 Release 附件中选择 `zhixu-cpa-full.zip`。GitHub 的 **Source code** 与 **Code → Download ZIP** 下载的是本发行仓库的文档、来源验证等文件，不是完整运行程序。

## 记录留在自己的电脑

学习记录位于 **`.wrangler/study-state`**。备份前先停止程序，再完整复制该目录。升级时保留学习数据与 **`resources`** 资源目录，具体步骤见 [新手指南](docs/getting-started.md)。

## 作者与官方来源

**网站开发：[carrotProgrammer](https://github.com/carrotProgrammer/zhixu-cpa)**

本仓库用于发布安装包、使用文档、更新说明与来源验证信息。**核心源码不公开**；免费使用不等于提供源码开放许可。

网站原创代码与界面的作者署名，和教材、题目、图片的版权归属分别说明，详见 [使用说明](USAGE-NOTICE.md)。教材图片不添加水印、不为署名修改字节。

完整包通过 Ed25519 签名与文件清单核对程序和资源的完整性。从官方仓库取得可信的 `verify-origin.mjs` 后，可在工具所在目录运行：

```sh
node verify-origin.mjs --root "解压后的学习包目录"
```

工具内嵌固定官方公钥，只读取文件，不执行学习包代码、不联网。可信工具的下载方式、默认目录和验证结果说明见 [来源验证](docs/source-verification.md)。

## 有问题，告诉我们

欢迎到 [Issues](https://github.com/carrotProgrammer/zhixu-cpa/issues) 反馈使用问题。写明版本、系统和复现步骤，会更容易找到原因。

愿它能陪你把每天的一点学习，慢慢连起来。
