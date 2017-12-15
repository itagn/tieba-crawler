//  nodejs爬虫 帖子全部内容 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), tool = require('./tool.js'), data = './data/', img = './image/', head = './head'
// 爬虫的目标地址
// const url = 'http://tieba.baidu.com/p/3120943537'
// tool.fetchPage(url, tieba, '', 1)
//  爬虫主函数
function tieba (addr, res, tiebaMsg, tiebaPage){
    let html = ''  // 用于储存请求的html整个内容
    res.setEncoding('utf-8')   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    })
    res.on('end' , function(){
        const $ = cheerio.load(html),  // 采用cheerio 模块解析html
        page = $('.l_reply_num .red').eq(1).text().trim(),
        tiebaName = $('div.card_title a.card_title_fname').eq(0).text() || $('.plat_title_h3').eq(0).text() || $('#tb_nav .multi_forum_link').eq(1).text()|| 'undefined'
        let t = $('.core_title_wrap_bright .core_title_txt').eq(0).text().trim() || 'undefined', tieziName = null
        if(t !== undefined){
            let ti = t.split('回复：')
            tieziName =  ti[ti.length-1]
        }else{
            tieziName = 'undefined'
        }
        if(tieziName !== 'undefined' && tiebaName !== 'undefined'){
            if(tiebaPage === 1){
                tiebaMsg = `标题：${tool.currName(tieziName)}  链接：${addr.split('?')[0]}\r\n`
            }
            let people = $('li.d_name a.j_user_card'), txtNum = 1+30*(tiebaPage-1)
            for(let i=0;i<people.length;i++){
                let sayPeople = people.eq(i).text().trim(), msg = `${txtNum}楼    ${sayPeople}\r\n    ${sayContent[i-1]}`
                tiebaMsg = `${tiebaMsg}\r\n${msg}`
                txtNum ++
            }
            const txtDir = `${data}${tool.currName(tiebaName)}/`, txt = `${tool.currName(tieziName)}.txt`,
                  imgdir = `${img}${tool.currName(tiebaName)}/`, imgDir = `${imgdir}${tool.currName(tieziName)}/`,
                  headdir = `${head}${tool.currName(tiebaName)}/`, headDir = `${headdir}${tool.currName(tieziName)}/`    
        
            tool.dir(data)
            tool.dir(txtDir)
            tool.dir(img)
            tool.dir(imgdir)
            tool.dir(imgDir)
            tool.dir(head)
            tool.dir(headdir)
            tool.dir(headDir)
            tool.saveTxt(tiebaMsg, txtDir, txt)
            tool.saveImage( $, imgDir)
            tool.saveHead( $, headDir)
              
            //  程序自动翻页
            tiebaPage ++
            const nextUrl = `${addr.split('?pn=')[0]}?pn=${tiebaPage}`
            if (tiebaPage <= page) {
            tool.fetchPage(nextUrl, tieba, tiebaMsg, tiebaPage)
            }
        }
    }).on('error', function() {
        console.log('error')
    })
}

exports.tieba = tieba