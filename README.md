## NodeCrawler
:rocket: 原生nodejs对百度贴吧实现爬虫

    author: 蔡东
    desc: 贴吧爬虫程序
    createdOn: 2017/5/28

## 操作说明 
### 配置环境，安装node，官网下载 [node](https://nodejs.org/en/)
    
	npm install tieba-crawler

### 操作

    创建test.js，内容如下，然后执行node test.js

```javascript
下载单页某帖子的数据

const { fetchPage } = require('tieba-crawler');
const url = '';  //  你想要爬取的贴子网址
fetchPage(url, 'simple');

下载某贴吧首页的所有帖子的数据

const { fetchPage } = require('tieba-crawler');
const url = '';  //  你想要爬取的贴吧首页
fetchPage(url, 'first');
```

### 新操作

    创建test.js，内容如下，然后执行node test s/simple/f/first (方式选一种，如 node test s)

```javascript
#!/usr/bin/env node

const program = require('commander');
const { fetchPage } = require('tieba-crawler');

program
.command('simple')
.description('crawler files from tieba')
.alias('s')
.action(function(type, name){
    process.stdout.write('输入网址：');
	process.stdin.on('data', function (chunk) {
        let url = String(chunk);
        process.stdin.end();
        fetchPage(url, 'simple');
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
        fetchPage(url, 'first');
    });
});

program.parse(process.argv);
```

## 函数说明

    这里提供了fetchPage函数，fetchPage(url, method, msg, page)。
    url: 爬虫地址，需要带上协议名，完整的url
    method：爬虫方式，'simple'和'first'，默认为'simple'
    第一个为选择贴吧单页方式，第二个为选择贴吧首页方式
    msg: 初始消息，默认为 ''
    page: 帖子爬取的初始页，默认为 1

    最后两个参数可以不用设置

作者：微博 [@itagn][1] - Github [@itagn][2] 

[1]: https://weibo.com/p/1005053782707172
[2]: https://github.com/itagn