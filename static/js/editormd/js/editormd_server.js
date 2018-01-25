const marked = require('marked');
const _ = require('lodash');
let editormd = {}

editormd.defaults = {
  mode: "gfm",          //gfm or markdown
  name: "",             // Form element name
  value: "",             // value for CodeMirror, if mode not gfm/markdown
  theme: "",             // Editor.md self themes, before v1.5.0 is CodeMirror theme, default empty
  editorTheme: "default",      // Editor area, this is CodeMirror theme at v1.5.0
  previewTheme: "",             // Preview area theme, default empty
  markdown: "",             // Markdown source code
  appendMarkdown: "",             // if in init textarea value not empty, append markdown to textarea
  width: "100%",
  height: "100%",
  path: "./lib/",       // Dependents module file directory
  pluginPath: "",             // If this empty, default use settings.path + "../plugins/"
  delay: 300,            // Delay parse markdown to html, Uint : ms
  autoLoadModules: true,           // Automatic load dependent module files
  watch: true,
  placeholder: "Enjoy Markdown! coding now...",
  gotoLine: true,
  codeFold: false,
  autoHeight: false,
  autoFocus: true,
  autoCloseTags: true,
  searchReplace: true,
  syncScrolling: true,           // true | false | "single", default true
  readOnly: false,
  tabSize: 4,
  indentUnit: 4,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseBrackets: true,
  showTrailingSpace: true,
  matchBrackets: true,
  indentWithTabs: true,
  styleSelectedText: true,
  matchWordHighlight: true,           // options: true, false, "onselected"
  styleActiveLine: true,           // Highlight the current line
  dialogLockScreen: true,
  dialogShowMask: true,
  dialogDraggable: true,
  dialogMaskBgColor: "#fff",
  dialogMaskOpacity: 0.1,
  fontSize: "13px",
  saveHTMLToTextarea: false,
  disabledKeyMaps: [],

  onload: function () { },
  onresize: function () { },
  onchange: function () { },
  onwatch: null,
  onunwatch: null,
  onpreviewing: function () { },
  onpreviewed: function () { },
  onfullscreen: function () { },
  onfullscreenExit: function () { },
  onscroll: function () { },
  onpreviewscroll: function () { },

  imageUpload: false,
  imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
  imageUploadURL: "",
  crossDomainUpload: false,
  uploadCallbackURL: "",

  toc: true,           // Table of contents
  tocm: false,           // Using [TOCM], auto create ToC dropdown menu
  tocTitle: "",             // for ToC dropdown menu btn
  tocDropdown: false,
  tocContainer: "",
  tocStartLevel: 1,              // Said from H1 to create ToC
  htmlDecode: false,          // Open the HTML tag identification 
  pageBreak: true,           // Enable parse page break [========]
  atLink: true,           // for @link
  emailLink: true,           // for email address auto link
  taskList: false,          // Enable Github Flavored Markdown task lists
  emoji: false,          // :emoji: , Support Github emoji, Twitter Emoji (Twemoji);
  // Support FontAwesome icon emoji :fa-xxx: > Using fontAwesome icon web fonts;
  // Support Editor.md logo icon emoji :editormd-logo: :editormd-logo-1x: > 1~8x;
  tex: false,          // TeX(LaTeX), based on KaTeX
  flowChart: false,          // flowChart.js only support IE9+
  sequenceDiagram: false,          // sequenceDiagram.js only support IE9+
  previewCodeHighlight: true,

  toolbar: true,           // show/hide toolbar
  toolbarAutoFixed: true,           // on window scroll auto fixed position
  toolbarIcons: "full",
  toolbarTitles: {},
  toolbarHandlers: {
    ucwords: function () {
      return editormd.toolbarHandlers.ucwords;
    },
    lowercase: function () {
      return editormd.toolbarHandlers.lowercase;
    }
  },
  toolbarCustomIcons: {               // using html tag create toolbar icon, unused default <a> tag.
    lowercase: "<a href=\"javascript:;\" title=\"Lowercase\" unselectable=\"on\"><i class=\"fa\" name=\"lowercase\" style=\"font-size:24px;margin-top: -10px;\">a</i></a>",
    "ucwords": "<a href=\"javascript:;\" title=\"ucwords\" unselectable=\"on\"><i class=\"fa\" name=\"ucwords\" style=\"font-size:20px;margin-top: -3px;\">Aa</i></a>"
  },
  toolbarIconsClass: {
    undo: "fa-undo",
    redo: "fa-repeat",
    bold: "fa-bold",
    del: "fa-strikethrough",
    italic: "fa-italic",
    quote: "fa-quote-left",
    uppercase: "fa-font",
    h1: editormd.classPrefix + "bold",
    h2: editormd.classPrefix + "bold",
    h3: editormd.classPrefix + "bold",
    h4: editormd.classPrefix + "bold",
    h5: editormd.classPrefix + "bold",
    h6: editormd.classPrefix + "bold",
    "list-ul": "fa-list-ul",
    "list-ol": "fa-list-ol",
    hr: "fa-minus",
    link: "fa-link",
    "reference-link": "fa-anchor",
    image: "fa-picture-o",
    code: "fa-code",
    "preformatted-text": "fa-file-code-o",
    "code-block": "fa-file-code-o",
    table: "fa-table",
    datetime: "fa-clock-o",
    emoji: "fa-smile-o",
    "html-entities": "fa-copyright",
    pagebreak: "fa-newspaper-o",
    "goto-line": "fa-terminal", // fa-crosshairs
    watch: "fa-eye-slash",
    unwatch: "fa-eye",
    preview: "fa-desktop",
    search: "fa-search",
    fullscreen: "fa-arrows-alt",
    clear: "fa-eraser",
    help: "fa-question-circle",
    info: "fa-info-circle"
  },
  toolbarIconTexts: {},

  lang: {
    name: "zh-cn",
    description: "开源在线Markdown编辑器<br/>Open source online Markdown editor.",
    tocTitle: "目录",
    toolbar: {
      undo: "撤销（Ctrl+Z）",
      redo: "重做（Ctrl+Y）",
      bold: "粗体",
      del: "删除线",
      italic: "斜体",
      quote: "引用",
      ucwords: "将每个单词首字母转成大写",
      uppercase: "将所选转换成大写",
      lowercase: "将所选转换成小写",
      h1: "标题1",
      h2: "标题2",
      h3: "标题3",
      h4: "标题4",
      h5: "标题5",
      h6: "标题6",
      "list-ul": "无序列表",
      "list-ol": "有序列表",
      hr: "横线",
      link: "链接",
      "reference-link": "引用链接",
      image: "添加图片",
      code: "行内代码",
      "preformatted-text": "预格式文本 / 代码块（缩进风格）",
      "code-block": "代码块（多语言风格）",
      table: "添加表格",
      datetime: "日期时间",
      emoji: "Emoji表情",
      "html-entities": "HTML实体字符",
      pagebreak: "插入分页符",
      "goto-line": "跳转到行",
      watch: "关闭实时预览",
      unwatch: "开启实时预览",
      preview: "全窗口预览HTML（按 Shift + ESC还原）",
      fullscreen: "全屏（按ESC还原）",
      clear: "清空",
      search: "搜索",
      help: "使用帮助",
      info: "关于" + editormd.title
    },
    buttons: {
      enter: "确定",
      cancel: "取消",
      close: "关闭"
    },
    dialog: {
      link: {
        title: "添加链接",
        url: "链接地址",
        urlTitle: "链接标题",
        urlEmpty: "错误：请填写链接地址。"
      },
      referenceLink: {
        title: "添加引用链接",
        name: "引用名称",
        url: "链接地址",
        urlId: "链接ID",
        urlTitle: "链接标题",
        nameEmpty: "错误：引用链接的名称不能为空。",
        idEmpty: "错误：请填写引用链接的ID。",
        urlEmpty: "错误：请填写引用链接的URL地址。"
      },
      image: {
        title: "添加图片",
        url: "图片地址",
        link: "图片链接",
        alt: "图片描述",
        uploadButton: "本地上传",
        imageURLEmpty: "错误：图片地址不能为空。",
        uploadFileEmpty: "错误：上传的图片不能为空。",
        formatNotAllowed: "错误：只允许上传图片文件，允许上传的图片文件格式有："
      },
      preformattedText: {
        title: "添加预格式文本或代码块",
        emptyAlert: "错误：请填写预格式文本或代码的内容。"
      },
      codeBlock: {
        title: "添加代码块",
        selectLabel: "代码语言：",
        selectDefaultText: "请选择代码语言",
        otherLanguage: "其他语言",
        unselectedLanguageAlert: "错误：请选择代码所属的语言类型。",
        codeEmptyAlert: "错误：请填写代码内容。"
      },
      htmlEntities: {
        title: "HTML 实体字符"
      },
      help: {
        title: "使用帮助"
      }
    }
  }
};

/**
     * 清除字符串两边的空格
     * Clear the space of strings both sides.
     * 
     * @param   {String}    str            string
     * @returns {String}                   trimed string    
     */

let trim = function (str) {
  return (!String.prototype.trim) ? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") : str.trim();
};

editormd.trim = trim;

/**
 * 所有单词首字母大写
 * Words first to uppercase
 * 
 * @param   {String}    str            string
 * @returns {String}                   string
 */

let wordsFirstUpperCase = function (str) {
  return str.toLowerCase().replace(/\b(\w)|\s(\w)/g, function ($1) {
    return $1.toUpperCase();
  });
};

let ucwords = wordsFirstUpperCase;

editormd.ucwords = editormd.wordsFirstUpperCase
/**
 * 字符串首字母大写
 * Only string first char to uppercase
 * 
 * @param   {String}    str            string
 * @returns {String}                   string
 */

let ucfirst = function (str) {
  return str.toLowerCase().replace(/\b(\w)/, function ($1) {
    return $1.toUpperCase();
  });
};

let firstUpperCase = ucfirst;

editormd.firstUpperCase = editormd.ucfirst

editormd.urls = {
  atLinkBase: "https://github.com/"
};

editormd.regexs = {
  atLink: /@(\w+)/g,
  email: /(\w+)@(\w+)\.(\w+)\.?(\w+)?/g,
  emailLink: /(mailto:)?([\w\.\_]+)@(\w+)\.(\w+)\.?(\w+)?/g,
  emoji: /:([\w\+-]+):/g,
  emojiDatetime: /(\d{2}:\d{2}:\d{2})/g,
  twemoji: /:(tw-([\w]+)-?(\w+)?):/g,
  fontAwesome: /:(fa-([\w]+)(-(\w+)){0,}):/g,
  editormdLogo: /:(editormd-logo-?(\w+)?):/g,
  pageBreak: /^\[[=]{8,}\]$/
};

// Emoji graphics files url path
editormd.emoji = {
  path: "http://www.emoji-cheat-sheet.com/graphics/emojis/",
  ext: ".png"
};

// Twitter Emoji (Twemoji)  graphics files url path    
editormd.twemoji = {
  path: "http://twemoji.maxcdn.com/36x36/",
  ext: ".png"
};
editormd.filterHTMLTags = function (html, filters) {
  if (typeof html !== "string") {
    html = new String(html);
  }

  if (typeof filters !== "string") {
    return html;
  }

  var expression = filters.split("|");
  var filterTags = expression[0].split(",");
  var attrs = expression[1];

  for (var i = 0, len = filterTags.length; i < len; i++) {
    var tag = filterTags[i];

    html = html.replace(new RegExp("\<\s*" + tag + "\s*([^\>]*)\>([^\>]*)\<\s*\/" + tag + "\s*\>", "igm"), "");
  }

  //return html;

  if (typeof attrs !== "undefined") {
    var htmlTagRegex = /\<(\w+)\s*([^\>]*)\>([^\>]*)\<\/(\w+)\>/ig;

    if (attrs === "*") {
      html = html.replace(htmlTagRegex, function ($1, $2, $3, $4, $5) {
        return "<" + $2 + ">" + $4 + "</" + $5 + ">";
      });
    }
  }

  return html;
}

editormd.markedRenderer = function (markdownToC, options) {
  var defaults = {
    toc: true,           // Table of contents
    tocm: false,
    tocStartLevel: 1,              // Said from H1 to create ToC  
    pageBreak: true,
    atLink: true,           // for @link
    emailLink: true,           // for mail address auto link
    taskList: false,          // Enable Github Flavored Markdown task lists
    emoji: false,          // :emoji: , Support Twemoji, fontAwesome, Editor.md logo emojis.
    tex: false,          // TeX(LaTeX), based on KaTeX
    flowChart: false,          // flowChart.js only support IE9+
    sequenceDiagram: false,          // sequenceDiagram.js only support IE9+
  };

  var settings = _.assign(defaults, options || {});
  var markedRenderer = new marked.Renderer();
  markdownToC = markdownToC || [];

  var regexs = editormd.regexs;
  var atLinkReg = regexs.atLink;
  var emojiReg = regexs.emoji;
  var emailReg = regexs.email;
  var emailLinkReg = regexs.emailLink;
  var twemojiReg = regexs.twemoji;
  var faIconReg = regexs.fontAwesome;
  var editormdLogoReg = regexs.editormdLogo;
  var pageBreakReg = regexs.pageBreak;

  markedRenderer.emoji = function (text) {

    text = text.replace(editormd.regexs.emojiDatetime, function ($1) {
      return $1.replace(/:/g, "&#58;");
    });

    var matchs = text.match(emojiReg);

    if (!matchs || !settings.emoji) {
      return text;
    }

    for (var i = 0, len = matchs.length; i < len; i++) {
      if (matchs[i] === ":+1:") {
        matchs[i] = ":\\+1:";
      }

      text = text.replace(new RegExp(matchs[i]), function ($1, $2) {
        var faMatchs = $1.match(faIconReg);
        var name = $1.replace(/:/g, "");

        if (faMatchs) {
          for (var fa = 0, len1 = faMatchs.length; fa < len1; fa++) {
            var faName = faMatchs[fa].replace(/:/g, "");

            return "<i class=\"fa " + faName + " fa-emoji\" title=\"" + faName.replace("fa-", "") + "\"></i>";
          }
        }
        else {
          var emdlogoMathcs = $1.match(editormdLogoReg);
          var twemojiMatchs = $1.match(twemojiReg);

          if (emdlogoMathcs) {
            for (var x = 0, len2 = emdlogoMathcs.length; x < len2; x++) {
              var logoName = emdlogoMathcs[x].replace(/:/g, "");
              return "<i class=\"" + logoName + "\" title=\"Editor.md logo (" + logoName + ")\"></i>";
            }
          }
          else if (twemojiMatchs) {
            for (var t = 0, len3 = twemojiMatchs.length; t < len3; t++) {
              var twe = twemojiMatchs[t].replace(/:/g, "").replace("tw-", "");
              return "<img src=\"" + editormd.twemoji.path + twe + editormd.twemoji.ext + "\" title=\"twemoji-" + twe + "\" alt=\"twemoji-" + twe + "\" class=\"emoji twemoji\" />";
            }
          }
          else {
            var src = (name === "+1") ? "plus1" : name;
            src = (src === "black_large_square") ? "black_square" : src;
            src = (src === "moon") ? "waxing_gibbous_moon" : src;

            return "<img src=\"" + editormd.emoji.path + src + editormd.emoji.ext + "\" class=\"emoji\" title=\"&#58;" + name + "&#58;\" alt=\"&#58;" + name + "&#58;\" />";
          }
        }
      });
    }

    return text;
  };

  markedRenderer.atLink = function (text) {

    if (atLinkReg.test(text)) {
      if (settings.atLink) {
        text = text.replace(emailReg, function ($1, $2, $3, $4) {
          return $1.replace(/@/g, "_#_&#64;_#_");
        });

        text = text.replace(atLinkReg, function ($1, $2) {
          return "<a href=\"" + editormd.urls.atLinkBase + "" + $2 + "\" title=\"&#64;" + $2 + "\" class=\"at-link\">" + $1 + "</a>";
        }).replace(/_#_&#64;_#_/g, "@");
      }

      if (settings.emailLink) {
        text = text.replace(emailLinkReg, function ($1, $2, $3, $4, $5) {
          return (!$2 && $.inArray($5, "jpg|jpeg|png|gif|webp|ico|icon|pdf".split("|")) < 0) ? "<a href=\"mailto:" + $1 + "\">" + $1 + "</a>" : $1;
        });
      }

      return text;
    }

    return text;
  };

  markedRenderer.link = function (href, title, text) {

    if (this.options.sanitize) {
      try {
        var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, "").toLowerCase();
      } catch (e) {
        return "";
      }

      if (prot.indexOf("javascript:") === 0) {
        return "";
      }
    }

    var out = "<a href=\"" + href + "\"";

    if (atLinkReg.test(title) || atLinkReg.test(text)) {
      if (title) {
        out += " title=\"" + title.replace(/@/g, "&#64;");
      }

      return out + "\">" + text.replace(/@/g, "&#64;") + "</a>";
    }

    if (title) {
      out += " title=\"" + title + "\"";
    }

    out += ">" + text + "</a>";

    return out;
  };

  markedRenderer.heading = function (text, level, raw) {

    var linkText = text;
    var hasLinkReg = /\s*\<a\s*href\=\"(.*)\"\s*([^\>]*)\>(.*)\<\/a\>\s*/;
    var getLinkTextReg = /\s*\<a\s*([^\>]+)\>([^\>]*)\<\/a\>\s*/g;

    if (hasLinkReg.test(text)) {
      var tempText = [];
      text = text.split(/\<a\s*([^\>]+)\>([^\>]*)\<\/a\>/);

      for (var i = 0, len = text.length; i < len; i++) {
        tempText.push(text[i].replace(/\s*href\=\"(.*)\"\s*/g, ""));
      }

      text = tempText.join(" ");
    }

    text = editormd.trim(text);

    var escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
    var toc = {
      text: text,
      level: level,
      slug: escapedText
    };

    var isChinese = /^[\u4e00-\u9fa5]+$/.test(text);
    var id = (isChinese) ? escape(text).replace(/\%/g, "") : text.toLowerCase().replace(/[^\w]+/g, "-");

    markdownToC.push(toc);

    var headingHTML = "<h" + level + " id=\"h" + level + "-" + this.options.headerPrefix + id + "\">";

    headingHTML += "<a name=\"" + text + "\" class=\"reference-link\"></a>";
    headingHTML += "<span class=\"header-link octicon octicon-link\"></span>";
    headingHTML += (hasLinkReg) ? this.atLink(this.emoji(linkText)) : this.atLink(this.emoji(text));
    headingHTML += "</h" + level + ">";

    return headingHTML;
  };

  markedRenderer.pageBreak = function (text) {
    if (pageBreakReg.test(text) && settings.pageBreak) {
      text = "<hr style=\"page-break-after:always;\" class=\"page-break editormd-page-break\" />";
    }

    return text;
  };

  markedRenderer.paragraph = function (text) {
    var isTeXInline = /\$\$(.*)\$\$/g.test(text);
    var isTeXLine = /^\$\$(.*)\$\$$/.test(text);
    var isTeXAddClass = (isTeXLine) ? " class=\"" + editormd.classNames.tex + "\"" : "";
    var isToC = (settings.tocm) ? /^(\[TOC\]|\[TOCM\])$/.test(text) : /^\[TOC\]$/.test(text);
    var isToCMenu = /^\[TOCM\]$/.test(text);

    if (!isTeXLine && isTeXInline) {
      text = text.replace(/(\$\$([^\$]*)\$\$)+/g, function ($1, $2) {
        return "<span class=\"" + editormd.classNames.tex + "\">" + $2.replace(/\$/g, "") + "</span>";
      });
    }
    else {
      text = (isTeXLine) ? text.replace(/\$/g, "") : text;
    }

    var tocHTML = "<div class=\"markdown-toc editormd-markdown-toc\">" + text + "</div>";

    return (isToC) ? ((isToCMenu) ? "<div class=\"editormd-toc-menu\">" + tocHTML + "</div><br/>" : tocHTML)
      : ((pageBreakReg.test(text)) ? this.pageBreak(text) : "<p" + isTeXAddClass + ">" + this.atLink(this.emoji(text)) + "</p>\n");
  };

  markedRenderer.code = function (code, lang, escaped) {

    if (lang === "seq" || lang === "sequence") {
      return "<div class=\"sequence-diagram\">" + code + "</div>";
    }
    else if (lang === "flow") {
      return "<div class=\"flowchart\">" + code + "</div>";
    }
    else if (lang === "math" || lang === "latex" || lang === "katex") {
      return "<p class=\"" + editormd.classNames.tex + "\">" + code + "</p>";
    }
    else {

      return marked.Renderer.prototype.code.apply(this, arguments);
    }
  };

  markedRenderer.tablecell = function (content, flags) {
    var type = (flags.header) ? "th" : "td";
    var tag = (flags.align) ? "<" + type + " style=\"text-align:" + flags.align + "\">" : "<" + type + ">";

    return tag + this.atLink(this.emoji(content)) + "</" + type + ">\n";
  };

  markedRenderer.listitem = function (text) {
    if (settings.taskList && /^\s*\[[x\s]\]\s*/.test(text)) {
      text = text.replace(/^\s*\[\s\]\s*/, "<input type=\"checkbox\" class=\"task-list-item-checkbox\" /> ")
        .replace(/^\s*\[x\]\s*/, "<input type=\"checkbox\" class=\"task-list-item-checkbox\" checked disabled /> ");

      return "<li style=\"list-style: none;\">" + this.atLink(this.emoji(text)) + "</li>";
    }
    else {
      return "<li>" + this.atLink(this.emoji(text)) + "</li>";
    }
  };

  return markedRenderer;
};

const markdownToHTML = function (options) {
  let settings = _.merge(editormd.defaults, options);
  let defaults = {
    gfm: true,
    toc: true,
    tocm: false,
    tocStartLevel: 1,
    tocTitle: "目录",
    tocDropdown: false,
    tocContainer: "",
    markdown: "",
    markdownSourceCode: false,
    htmlDecode: false,
    autoLoadKaTeX: true,
    pageBreak: true,
    atLink: true,    // for @link
    emailLink: true,    // for mail address auto link
    tex: false,
    taskList: false,   // Github Flavored Markdown task lists
    emoji: false,
    flowChart: false,
    sequenceDiagram: false,
    previewCodeHighlight: true
  };
  let markdownDoc = settings.markdown;
  let markdownToC = [];

  if (settings.markdown === "") {
    throw new Error('md内容不能为空');
  }

  let rendererOptions = {
    toc: settings.toc,
    tocm: settings.tocm,
    tocStartLevel: settings.tocStartLevel,
    taskList: settings.taskList,
    emoji: settings.emoji,
    tex: settings.tex,
    pageBreak: settings.pageBreak,
    atLink: settings.atLink,           // for @link
    emailLink: settings.emailLink,        // for mail address auto link
    flowChart: settings.flowChart,
    sequenceDiagram: settings.sequenceDiagram,
    previewCodeHighlight: settings.previewCodeHighlight,
  };

  var markedOptions = {
    renderer: editormd.markedRenderer(markdownToC, rendererOptions),
    gfm: settings.gfm,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: (settings.htmlDecode) ? false : true, // 是否忽略HTML标签，即是否开启HTML标签解析，为了安全性，默认不开启
    smartLists: true,
    smartypants: true
  };

  markdownDoc = new String(markdownDoc);

  let markdownParsed = marked(markdownDoc, markedOptions);

  markdownParsed = editormd.filterHTMLTags(markdownParsed, settings.htmlDecode);

  return markdownParsed;
}

module.exports = {
  markdownToHTML
}