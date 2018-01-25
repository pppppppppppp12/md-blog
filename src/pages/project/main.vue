<template>
  <!-- 文档纵向滚动条 -->
  <div class="doc-wrapper small-scroll-y small-scroll-8" id="J_scroll">
    <!-- 文档内容 -->
    <div class="doc-content" id="J_descript_wrapper">
      <h1 v-show="descript">{{name}}</h1>
      <p class="tips" v-show="!descript">文档为空</p>
      <div class="editor-txt editormd" id="J_descript">
        <textarea cols="30" rows="10" v-html="descript" hidden></textarea>
      </div>
    </div>
  </div>
</template>
<script>
  // editormd中生成<script>来按需加载依赖文件，此处用$script
  import $script from 'scriptjs'
  // 防止xss攻击，initmd中传入，在md解析成html后进行过滤，渲染html前执行
  import xss from 'xss'
  import $ from 'jquery'
  import '../../plugins/editormd/css/editormd.css'

  export default {
    data () {
      return {
        descript: '',
        name: ''
      }
    },
    props: {
      'dataPath': {
        type: String,
        default: '/static/data/' // md文档 模拟数据
      },
      'editorPath': {
        type: String,
        default: '/static/js/editormd/' // 插件放在static，不打包在库文件中，按需加载
      }
    },
    computed: {
      reloadFlag () {
        return this.$store.state.doc.reload
      }
    },
    watch: {
      'reloadFlag': 'getDocDetail'
    },
    mounted () {
      // md渲染依赖文件
      let scriptArr = [
        [
          `${this.editorPath}lib/marked.min.js`,
          // `${this.editorPath}lib/marked.js`, // 修改过，需要单独打包成marked.min，原版见marked_bd
          `${this.editorPath}lib/prettify.min.js`,
          `${this.editorPath}lib/raphael.min.js`,
          `${this.editorPath}lib/flowchart.min.js`
        ],
        [
          `${this.editorPath}lib/underscore.min.js`,
          `${this.editorPath}lib/sequence-diagram.min.js`,
          `${this.editorPath}lib/jquery.flowchart.min.js`
        ],
        [
          `${this.editorPath}js/editormd.min.js`
          // `${this.editorPath}js/editormd.js` // 修改过，需要单独打包成editormd.min，原版见editormd_bd
        ]
      ]
      // 避免插件中scriptList重复加载
      this.initLoadScript(scriptArr)
    },
    methods: {
      loadScript (loadList, callback) {
        if (loadList.length) {
          $script(loadList, callback)
        } else {
          callback()
        }
      },
      initLoadScript (scriptArr) {
        let scriptList = document.getElementsByTagName('script')
        for (let i = scriptList.length - 1; i >= 0; i--) {
          if (!scriptList[i] || !scriptList[i].src) continue
          scriptArr.forEach((val, index) => {
            val.forEach((val1, index1) => {
              if (scriptList[i].src.includes(val1)) {
                val = val.splice(index1, 1)
              }
            })
          })
        }
        this.loadScript(scriptArr[0], () => {
          this.loadScript(scriptArr[1], () => {
            this.loadScript(scriptArr[2], () => {
              this.initMd(this.descript)
            })
          })
        })
        this.getDocDetail()
      },
      // 获取md文档详情
      getDocDetail () {
        this.descript = this.$store.state.doc.selectDoc.descript
        this.name = this.$store.state.doc.selectDoc.name
        if (window.editormd) this.initMd(this.descript)
      },
      // 初始化md解析
      initMd (data) {
        let $this = this
        $this.$nextTick((editormd = window.editormd) => {
          document.getElementById('J_descript').innerHTML = '' // 重置文本内容
          editormd.markdownToHTML('J_descript', {
            markdown: data,                     // $("#append-test").text()
            htmlDecode: 'style,script,iframe',  // you can filter tags decode
            tocm: true,    // Using [TOCM]
            markdownSourceCode: true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
            emoji: true,
            taskList: true,
            // tex: true,  // 默认不解析
            flowChart: true,  // 默认不解析
            sequenceDiagram: true,  // 默认不解析
            xss: xss,
            path: '/static/js/editormd/lib/',
            onload: function () { // 初始化渲染完毕，回调
              // 初始化右侧栏
              $this.initRight()
              const $dom = $('#J_descript')
              // 处理表格（修复 在最后一个单元格为空的情况下会缺块）
              $dom.find('table').each(function () {
                let $this = $(this)
                if ($this.find('tr').width() >= $dom.width()) {
                  $this[0].className = 'overflow-table'
                }
                let cellsIndex = $this.find('tr').eq(0)[0].cells.length
                $this.find('tr').each(function () {
                  if (this.cells.length < cellsIndex) {
                    let td = document.createElement('td')
                    this.appendChild(td)
                  }
                })
              })
            }
          })
        })
      },
      initRight () {
        // 获取详情后，改变右侧导航标题
        let childArr = document.getElementById('J_descript').children
        let titleArr = [{
          'dom': document.getElementById('J_descript_wrapper').children[0],
          'index': 0,
          'subtitle': []
        }]
        let titleIndex = 1 // 一级标题index
        let subtitleIndex = 0 // 二级标题index
        let index = 1
        // 初始化标题信息
        for (let i = 0; i < childArr.length; i++) {
          if (childArr[i].tagName === 'H1') {
            let titleObj = {
              'dom': childArr[i],
              'index': i, // dom在文档中的序号
              'subtitle': []
            }
            // 为空处理
            if (childArr[i].innerText === '') continue
            titleArr.push(titleObj)
            titleIndex++
            subtitleIndex = 0 // 重置二级标题index
          } else if (childArr[i].tagName === 'H2') {
            let subtitle = {
              dom: childArr[i],
              index: i,
              subtitle: [] // 三级标题
            }
            // 父级标题为空处理
            let name = childArr[i].innerText
            name = name.replace(/\n/g, '') // 空标题过滤
            if (name === '') continue
            titleArr[titleIndex - 1].subtitle.push(subtitle) // 插入到一级标题 subtitle
            subtitleIndex++
          } else if (childArr[i].tagName === 'H3') {
            let subtitle2 = {
              dom: childArr[i],
              index: i
            }
            // 父级标题为空处理
            let name = childArr[i].innerText
            name = name.replace(/\n/g, '')
            if (name === '') continue
            if (!titleArr[titleIndex - 1].subtitle[subtitleIndex - 1]) { // 无二级标题
              subtitleIndex++
              index++
              titleArr[titleIndex - 1].subtitle[subtitleIndex - 1] = {
                dom: {},
                index: i,
                subtitle: []
              }
            }
            titleArr[titleIndex - 1].subtitle[subtitleIndex - 1].subtitle.push(subtitle2) // 插入到二级标题 subtitle
          }
          if (this.loginFlag && (/(H1)|(H2)|(H3)/).test(childArr[i].tagName)) {
            this.addTitleEdit(childArr[i], index)
            index++
          }
        }
        // console.log(titleArr)
        this.$store.state.anchor.anchorList = titleArr
        // 切换回顶部
        if (this.$route.hash === '') {
          let scrollItem = document.getElementById('J_scroll')
          scrollItem.scrollTop = 0
        }
      }
    }
  }
</script>
<style lang="less">
  .doc-wrapper {
    display: inline-block;
    vertical-align: top;
    z-index: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow-y: scroll;
  }
  .tips {
    color: #999;
  }
  // 编辑器外层样式
  .editor-txt {
    padding: 0;
    width: 100%;
    word-break: break-all;
    height: auto;
    border: 0;
    margin-bottom: 0;
    position: static;
    padding-bottom: 30px;
    h1, h2, h3, h4, h5, h6 {
      font-weight: normal;
    }
  }
  .doc-content {
    position: absolute;
    top: 0;
    // left: 50%;
    left: 30px;
    width: 820px;
    // margin-left: -370px;
    > h1 {
      padding-bottom: 0.3em;
      font-size: 2.25em;
      line-height: 1.2;
      border-bottom: 1px solid #e8e4e4;
    }
  }
</style>