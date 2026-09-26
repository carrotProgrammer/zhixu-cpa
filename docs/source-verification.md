# 核对官方来源

**网站开发：carrotProgrammer**

**官方发行仓库：[carrotProgrammer/zhixu-cpa](https://github.com/carrotProgrammer/zhixu-cpa)**

本页说明如何核对完整学习包的官方来源与文件完整性。验证覆盖随包程序和教材资源；个人学习记录另行保存。

> 仅供个人学习交流，禁止商业用途。轻一、轻二教材及题目版权归原权利人所有。数字签名仅用于核对分发完整性，不代表对第三方资料作版权授权声明。

## 先确认下载入口

请从 **[官方 Release 页面](https://github.com/carrotProgrammer/zhixu-cpa/releases/latest)** 下载 `zhixu-cpa-full.zip`，核对页面中的版本说明。

软件界面中的作者文字和链接有助于找到来源；进一步核对文件，需要检查数字签名与文件清单。

## 各个验证文件有什么作用

| 文件 | 作用 |
| --- | --- |
| 完整包中的 `provenance/manifest.json` | 记录发行文件及其校验信息，是核对文件完整性的依据。 |
| 完整包中的 `provenance/manifest.sig` | 对发行清单生成的 Ed25519 签名，用于核对清单来源。 |
| 官方仓库中的 `provenance/public-key.json` | 公布官方 Ed25519 公钥与指纹，供独立核对。 |
| `verify-origin.mjs` | 内嵌固定官方公钥，检查清单签名及每个发行文件的大小和 SHA-256。 |

验证工具内嵌固定的 Ed25519 公钥，**不会接受陌生学习包自行提供的公钥**。官方公钥也单独公布在 [公钥文件](https://github.com/carrotProgrammer/zhixu-cpa/blob/main/provenance/public-key.json) 中。

## 取得可信工具，再验证学习包

安装 Node.js 22.13 或更高版本后，按下面的步骤操作。**校验不需要安装学习包依赖，也不会执行被检查包中的程序。**

1. 完整解压待检查的 `zhixu-cpa-full.zip`，保留其中的 `provenance` 文件夹。
2. 从 [官方仓库的 Raw 文件](https://raw.githubusercontent.com/carrotProgrammer/zhixu-cpa/main/verify-origin.mjs) 下载并保存 `verify-origin.mjs`；也可以在 [官方仓库](https://github.com/carrotProgrammer/zhixu-cpa) 点击绿色 **Code → Download ZIP**，解压后取得该文件。
3. 将这个可信工具放在待检查学习包之外的文件夹，在工具所在文件夹打开终端，执行：

```sh
node verify-origin.mjs --root "解压后的学习包目录"
```

把引号中的文字替换为实际目录，例如包含 `start-study.cmd`、`runtime` 和 `resources` 的 `zhixu-cpa` 文件夹。路径中有空格时，保留引号。

看到 **`PASS: official ...`**，表示清单签名通过，且发行文件与签名清单一致。验证过程只读取本机文件，**不联网、不修改文件、不运行学习包代码**。

如果正在检查从官方 Release 直接下载的完整包，也可以在包目录中运行：

```sh
node verify-origin.mjs
```

省略 `--root` 时，检查的是 **`verify-origin.mjs` 自身所在的文件夹**，不是终端当前目录。检查别人转发的包时，请使用上面的“官方工具放在包外 + `--root`”方式；不要直接执行转发包内的验证脚本。

## 如何理解结果

| 输出 | 含义与处理 |
| --- | --- |
| `PASS: official ...` | 签名有效，发行文件与官方清单一致。 |
| `CHANGED` | 文件大小或 SHA-256 与清单不一致。请保存学习记录，重新下载官方完整包。 |
| `MISSING_OR_INVALID` | 文件缺失、解压不完整或不是可验证的普通文件。请重新完整解压。 |
| `UNEXPECTED` | 包目录里出现了清单未列出的额外文件。可能是自行保存的文件；先辨认，再移到包外或用新目录解压检查。 |
| `NOT VERIFIED` | 整体验证未通过。请查看前面的具体报错；不能据此确认该包的官方来源。 |

`.wrangler`、`node_modules`、`backups`、`.git`，以及包根目录中的 `.env`、`.env.*` 等个人状态文件会被忽略；学习记录不要求与发行清单一致。不要为了让校验通过而删除自己的学习记录。

需要帮助时，请附上下载页面和验证工具的报错，通过 [Issues](https://github.com/carrotProgrammer/zhixu-cpa/issues) 反馈。请勿附上个人数据库、账号配置或密钥。

## 验证能说明什么

以可信的官方验证工具和公钥为起点，签名和清单可以检测完整包中程序、文档与教材资源被修改的情况。个人学习记录、安装后的依赖等被忽略的文件不在完整性保证范围内。

**教材图片没有添加水印，也没有为署名或签名修改图片字节。** 签名与文件清单是单独的分发验证文件；它们不改变教材的内容、排版或版权归属。

**来源验证能够检测篡改，但不能阻止别人有意修改程序、移除作者署名或制作另一个版本。** 核对时应以官方仓库公布的信息、公钥和验证结果为依据。

本次发行的核心源码不公开。历史上曾公开的版本可能仍有他人留存，新的发行方式无法收回已有副本。

[← 返回首页](../README.md) · [新手指南](getting-started.md) · [使用说明](../USAGE-NOTICE.md)
