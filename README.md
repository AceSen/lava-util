# 使用说明

## 1.安装依赖

再lava-util文件夹下打开命令行窗口，输入命令，安装依赖

```cmd
D:\dev\codes\lava\lava-util>npm install
```

## 2.配置文件

进入lava-util > lava 文件夹， 修改config.json配置

```json
{
    "phrase": "", // 注记词
    "generateNum": 500, // 生成私钥数量
    "walletStartNo": 0, // 生成私钥初始path
    "invateCode": "AM26U" // lava邀请码
}
```

## 3.生成私钥文件

完成配置后，在lava-util > lava 文件夹中打开命令行窗口，输入命令，脚本会根据config.json中配置的助记词生成私钥。脚本跑完会在当前目录下生成私钥文件 privateKey.csv

```cmd
D:\dev\codes\lava\lava-util\lava>node generate.js
```

## 4.导出lava RPC文件

生成私钥之后，在lava-util > lava 文件夹中打开命令行窗口，输入命令，脚本会根据privateKey.csv文件中的私钥自动导出lava RPC， 导出完成后会生成lava_pool.json文件。

这个过程比较久，要耐心等待。其次，不建议一次导出太多，想要大批量起号，建议分批导出。

```
D:\dev\codes\lava\lava-util\lava>node export.js
```

## 5.运行RPC刷分

当步骤4运行完成后，会根据rpc文件，运行脚本，进行RPC调用刷分。lava目前好像是周四更新分数，并且明确写了会女巫bot。

该项目完全0撸。



------



关注我，脚本小子无私奉献。

twitter： https://twitter.com/senokel

E-Beggar：BSC:  0x9B4748A18827A6eeA14d1F3064Dfb90632Da9b65



