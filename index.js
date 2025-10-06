"use strict";
const http=require('http');

const decoder=new TextDecoder();

const extTable=[
    {
        mime: "text/html; charset=utf-8",
        exts: ["html","htm","php","aspx","jsp","cgi","shtml","dhtml","xht","xhtml"],
        sysprompt: "Generate a complete HTML page and **ensure that all relevant resources/assets are contained in a single file if possible. No external CSS/JS if possible.** External resources are prohibited. You could hallucinate the content as long as it aligns with the predicted content based on the path, and make sure to generate 2 paragraphs of content or more, with some related links below it.",
        hint: "<!DOCTYPE html>",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "application/xml; charset=utf-8",
        exts: ["xml","xpdl","xsl"],
        sysprompt: "Generate an XML-formatted file.",
        hint: "<?xml",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "image/svg+xml; charset=utf-8",
        exts: ["svg"],
        sysprompt: "Generate a code of an SVG image file.",
        hint: '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg xmlns',
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "application/atom+xml; charset=utf-8",
        exts: ["atom"],
        sysprompt: "Generate an atom feed.",
        hint: "<?xml",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "application/rss+xml; charset=utf-8",
        exts: ["rss"],
        sysprompt: "Generate an RSS feed.",
        hint: "<?xml",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "application/vnd.google-earth.kml+xml; charset=utf-8",
        exts: ["kml"],
        sysprompt: "Generate a Google Earth KML file of map points.",
        hint: "<?xml",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "application/vnd.mozilla.xul+xml; charset=utf-8",
        exts: ["xul"],
        sysprompt: "Generate a Mozilla XUL file, which is based on XML.",
        hint: "<?xml",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "application/mathml+xml; charset=utf-8",
        exts: ["matml","mml"],
        sysprompt: "Generate a MathML code.",
        hint: "<?xml",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "text/plain; charset=utf-8",
        exts: ["txt","nfo","log","conf","cfg","ini","diff","in","inf","text"],
        sysprompt: "Generate a plain text file of your responses.",
        hint: "```\n",
        writeHint: false,
        blockMarkdown: true
    },{
        mime: "text/markdown; charset=utf-8",
        exts: ["md","markdown","mdown","mkdn"],
        sysprompt: "Generate a normal Markdown response like usual. No HTML.",
        hint: null,
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "text/asciidoc; charset=utf-8",
        exts: ["adoc","asciidoc","asc"],
        sysprompt: "Generate responses formatted with the AsciiDoc text formatting format. No HTML.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/x-textile; charset=utf-8",
        exts: ["textile"],
        sysprompt: "Generate responses formatted with the Textile text formatting format. No HTML.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/org; charset=utf-8",
        exts: ["org"],
        sysprompt: "Generate responses formatted with the GNU Emacs Org Mode format. No HTML.",
        hint: "#+title:",
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/plain; charset=utf-8",
        exts: ["mediawiki","wiki"],
        sysprompt: "Generate responses formatted with the MediaWiki format. No HTML.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/x-rst; charset=utf-8",
        exts: ["rst"],
        sysprompt: "Generate responses formatted with the reStructuredText format. No HTML.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/rtf; charset=utf-8",
        exts: ["rtf"],
        sysprompt: "Generate an RTF (Rich Text Format) formatted document.",
        hint: "{\\rtf",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "application/yaml; charset=utf-8",
        exts: ["yaml","yml"],
        sysprompt: "Generate a YAML-formatted file.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "application/toml; charset=utf-8",
        exts: ["toml"],
        sysprompt: "Generate a TOML-formatted file.",
        hint: "```toml\n",
        writeHint: false,
        blockMarkdown: true
    },{
        mime: "text/csv; charset=utf-8",
        exts: ["csv"],
        sysprompt: "Generate a CSV (comma-separated values) spreadsheet file.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/tab-separated-values; charset=utf-8",
        exts: ["tsv"],
        sysprompt: 'Generate a TSV (tab-separated values) spreadsheet file. No commas (,), but instead use "\t"',
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/calendar; charset=utf-8",
        exts: ["ics"],
        sysprompt: "Generate an ICS calendar file.",
        hint: "BEGIN:VCALENDAR",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "application/json; charset=utf-8",
        exts: ["json"],
        sysprompt: "Generate a JSON-formatted file.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "application/json; charset=utf-8",
        exts: ["jsonc"],
        sysprompt: "Generate a JSON-formatted file with `// ` comments (JSONC).",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "application/ld+json; charset=utf-8",
        exts: ["jsonld"],
        sysprompt: "Generate a JSON-LD (linked data) formatted file.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/css; charset=utf-8",
        exts: ["css"],
        sysprompt: "Generate a CSS style.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/javascript; charset=utf-8",
        exts: ["js"],
        sysprompt: "Generate a JavaScript code.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/javascript; charset=utf-8",
        exts: ["mjs"],
        sysprompt: "Generate a JavaScript module.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "application/x-typescript; charset=utf-8",
        exts: ["ts","tsx"],
        sysprompt: "Generate a TypeScript code.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/x-python; charset=utf-8",
        exts: ["py","ipynb"],
        sysprompt: "Generate a Python script.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/x-java-source; charset=utf-8",
        exts: ["java"],
        sysprompt: "Generate a Java code.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/x-c; charset=utf-8",
        exts: ["c","h"],
        sysprompt: "Generate a C code.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/x-c; charset=utf-8",
        exts: ["cpp","hpp"],
        sysprompt: "Generate a C++ code.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        mime: "text/x-sh; charset=utf-8",
        exts: ["sh"],
        sysprompt: "Generate a POSIX-compliant shell script.",
        hint: "#!/bin/sh",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "text/x-sh; charset=utf-8",
        exts: ["bash"],
        sysprompt: "Generate a Bash script.",
        hint: "#!/bin/bash",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "text/x-sh; charset=utf-8",
        exts: ["fish"],
        sysprompt: "Generate a fish shell script.",
        hint: "#!/usr/bin/env fish",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "text/x-sh; charset=utf-8",
        exts: ["zsh"],
        sysprompt: "Generate a ZSH shell script.",
        hint: "#!/usr/bin/env zsh",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "text/x-csh; charset=utf-8",
        exts: ["csh"],
        sysprompt: "Generate a C-shell script.",
        hint: "#!/bin/csh",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "application/x-msdownload; charset=utf-8",
        exts: ["bat","cmd"],
        sysprompt: "Generate a Windows cmd batch script.",
        hint: "@echo off",
        writeHint: true,
        blockMarkdown: false
    },{
        mime: "text/plain; charset=utf-8",
        exts: ["ps1"],
        sysprompt: "Generate a Powershell script.",
        hint: "```powershell\n",
        writeHint: false,
        blockMarkdown: true
    },{
        // unsupported binary files, 400
        mime: "{UNSUPPORTED}",
        exts: ["pdf","epub","warc","webarchive","wacz","7z","rar","tar","gz","xz","zstd","zst","lz","lz4","bz2","bz","pak","iso","dmg","cda","chd","img","vhd","vhdx","vdi","vmdk","qcow2","zip","doc","docx","xls","xlsx","ppt","pptx","odt","odt","fodt","odp","fodp","ods","fods","odg","fodg","db","sqlite","wal","odb","mht","mhtml","tiff","tif","tga","targa","xcf","xpm","xbm","rle","qoi","svgz","msp","bmp","clip","kra","miff","dib","djvu","djv","icns","heif","heic","jng","jfif","jpg","jpeg","jxl","ico","png","mng","raw","dng","cr2","nef","otb","pbm","pdn","pnj","psd","psb","pxz","avif","webp","gif","gifv","mp4","mov","mpg","mpeg","mp3","ogg","ogx","ogv","oga","wav","avi","3gp","3g2","ump","opus","mkv","weba","webm", "bin","dmp","dat","exe","com","dll","so","a","o","out","obj","dylib","msi","cpl","mui","lnk","cab","pyz","pyc","pyd","pyo","whl","class","dex","apk","apkm","aab","aia","ipa","deb","pkg","rpm","xpi","crx","crdownload","obb","jar","nbt","mcaddon","mceditoraddon","mcfunction","mcpack","mcperf","mcproject","mcshortcut","mcstructure","mctemplate","mcworld","mcmeta","mca","mcr","dol","elf","wad","nes","sfc","gcz","rvz","wbfs","wux","wud","wua","rpx","nus","app","nds","3ds","cia","cci","gb","gba","nsp","xci","nsz","sf2","sfz","dls","mid","rmi","ttf","otf","woff","woff2","gguf","safetensors"],
        sysprompt: "File is not supported.",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    },{
        // Fallback for unknown types
        // MUST BE AT THE END OF ARRAY
        // for optimization
        mime: "application/x.{FORMAT}",
        exts: [],
        sysprompt: "Generate a file that is formatted with file format `.{FORMAT}`",
        hint: null,
        writeHint: true,
        blockMarkdown: true
    }
]

let longestFileExt=0;
for(let type of extTable){
    for(let ext of type.exts){
        if(longestFileExt<ext.length)longestFileExt=ext.length;
    }
}
console.log("Longest file extension length: "+longestFileExt);

function pathToTypeContext(path){
    const splitPath=path.split("?")[0].split(".");
    let ext=new URL("a://b"+path).searchParams.get("ext");
    if(ext===null)ext=splitPath[splitPath.length-1].toLowerCase();
    if(ext.length>longestFileExt||(!(/^[a-z]+$/).test(ext))){ // if no ext or trailing dot found, assume html
        ext="html"
    }
    let matchingExt=null;
    searchForMatchingExt:for(let type of extTable){
        for(let fext of type.exts){
            if(ext===fext){
                matchingExt=type;
                break searchForMatchingExt;
            }
        }
    }
    if(matchingExt===null){
        matchingExt=structuredClone(extTable[extTable.length-1]);
        matchingExt.mime=matchingExt.mime.replace("{FORMAT}",ext);
        matchingExt.sysprompt=matchingExt.sysprompt.replaceAll("{FORMAT}",ext);
    }
    return matchingExt;
}

const imaginaryOwnerFirstname="Rick";
const baseURL="http://rickswebsite.localhost:8080";
const useThinking=true;
const logThinking=true;
const enableHints=false;

function getAPIOpt(path,ftypeContext,referer){
    let blockMarkdown=(!enableHints)||ftypeContext.blockMarkdown;
    let apiopt={
        model: "qwen3:1.7b",
        think: useThinking,
        messages: [{
            role: "system",
            content: `You are an HTTP request handler. Only output content matching with the path. ${ftypeContext.sysprompt} ${blockMarkdown?"Output the code directly. ":""}Owner name is ${imaginaryOwnerFirstname}.${blockMarkdown?' Remember, only output code without Markdown code block formatting. No "```", just code.':""} **No explanations at the end, please!**`
        }]
    };
    apiopt.messages.push({
        role: "user",
        content: `Path: ${baseURL}${path}`+(referer?`\nReferer: ${referer}`:"")
    });
    if(enableHints&&ftypeContext.hint!==null)apiopt.messages.push({
        role: "assistant",
        content: ftypeContext.hint
    });
    console.log("API OPT: ",apiopt);
    return JSON.stringify(apiopt);
}

const server=http.createServer((req,res)=>{
    let headerWritten=false,styleInjected=false;
    console.log(`Path: ${req.url}`+(req.headers.referer?`\nReferer: ${req.headers.referer}`:""));
    const ftypeContext=pathToTypeContext(req.url);
    console.log(ftypeContext);
    if(ftypeContext.mime==="{UNSUPPORTED}"){
        console.log("Unsupported, 400");
        if(!headerWritten){
            res.writeHead(400, {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache'
            });
            headerWritten=true;
        }
        res.end("<h1>Error 400: Bad Request</h1><h2>Binary File Types are Not Supported!</h2><p>Based on the file extension, the file type you have requested cannot be generated.</p>\n");
        return;
    }
    const postData=getAPIOpt(req.url,ftypeContext,req.headers.referer);
    const options={
        hostname: 'localhost',
        port: 11434,
        path: '/api/chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    let prevData="";
    const apiReq=http.request(options, (apiRes)=>{
        if(!headerWritten){
            res.writeHead(apiRes.statusCode, {
                'Content-Type': ftypeContext.mime,
                'Transfer-Encoding': 'chunked',
                'X-Accel-Buffering': 'no',
                'Cache-Control': 'no-cache'
            });
            if(enableHints&&ftypeContext.hint!==null&&ftypeContext.writeHint)res.write(ftypeContext.hint);
            headerWritten=true;
        }

        apiRes.on('data', (chunk)=>{
            let resp=decoder.decode(chunk,{stream:true});
            try{
                let respobj=JSON.parse(resp);
                let part=respobj.message.content;
                if(part===""){
                    if(logThinking&&respobj?.message?.thinking)process.stdout.write(respobj.message.thinking);
                    return;
                }
                process.stdout.write(part);
                // console.log(`<part>${part}</part>`);
                if(!(
                    (
                        (!enableHints)||
                        ftypeContext.blockMarkdown
                    )&&
                    (
                        part.startsWith("``")||
                        (
                            prevData==="```"&&
                            /^[a-z]+\n{0,1}$/.test(part)
                        )||(
                            prevData==="``"&&
                            part.startsWith("`")
                        )
                    )
                ))res.write(part)
                if((!styleInjected)&&(part==="<head>"||prevData.startsWith("<head"))){
                    res.write('<style id="wjxcvb">/*injected by the server to allow inspection by the user*/style,script{display:block;white-space:pre-wrap;font-family:monospace}#wjxcvb{display:none}style::before{content:"[STYLE TAG]"}style::after{content:"[END STYLE TAG]"}script::before{content:"[SCRIPT TAG]";}script::after{content:"[END SCRIPT TAG]"}</style>\n');
                    styleInjected=true;
                }
                prevData=part;
            }catch(e){}
        });

        apiRes.on('end', ()=>{
            console.log('[END]');
            res.end();
        });
    });

    apiReq.on('error', (e)=>{
        console.log(`An error occurred: ${e.message}`);
        if(!headerWritten){
            res.writeHead(500, {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache'
            });
            headerWritten=true;
        }
        res.end(`<h1>500 Internal Server Error</h1><pre>An error occurred:\n${e.message.replace(/[^0-9A-Za-z ]/g,c=>"&#"+c.codePointAt(0)+";")}</pre>\n`);
    });

    apiReq.write(postData);
    apiReq.end();
});

const PORT=8080;
server.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}.\nVisit http://localhost:${PORT}/ in a web browser to test the server.`);
});
