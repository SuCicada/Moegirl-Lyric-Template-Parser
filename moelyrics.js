JS = {
    jquery: "https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"
    , utils: window['DEBUG'] ? "utils.js" : "https://sucicada.github.io/Moegirl-Lyric-Template-Parser/utils.js"
}

window.onload = async function () {
    await build()
}

function loadJS(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function () {
            console.log(url + " load success")
            resolve && resolve();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    })
}

async function addPTB() {
    await loadJS(JS.jquery)
    const button = $("#photrans-button");
    button.html('[<a href="javascript: void(0);"></a>]');
    const a = button.find("a");
    const body = $("body");
    const {toVisible, toHidden} = button[0].dataset;
    a.text(toHidden);
    button.on("click", () => {
        body.toggleClass("photrans-ruby-hidden");
        a.text(body.hasClass("photrans-ruby-hidden") ? toVisible : toHidden);
        return false;
    });
}

async function parse(text) {
    await loadJS(JS.utils)

    let style = {
        width: "100%",
        reserveWidth: "267px"
    }
    let colorReg = /{{color\|([#\w]+)\|(((?!{{color)[\w\W])+?)}}/g
    let lyricKai = {}
    let lyrics = text
        // 提取 style
        .replace(/\s*({{PT\/B}}|{{Photrans2\/button}})\s*/g, _ => {
            addPTB()
            return `<div style="text-align: right;" id="photrans-button" data-to-visible="开启注音" data-to-hidden="关闭注音">
                [<a href="javascript: void(0);" style="">关闭注音</a>]
            </div>`
        })
        .replace(/\|(lstyle|rstyle|reserveWidth)=([\w\W]+?)(?=(\||}}))/g,
            (_, key, value) => {
                style[key] = value.trim()
                return ""
            })
        .replace(/'{5}([\W\w]+?)'{5}/g, `<i><b>$1</b></i>`)
        .replace(/'{3}([\W\w]+?)'{3}/g, `<i>$1</i>`)
        .replace(/'{2}([\W\w]+?)'{2}/g, `<b>$1</b>`)
        // 整理回车, 用于之后的 br 换行替换, 以防乱格式
        .replace(/[\n]+[\t ]*\|(original|translated)=[\t ]*[\n]+/g, `\|$1=\n`)
        .replace(/\n/g, `<br>`)
        // PT lyric
        .replace(/{{(PT|Photrans2|ruby)\|(.+?)\|(.+?)}}/g,
            (match, _, word, hiragana, index, str) => {
                return `<ruby class="photrans"><rb>${word.trim()}</rb><rt style="font-size:0.75em">` +
                    `<span class="template-ruby-hidden">（</span>${hiragana.trim()}` +
                    `<span class="template-ruby-hidden">）</span></rt></ruby>`
            })
        .replace(/{{color_block\|([#\w]+)}}/g, (_, color) =>
            `<span title="blue" style="width:10px;height:10px;background-color:${color};display:inline-block;"></span>`
        )
        .replace(/{{coloredlink\|([#\w]+)\|(\W+)\|(((?!{{coloredlink)[\w\W])+?)}}/g,
            (_, color, title, s) =>
                `<a href="https://zh.moegirl.org.cn/${title}" title="${title}" style=""><span style="color:${color}">${s.trim()}</span></a>`
        )
        // lyric color
        // https://blog.stevenlevithan.com/archives/javascript-match-nested
        .iterator(str => {
                return str.replace(colorReg,
                    (_, color, s) => `<span style="color:${color}">${s.trim()}</span>`)
            }, str => colorReg.test(str)
        )
        .replace(/\|(original|translated)=([\w\W]+?)(?=(\||}}))/g,
            (_, key, value) => {
                lyricKai[key] = value.trim()
                return ""
            })
        .replace(/{{LyricsKai(\w\W)*}}/, (_, str) => {
            return `
        <div class="Lyrics Lyrics-has-ruby" style="width:calc(${style['width']} - ${style['reserveWidth']});">
        ${(() => {
                    let original = lyricKai['original'].trim().substr("<br>".length).split("<br>")
                        , translated = lyricKai['translated'].trim().substr("<br>".length).split("<br>")
                        , lines = ""
                    for (let i = 0; i < original.length; i++) {
                        lines += `
                            <div class="Lyrics-line">
                                <div class="Lyrics-original" style="${style['lstyle']}"><span lang="ja">${original[i]}</span></div>
                                <div class="Lyrics-translated" style="${style['rstyle']}"><span lang="zh">${translated[i]}</span></div>
                            </div>`
                    }
                    return lines
                }
            )()}
        </div>`
        })

    let res = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=2, user-scalable=yes">
        <!--    添加到主屏幕后，全屏显示。-->
        <meta name="apple-touch-fullscreen" content="no">
        <!--    这meta的作用就是删除默认的苹果工具栏和菜单栏。content有两个值”yes”和”no”,当我们需要显示工具栏和菜单栏时，这个行meta就不用加了，默认就是显示。-->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <style>
            ${getCSS()}
        </style>
        <div class="mw-parser-output">
            ${lyrics}
        </div>`
    // console.log(res)
    // console.log(style)
    // console.log(lyricKai['original'])
    // console.log(lyricKai['translated'])
    // console.log(lyric['original'].split("<br>"))
    return res
}

function getCSS() {
    return `<style>
    .mw-parser-output .Lyrics {
        display: inline-block;
        font-size: 18px;
    }
    
    .mw-parser-output .Lyrics.Lyrics-has-ruby .Lyrics-original, .mw-parser-output .Lyrics.Lyrics-has-ruby .Lyrics-translated {
        line-height: 2.1
    }
    
    .mw-parser-output .Lyrics.Lyrics-no-ruby .Lyrics-original, .mw-parser-output .Lyrics.Lyrics-no-ruby .Lyrics-translated {
        vertical-align: top
    }
    
    .mw-parser-output .Lyrics .Lyrics-original, .mw-parser-output .Lyrics .Lyrics-translated {
        width: 100%;
        display: inline-block;
        white-space: pre-wrap
    }
    
    @media all and (max-width: 720px) {
        .mw-parser-output .Lyrics {
            min-width: 100%
        }
    }
    
    @media all and (min-width: 720px) {
        .mw-parser-output .Lyrics .Lyrics-original, .mw-parser-output .Lyrics .Lyrics-translated {
            width: 47.85%
        }
    }
    
    /*  用来隐藏注音 */
    rb[data-id="template-ruby"]::before, .template-ruby-hidden {
        display: inline-block;
        width: 0;
        font-size: 0;
    }
    
    body.photrans-ruby-hidden ruby.photrans > rt {
        display: none;
    }
</style>`
}

async function build(div) {
    let element
    if (div) {
        element = document.getElementById(div)
    } else {
        element = document.getElementsByTagName("lyrics")[0]
    }
    if (element) {
        let begin = new Date().getTime();
        let text = element.innerHTML
        element.innerHTML = await parse(text)
        element.hidden = false
        let end = new Date().getTime() - begin;
        console.log(`build ${element.tagName} (${element.id}): ${end}ms`)
    }
}
