//  nodejs爬虫 帖子全部内容 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), data = '../data/',
    { mdir, saveTxt, saveImage, saveHead, currName, fetchPage } = require('./tool.js');
//  爬虫主函数
function tieba (addr, res, tiebaMsg='', tiebaPage=1){
    let html = '';  // 用于储存请求的html整个内容
    res.setEncoding('utf-8');   // 防止中文乱码
    res.on('data' , function(data){
        html += data;
    });
    res.on('end' , function(){
        const $ = cheerio.load(html);  // 采用cheerio 模块解析html
        const tiebaName = $('.card_title .card_title_fname').eq(0).text() || $('.plat_title_h3').eq(0).text() || $('#tb_nav .multi_forum_link').eq(1).text();
        if(tiebaName === ''){
            console.log('找不到页面，404');
        }else{
            const page = $('.l_reply_num .red').eq(1).text().trim();
            let tiezi = $('.core_title_wrap_bright .core_title_txt').eq(0).text().trim() || 'undefined', tieziName = null;
            if(tiezi !== undefined){
                let tieziArr = tiezi.split('回复：');
                tieziName =  tieziArr[tieziArr.length-1];
            }else{
                tieziName = 'undefined';
            }
            if(tieziName !== 'undefined' && tiebaName){
                if(tiebaPage === 1){
                    tiebaMsg = `标题：${currName(tieziName)}  链接：${addr.split('?')[0]}`;
                }
                let people = $('.d_name .j_user_card'), sayContent = $('.j_d_post_content').text().trim().split("            "), txtNum = 1+30*(tiebaPage-1);
                for(let i=0;i<people.length;i++){
                    let sayPeople = people.eq(i).text().trim(), msg = `${txtNum}楼 [${sayPeople}]:  ${sayContent[i]}`;
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
                tiebaPage ++;
                const nextUrl = `${addr.split('?pn=')[0]}?pn=${tiebaPage}`;
                if (tiebaPage <= page) {
                    fetchPage(nextUrl, tieba, tiebaMsg, tiebaPage);
                }
            }
        }
    }).on('error', function() {
        console.log('error');
    });
}

module.exports = {
    tieba: tieba
}