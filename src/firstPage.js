//  nodejs爬虫 贴吧首页 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), { tieba } = require('./tieba.js'),
      data = '../data/', { mdir, saveTxt, currName, fetchPage } = require('./tool.js');
//  爬虫主函数
function firstPage(addr, res, txtMsg='', tiebaPage=1){
    let html = '';  // 用于储存请求的html整个内容
    res.setEncoding('utf-8');   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    });
    res.on('end' , function(){
        const $ = cheerio.load(html),  // 采用cheerio 模块解析html
              tiebaName = $('.card_title_fname ').eq(0).text().trim(),
              authors =  $('.tb_icon_author');
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
            fetchPage(url, tieba, txtMsg, tiebaPage);
        }
        const txt = `${currName(tiebaName)}.txt`;
    
        mdir(data);
        saveTxt(allMsg, data, txt);
    }).on('error', function() {
        console.log('error');
    });
}

module.exports = {
    firstPage: firstPage
}