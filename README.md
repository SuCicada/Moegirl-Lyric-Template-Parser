
<h1 align='center' style="color: #228b22">
    Moegirl-Lyric-Template-Parser
</h1>

一个歌词模板解析器, 用于显示在网页中, js驱动.适配手机.

歌词模板借鉴了[萌娘百科](https://zh.moegirl.org.cn/Mainpage)的[LyricKai模板](https://zh.moegirl.org.cn/Template:LyricsKai)

声明: 此项目只是学习娱乐使用, 解析逻辑是自制的, 和萌百本身无关.

### 使用方法:
```
<script src="https://sucicada.github.io/Moegirl-Lyric-Template-Parser/moelyrics.js"></script>
```
- 1. 第一种最简单的方法, 注意想要自动解析只能使用`lyrics`标签
    ```html
     <lyrics hidden>
        放置你的歌词
     </lyrics>
    <!-- 只要引入这个js 就能自动解析 lyrics 标签中的歌词了 -->
     <script src="sucicada.github.io/Moegirl-Lyric-Template-Parser/dist/moelyrics.min.js"></script>

    ```
- 2. 显示调用, 一般用于一个页面需要显示多段歌词, 这里不要使用`lyrics`标签
    ```html
    <div id="main1 hidden>
        歌词
    </div>
    <script src="https://sucicada.github.io/Moegirl-Lyric-Template-Parser/dist/moelyrics.min.js"></script>
    <script>
        build("main1") // 通过传入 标签的id 来触发解析
    </script>
    ```
- 3. 关于`hidden`属性的说明: 因为解析存在延时, 所以为了页面观感, 可以一开始将标签隐藏
- 4. 关于 hexo 的 markdown 博客使用
因为 markdown 支持 html 标签, 所以我们可以直接写, 但是因为 hexo 会对`{{}}`进行解析
所以我们需要在我们的 html 前后加入
```
{% raw %}
    <html>
{% endraw %}
```
参考: https://blog.csdn.net/Calvin_zhou/article/details/109303640


### 效果展示
- [Demo 效果展示](https://sucicada.github.io/Moegirl-Lyric-Template-Parser/example.html)
### 注意
- 目前不支持在一个标签中嵌套多个 `LyricKai` 模板
- 可能对于一些特殊的歌词模板没有支持, 后续会在使用的过程逐渐完善

---
### 解析逻辑讲解
这里使用了正则来解析, 从最内层的`{{}}`开始进行正则替换, 这里没有使用传统的中缀表达.因为太复杂....

- 其次会解析`LyricKai`的参数,
- 然后替换斜体和粗体字
- 换行替换
- 最内层的`{{}}`组合就是`PT`即注音词系列.
- `coloredlink` 即颜色链接
- `color`
  这里因为可能涉及到多层`color`嵌套, 所以定义了一个`String`用的迭代计算函数: `iterator`
- `original`和`translated`原始歌词和翻译
- `LyricsKai` 处理, 用于兼容一些不适用`LyricsKai`的歌词

因为 css 使用了 `white-space: pre-wrap`, 所以在解析替换填充歌词的时候要格外注意多余的空格和换行

当然目前这种 js 的迭代正则替换的方式, 在性能上及其低下, 但得力于如今优秀的 CPU. 目前先这样处理.

### todo
- [ ] hexo 编译器版本
- [ ] 支持 `VOCALOID Songbox Introduction` 解析
- [ ] 减少生成的 js 的大小
----
(ps: 可以吐槽的吧, 我根本不会前端,不会css, 模板解析什么的也不懂, 绞尽脑汁花了几十个小时才搞出个这样.
想要找人讨论也不认识玩前端的. 我只是想在能手机上背歌词而已,
算了......说什么都是徒然, 锚定当下
"我啊, 真是个笨蛋呢"
![](./sayaka.png)
)
