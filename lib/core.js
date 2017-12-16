const fs = require('fs'), request = require('request'), https = require('https'), http = require('http');
const cheerio = require('cheerio'), data = './data/';

//  判断是http协议还是https协议
fetchPage = function(url, func = 'simple', txtMsg = '', tiebapage = 1){
    const urlArr = url.split("://");
    if(urlArr.length>1){
        const web = urlArr[0];
        const dom = urlArr[1].split('/');
        if(dom[0] === 'tieba.baidu.com' && dom.length>1){
            if(web === 'http'){
                // 采用http模块向服务器发送一次get请求
                http.get(url , function(res){
                    if(func === 'simple'){
                        tieba(url, res, txtMsg, tiebapage);
                    }else if(func === 'first'){
                        firstPage(url, res, txtMsg, tiebapage);
                    }else{
                        console.log('参数错误:',func);
                    }
                });
            }else if(web === 'https'){
                // 采用https模块向服务器发送一次get请求
                https.get(url , function(res){
                    if(func === 'simple'){
                        tieba(url, res, txtMsg, tiebapage);
                    }else if(func === 'first'){
                        firstPage(url, res, txtMsg, tiebapage);
                    }else{
                        console.log('参数错误:',func);
                    }
                });
            }else{
                console.log('只支持http协议和https协议');
            }
        }else{
            console.log('只支持在贴吧爬虫');
        }
    }else{
        console.log('请输入完整的网址，包括协议');
    }
}
//  文件保存函数
saveTxt = function(allMsg, txtdir, txt){
    //  文件目录和地址
    const file = txtdir + txt;
    const writerStream = fs.createWriteStream(file);
    writerStream.write(allMsg , 'UTF8');
    writerStream.end();
    writerStream.on('finish' , function(){
console.log(`---------------文件写入${txt}完成---------------`);
    });
    writerStream.on('error' , function(error){
console.log(`---------------文件写入${txt}错误---------------`);
        console.log(error.stack);
    });
}
//  图片保存函数
saveImage = function($ , imgDir){
    //  获取图片
    $('img.BDE_Image').each(function () {
        const imgNum = Math.random().toString(16).substr(2,8),
              img_file = `${imgDir}${imgNum}.jpg`, img_src = $(this).attr('src'); //获取图片的url
        request.head(img_src,function(err,res,body){
            if(err) console.log(`error: ${err}`);
        });
        const writeStream = fs.createWriteStream(img_file), readStream = request(img_src);
        readStream.on('error', function(err) {
            console.log(`---------------图片[${imgNum}]保存失败---------------`);
            console.log(err);
        });
        readStream.pipe(writeStream);
        readStream.on('end', function(response) {
            console.log(`---------------图片[${imgNum}]保存成功---------------`);
            writeStream.end();
        });
    });
}
//  图片保存用户头像
saveHead = function($ , imgDir){
    $('.p_author_face img').each(function () {
        const imgNum = $(this).attr('username'), img_file = `${imgDir}${imgNum}.jpg`, 
              img_src = $(this).attr('data-tb-lazyload') || $(this).attr('src');
        request.head(img_src,function(err,res,body){
            if(err) console.log("error:", err);
        });
        const writeStream = fs.createWriteStream(img_file), readStream = request(img_src);
        readStream.on('error', function(err) {
            console.log(`---------------头像[${imgNum}]保存失败---------------`);
            console.log(err);
        });
        readStream.pipe(writeStream);
        readStream.on('end', function(response) {
            console.log(`---------------头像[${imgNum}]保存成功---------------`);
            writeStream.end()
        });
    });
}
//  文件夹不存在，则创建
mdir = function(path){
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}
//  由于文件夹和文件有命名规定，所以需要更改
currName = function(str){
    if( typeof str !== 'undefined'){
        return str.replace(/\//g, 'i').replace(/\\/g, 'i').replace(/\:/g, 'i')
        .replace(/\*/g, 'i').replace(/\?/g, 'i').replace(/\</g, 'i').replace(/\>/g, 'i')
        .replace(/\"/g, 'i').replace(/\|/g, 'i').trim();
    }else{
        return 'undefined';
    }
}

function tieba (addr, res, tiebaMsg, tiebapage){
    let html = '';  // 用于储存请求的html整个内容
    res.setEncoding('utf-8');   // 防止中文乱码
    res.on('data' , function(data){
        html += data;
    });
    res.on('end' , function(){
        const $ = cheerio.load(html);  // 采用cheerio 模块解析html
        const tiebaName = $('.card_title .card_title_fname').eq(0).text() || $('.plat_title_h3').eq(0).text() || $('#tb_nav .multi_forum_link').eq(1).text();
        if(tiebaName === ''){
            console.log('找不到帖子页面，404');
        }else{
            const page = $('.l_reply_num .red').eq(1).text().trim();
            let tiezi = $('.core_title_wrap_bright .core_title_txt').eq(0).text().trim() || 'undefined', tieziName = null;
            if(tiezi !== 'undefined'){
                let tieziArr = tiezi.split('回复：');
                tieziName =  tieziArr[tieziArr.length-1];
            }else{
                tieziName = 'undefined';
            }
            if(tieziName !== 'undefined' && tiebaName){
                if(tiebapage === 1){
                    tiebaMsg = `标题：${currName(tieziName)}  链接：${addr.split('?')[0]}`;
                }
                let people = $('.d_name .j_user_card'), sayContent = $('.j_d_post_content').text().split("            "), txtNum = 1+30*(tiebapage-1);
                for(let i=0;i<people.length;i++){
                    let sayPeople = people.eq(i).text().trim(), msg = `${txtNum}楼 [${sayPeople}]:  ${sayContent[i+1]}`;
                    tiebaMsg = `${tiebaMsg}\r\n${msg}`;
                    txtNum ++;
                }
                const tiebaDir = `${data}${currName(tiebaName)}/`, 
                     tieziDir = `${tiebaDir}${currName(tieziName)}/`, txt = `${currName(tieziName)}.txt`;
            
                mdir(data);
                mdir(tiebaDir);
                mdir(tieziDir);
                saveTxt(tiebaMsg, tieziDir, txt);
                saveImage( $, tieziDir);
                saveHead( $, tieziDir);
                
                //  程序自动翻页
                tiebapage ++;
                const nextUrl = `${addr.split('?pn=')[0]}?pn=${tiebapage}`;
                if (tiebapage <= page) {
                    fetchPage(nextUrl, 'simple', tiebaMsg, tiebapage);
                }
            }
        }
    }).on('error', function() {
        console.log('error');
    });
}

//  爬虫主函数
function firstPage(addr, res, txtMsg, tiebapage ){
    let html = '';  // 用于储存请求的html整个内容
    res.setEncoding('utf-8');   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    });
    res.on('end' , function(){
        const $ = cheerio.load(html),  // 采用cheerio 模块解析html
              tiebaName = $('.card_title_fname').eq(0).text().trim();
        if(tiebaName === ''){
            console.log('找不到贴吧页面，404');
        }else{
            const authors =  $('.tb_icon_author')
            let author =  [];
            for(let i=0;i<authors.length;i++){
                author.push(authors.eq(i).attr('title').trim());
            }
            let li = $('.j_th_tit .j_th_tit');
            for(let i=li.length-1;i>=0;i--){
                let url = `${addr.split('://')[0]}://tieba.baidu.com${li.eq(i).attr('href')}`;
                if(url.split('?').length == 2){
                    url = url.split('?')[0];
                }
                msg = `${i+1}.${author[i].trim()}  发表了  ${li.eq(i).text().trim()}  链接：${url}`;
                txtMsg = `${msg}\r\n${txtMsg}`;
                fetchPage(url, 'simple', '', tiebapage);
            }
            const txt = `${currName(tiebaName  || 'undefined')}.txt`;
        
            mdir(data);
            saveTxt(txtMsg, data, txt);
        }
    }).on('error', function() {
        console.log('error');
    });
}

//  导出模块
module.exports = fetchPage