﻿## tieba-crawler
<p>
  <a href="https://www.npmjs.com/package/tieba-crawler"><img src="https://img.shields.io/npm/dm/tieba-crawler.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/tieba-crawler"><img src="https://img.shields.io/npm/v/tieba-crawler.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/tieba-crawler"><img src="https://img.shields.io/npm/l/tieba-crawler.svg" alt="License"></a>
</p>

## 介绍  
:rocket: 原生nodejs对百度贴吧实现爬虫  

## 操作说明 
### 配置环境，安装node，官网下载 [node](https://nodejs.org/en/)
    
	npm install tieba-crawler

### 操作

simple操作

    创建simple.js，内容如下，然后执行node simple.js

```javascript
/* 下载单页某帖子的数据 */
const tieba = require('tieba-crawler');
const url = '';  //  你想要爬取的贴子网址
tieba(url, 'simple');
```

first操作

    创建first.js，内容如下，然后执行node first.js

```javascript
/* 下载某贴吧首页的所有帖子的数据 */
const tieba = require('tieba-crawler');
const url = '';  //  你想要爬取的贴吧首页
tieba(url, 'first');
```

### 新操作

    创建test.js，内容如下，执行npm install commander 
    执行node test s/simple/f/first (方式选一种，如 node test s)

```javascript
#!/usr/bin/env node

const program = require('commander');
const tieba = require('tieba-crawler');

program
.command('simple')
.description('crawler files from tieba')
.alias('s')
.action(function(type, name){
    process.stdout.write('输入网址：');
	process.stdin.on('data', function (chunk) {
        let url = String(chunk);
        process.stdin.end();
        tieba(url, 'simple');
    });
});

program
.command('first')
.description('crawler files from tieba')
.alias('f')
.action(function(type, name){
    process.stdout.write('输入贴吧首页：');
	process.stdin.on('data', function (chunk) {
        let url = String(chunk);
        process.stdin.end();
        tieba(url, 'first');
    });
});

program.parse(process.argv);
```

## 功能以及注意事项说明
### 功能

    simple操作
    1.收集帖子的每层楼回复的图片，层主的头像和id
    2.帖子超过一页的可以自动翻页继续手机
    3.帖子的标题，链接，每层楼回复内容和回复人id，保存在文本中
    
    first操作
    1.获取贴吧首页的所有帖子标题，发帖人，帖子链接
    2.针对每个帖子执行simple操作

### 目录结构

    下载后你的文件夹会出现
    data文件夹/
        帖吧名（内含首页的所有帖子信息）.txt    
        贴吧名文件夹/
            帖子名文件夹/
                帖子名（内含帖子的详细信息）.txt
                帖子的所有用户头像.JPG
                帖子的所有回复图片.JPG

## 函数说明

    这里提供了一个函数，参数为(url, method, msg, page)。
    url: 爬虫地址，需要带上协议名，完整的url
    method：爬虫方式，'simple'和'first'，默认为'simple'
    msg: 初始消息，默认为 ''
    page: 帖子爬取的初始页，默认为 1

    最后两个参数可以不用设置

作者：微博 [@itagn][1] - Github [@itagn][2] 

[1]: https://weibo.com/p/1005053782707172
[2]: https://github.com/itagn




