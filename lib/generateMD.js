"use strict";
let fs = require('fs');
let thenify = require('thenify');
let writeFile = thenify(fs.writeFile);
let language = require('./language');
let path = require('path');
let co = require('co');

exports.generateMarkdown = co.wrap(function*(resultObj,leetcodeNumObj){
    let writeStr = `#leetcode solutions using ${leetcodeNumObj.language}
This is my leetcode solution folder.

Language: ${leetcodeNumObj.language}

Last updated: ${getTimeStr("yyyy-MM-dd")}

I've solved ${leetcodeNumObj.solved}/${leetcodeNumObj.total} problems (${leetcodeNumObj.solved} problems for a fee).

Solutions fetched by [leetcode-spider](https://github.com/Ma63d/leetcode-spider).

| # | Problems | Solutions | Difficulty |
|----|:------|-----------|------|`;
    Object.keys(resultObj).map(e => formatId(e)).sort().forEach((idStr)=>{
        let id = ~~idStr;
        writeStr +=`\n|${idStr}|[${resultObj[id].title}](https://leetcode.com/problems/${resultObj[id].title}/)|`
        resultObj[id].language.forEach(lang => {
            writeStr += ` [${lang}](./blob/master/${idStr}.${resultObj[id].title}/${resultObj[id].title}.${language[lang]})`
        })
        writeStr += `| ${leveToStr(resultObj[id].level)}|`
    })
    yield writeFile(path.resolve(process.cwd(),'README.md'),writeStr).catch(err => {
        throw err;
    })
})

function getTimeStr(fmt){
    let time = new Date();
    let o = {
        "M+": time.getMonth() + 1, //月份
        "d+": time.getDate(), //日
        "h+": time.getHours(), //小时
        "m+": time.getMinutes(), //分
        "s+": time.getSeconds(), //秒
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度
        "S": time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function formatId(id){
    if(id< 10){
        return '00'+id;
    }else if(id < 100){
        return '0'+id;
    }else{
        return ''+id;
    }
}
function leveToStr(level){
    switch (level){
        case 1: return 'Easy';
        case 2: return 'Medium';
        case 3: return 'hard';
    }
}