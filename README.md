## NodeCrawler
:rocket: 原生nodejs对百度贴吧实现爬虫

    author: 蔡东
    desc: 贴吧爬虫程序
    createdOn: 2017/5/28

## 操作说明 
### 配置环境，安装node，官网下载 [node](https://nodejs.org/en/)
    
    1.安装环境需要的npm包，打开cmd执行
        npm install
    2.运行主程序 node ./bin/pc (s/simple/f/first)

### 例子
```javascript
下载单页某帖子的数据
方法1
	git clone https://github.com/itagn/NodeCrawler.git
	npm install
	node ./bin/pc s
方法2
	git clone https://github.com/itagn/NodeCrawler.git
	npm install
	node ./bin/pc sample
下载某贴吧首页的所有帖子的数据

方法1
	git clone https://github.com/itagn/NodeCrawler.git
	npm install
	node ./bin/pc f
方法2
	git clone https://github.com/itagn/NodeCrawler.git
	npm install
	node ./bin/pc first
```

## 文件说明

    main.js: 爬虫主程序，爬取贴吧首页的帖子名和帖子链接
    tieba.js: 爬虫支线，根据之前爬取到的每个帖子名爬取每个帖子的每层楼评论（文字加图片），每层楼用户id和头像
    tool.js: 爬虫支持，提供了爬虫保存到本地文件的方法，还有http协议与https协议

作者：微博 [@itagn][1] - Github [@itagn][2] 

[1]: https://weibo.com/p/1005053782707172
[2]: https://github.com/itagn