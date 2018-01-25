<template>
  <ul class="catalog-list" :class="{'fix': fixFlag}" :style="styleObj" v-show="$store.state.doc.selectDoc.document_id">
    <ul class="small-scroll-y" id="J_scroll_bar" v-if="titleList.length">
      <li class="text-overflow" 
        v-for="(title, index) in titleList" :key="title.index"
        :class="{'active': (nowItem == title.index||(nowItem>title.index&&nowItem<=title.index+title.subCount))}" 
        @click="toTitlePos(title.index)">
        <span class="text-overflow" :title="title.name">{{title.name}}</span>
        <p v-for="(subtitle1, index1) in title.subtitle" :key="subtitle1.index"
          :class="{'active': (nowItem == subtitle1.index)||(nowItem>subtitle1.index&&nowItem<=subtitle1.index+subtitle1.subtitle.length), 
                    'empty-active': !subtitle1.name}" 
          @click.stop="toTitlePos(subtitle1.index)" 
          :title="subtitle1.name">
          <span class="text-overflow" v-show="subtitle1.name">{{subtitle1.name}}</span>
          <span class="subtitle-item" 
            v-for="(subtitle2) in subtitle1.subtitle" :key="subtitle2.index"
            :class="{'active': nowItem == subtitle2.index}" 
            @click.stop="toTitlePos(subtitle2.index)" 
            :title="subtitle2.name">
            <span class="text-overflow">{{subtitle2.name}}</span>
          </span>
        </p>
      </li></ul>
    <span class="back-to-top" @click="toTitlePos(0, true)" v-show="titleList.length!=0 && fixFlag"></span>
  </ul>
</template>
<script>
  import $ from 'jquery'
  export default {
    data () {
      return {
        fixFlag: false, // 右侧导航是否固定，超出 title1 位置时，true 固定,
        firstFix: 0,
        nowItem: 0, // 当前 title
        distance: 40, // 滚动时离标题的 150px 的距离时，导航变化 active
        beforeScrollTop: 0, // 用于储存上一次的滚动位置，判断滚动方向
        scrollItem: null,
        clickFlag: [],
        clickFlagIndex: 0,
        winWidth: 0
      }
    },
    computed: {
      titleList () {
        let titleObj = []
        let anchorArr = this.$store.state.anchor.anchorList
        let titleIndex = 0
        let subCount = 0
        for (let i = 0; i < anchorArr.length; i++) {
          if (!anchorArr[i].dom) return []
          let title = {
            name: anchorArr[i].dom.innerText,
            index: titleIndex,
            subtitle: [],
            subCount: 0
          }
          subCount = 0
          titleIndex++
          if (!anchorArr[i].subtitle) continue
          for (let j = 0; j < anchorArr[i].subtitle.length; j++) {
            let subtitle = {
              name: anchorArr[i].subtitle[j].dom.innerText,
              index: titleIndex,
              subtitle: []
            }
            titleIndex++
            subCount++
            if (!anchorArr[i].subtitle[j].subtitle) continue
            for (let k = 0; k < anchorArr[i].subtitle[j].subtitle.length; k++) {
              let subtitle2 = {
                name: anchorArr[i].subtitle[j].subtitle[k].dom.innerText,
                index: titleIndex
              }
              subtitle.subtitle.push(subtitle2)
              titleIndex++
              subCount++
            }
            title.subtitle.push(subtitle)
          }
          title.subCount = subCount
          titleObj = titleObj.concat(title)
        }
        return titleObj
      },
      dom () {
        // 处理标题数据
        let domArr = []
        let anchorArr = this.$store.state.anchor.anchorList
        for (let i = 0; i < anchorArr.length; i++) {
          let subtitleDom = []
          for (let j = 0; j < anchorArr[i].subtitle.length; j++) {
            subtitleDom.push(anchorArr[i].subtitle[j].dom)
            for (let k = 0; k < anchorArr[i].subtitle[j].subtitle.length; k++) {
              subtitleDom.push(anchorArr[i].subtitle[j].subtitle[k].dom)
            }
          }
          var titleDom = [].concat(anchorArr[i].dom).concat(subtitleDom)
          domArr = domArr.concat(titleDom)
        }
        return domArr
      },
      styleObj () {
        return {
          'width': this.winWidth < 1200
            ? '155px'
            : (document.getElementById('J_scroll').clientWidth - 1200) / 2 + 155 + 'px'
        }
      }
    },
    mounted () {
      this.getWinWidth()
      window.addEventListener('resize', this.getWinWidth)
      this.scrollItem = document.getElementById('J_scroll')
      // 添加滚动事件监听
      this.scrollItem.addEventListener('scroll', this.scrollEvent)
    },
    destroyed () {
      window.removeEventListener('resize', this.getWinWidth)
      // 取消滚动事件监听
      if (!this.scrollItem) return
      this.scrollItem.removeEventListener('scroll', this.scrollEvent)
    },
    methods: {
      getWinWidth () {
        this.winWidth = document.body.offsetWidth
      },
      getWinHeight () {
        return window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight)
      },
      scrollTop (pos) {
        if (pos === 0 || pos) {
          this.scrollItem.scrollTop = pos
          // if(window.pageYOffset) window.pageYOffset = pos;  //用于FF(window)
        } else {
          return this.scrollItem.scrollTop
          // console.log(this.scrollItem.scrollTop)
        }
      },
      // 滚动监听事件
      scrollEvent (e) {
        this.scrollFix()
        if (this.dom.length === 0 || this.getWinHeight() === this.scrollItem.scrollHeight) return
        if (this.clickFlag[this.clickFlag.length - 1]) return

        let currItem = 0
        let activeFlag = false
        let lastPagePos = this.scrollItem.scrollHeight - this.getWinHeight()
        let firstFix = this.firstFix

        if (this.scrollTop() > firstFix) { // 位置大于标题1时
          for (let i = 0; i <= this.dom.length - 1; i++) {
            let domPos = this.dom[i].offsetTop - this.distance // this.distance 为active 的 范围
            let domText = this.dom[i].innerText
            ;((pos, text) => {
              if (text && !text.replace(/\n/, '')) return // 处理空行的active -> 停留在上一个
              if (!pos) return
              if ((pos >= lastPagePos) && (this.scrollTop() > lastPagePos - 20)) { // 标题在最后一页，且滚动到最后一页
                if (this.scrollTop() >= lastPagePos && (this.nowItem === (this.dom.length - 1))) { // 滚动到最底部的定位
                  this.nowItem = this.dom.length - 1
                } else {
                  this.nowItem = (this.nowItem >= this.dom.length - 1) ? (this.dom.length - 1) : (parseInt(this.nowItem) + 1)
                }
              } else if ((this.scrollTop() <= lastPagePos - 20) && this.scrollTop() > pos - this.distance) { // 判断是否滚动到各标题的位置
                currItem = i
                activeFlag = true
              }
            })(domPos, domText)
          }
        } else {
          currItem = 0
          activeFlag = true
        }
        this.beforeScrollTop = this.scrollTop()
        if (activeFlag) this.nowItem = currItem
        this.setTitleActive(this.nowItem)

        let scrollDom = document.getElementById('J_scroll_bar')
        if (!scrollDom) return // 终止，防止监听事件未取消
        if (scrollDom && scrollDom.clientHeight >= scrollDom.scrollHeight) return // 需要滚动时才执行
        for (let i = 0; i < scrollDom.childNodes.length; i++) {
          if (scrollDom.childNodes[i].childNodes.length <= 2) {
            this.scrollBarAuto(scrollDom.childNodes[i])
          } else {
            for (let j = 0; j < scrollDom.childNodes[i].childNodes.length; j++) {
              if (scrollDom.childNodes[i].childNodes[j].childNodes.length <= 2) {
                this.scrollBarAuto(scrollDom.childNodes[i].childNodes[j])
              } else {
                for (let k = 0; k < scrollDom.childNodes[i].childNodes[j].childNodes.length; k++) {
                  this.scrollBarAuto(scrollDom.childNodes[i].childNodes[j].childNodes[k])
                }
              }
            }
          }
        }
      },
      // 导航到达边界自动滚动到中间
      scrollBarAuto (listDom) {
        let scrollDom = document.getElementById('J_scroll_bar')
        if (!listDom.className || !listDom.className.includes('active')) return
        let offsetTop = listDom.tagName === 'P'
          ? listDom.offsetTop + listDom.offsetParent.offsetTop + listDom.offsetParent.offsetParent.offsetTop
          : listDom.offsetTop + listDom.offsetParent.offsetTop + listDom.offsetParent.offsetParent.offsetTop + listDom.offsetParent.offsetParent.offsetParent.offsetTop
        let range = 20 // 到达底部距离
          // console.log(2,scrollDom.scrollTop, offsetTop)
        if (scrollDom.clientHeight < offsetTop - scrollDom.scrollTop + range) { // 自动向下滚
          scrollDom.scrollTop = scrollDom.clientHeight * 2 / 3 + scrollDom.scrollTop
          console.log(offsetTop, '000', offsetTop - scrollDom.scrollTop, listDom)
        } else if (offsetTop - scrollDom.scrollTop - range <= 0) { // 自动向上滚
          scrollDom.scrollTop = scrollDom.scrollTop - scrollDom.clientHeight * 2 / 3
          console.log(offsetTop, '111', offsetTop - scrollDom.scrollTop, listDom)
        } else {
          console.log(offsetTop, '222', offsetTop - scrollDom.scrollTop, listDom)
        }
      },
      // 右侧栏底部，滚动回顶部按钮出现
      scrollFix () {
        let flag = this.scrollTop() > this.firstFix
        this.fixFlag = flag
      },
      // 右侧导航 active
      setTitleActive (index) {
        for (let i = 0; i <= this.dom.length - 1; i++) {
          if (this.dom[i].style) {
            this.dom[i].style.color = '#000000'
            this.dom[i].className = ''
          }
        }
        if (this.dom[index] && this.dom[index].style) {
          this.dom[index].style.color = '#44a542'
          this.dom[index].className = 'active'
        }
      },
      // 触发导航定位
      toTitlePos (index, backToTop, firstLoad) {
        if (this.titleList.length === 0) return
        this.clickFlag[this.clickFlagIndex] = true
        let total = backToTop ? 0 : this.dom[index].offsetTop
        this.titlePosScroll(index, total, this.clickFlagIndex)
        this.clickFlagIndex ++
      },
      // 导航定位
      titlePosScroll (index, total, clickFlagIndex) {
        this.nowItem = index
        this.setTitleActive(index)
        $(this.scrollItem).stop().animate({
          'scrollTop': total - this.distance
        }, 200, 'linear', () => {
          setTimeout(() => {
            this.clickFlag[clickFlagIndex] = false
            if (!this.clickFlag[this.clickFlag.length - 1]) {
              this.clickFlag = []
              this.clickFlagIndex = 0
            }
            this.scrollItem.addEventListener('scroll', this.scrollEvent)
          }, 500)
        })
      }
    }
  }
</script>
<style lang="less">
  @green: #44a542;
  .catalog-list {
    position: absolute;
    top: 0;
    right: 10px;
    text-align: left;
    z-index: 1;
    width: 100%;
    height: 100%;
    line-height: 35px;
    font-size: 14px;
    color: #666;
    padding: 26px 0 135px 0;
    pointer-events: none;
    > ul {
      // background-color: #f9f9f9;
      // padding: 8px 15px 15px 15px;
      overflow-y: auto;
      pointer-events: auto;
      max-height: 100%;
      min-width: 150px;
    } 
    li {
      position: relative;
      padding-left: 20px;
      cursor: pointer;
      white-space: nowrap;
      p {
        padding-left: 8px;
        display: none;
        color: #666;
        &.active {
          color: @green;
          position: relative;
          // font-weight: bold;
          &:before {
            content: "";
            display: inline-block;
            width: 5px;
            height: 5px;
            background-color: @green;
            border-radius: 100%;
            position: absolute;
            top: 16px;
            left: -15px;
          }
          .subtitle-item {
            color: #666;
            display: block;
          }
          &.empty-active {
            &:before {
              display: none;
            }
            .subtitle-item {
              display: block;
            }
          }
        }
        > span {
          display: inline-block;
          vertical-align: top;
          width: 100%;
        }
        > span:first-child:hover {
          text-decoration: underline;
          color: @green;
        }
        .subtitle-item {
          padding-left: 16px;
          position: relative;
          display: none;
          span {
            display: inline-block;
            vertical-align: top;
            width: 100%;
          }
          &:hover span {
            color: @green;
            text-decoration: underline;
          }
          &.active {
            color: @green;
            &:before {
              content: "";
              display: inline-block;
              width: 5px;
              height: 5px;
              background-color: @green;
              border-radius: 100%;
              position: absolute;
              top: 16px;
              left: -23px;
            }
          }
        }
      }
      > span {
        display: inline-block;
        vertical-align: top;
        &:hover {
          color: @green;
          text-decoration: underline;
        }
      }
      &.active {
        p {
          display: block;
        }
        .empty-active {
          display: block;
          &:before {
            display: none;
          }
          .subtitle-item {
            display: block;
          }
        }
      }
      &.active > span {
        color: @green;
        // font-weight: bold;
      }
      > span:after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 100%;
        background-color: #e5e5e5;
        border-radius: 100%;
        position: absolute;
        top: 25px;
        left: 7px;
      }
      &:last-child > span:after {
        // background-color: transparent;
      }
      &.active:before {
        background-color: @green;
      }
      &:before {
        content: "";
        display: inline-block;
        width: 5px;
        height: 5px;
        background-color: #e5e5e5;
        border-radius: 100%;
        position: absolute;
        top: 16px;
        left: 5px;
      }
      + li:after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 23px;
        background-color: #e5e5e5;
        border-radius: 100%;
        position: absolute;
        top: -10px;
        left: 7px;
      }
    }
    .icon-arrow {
      height: 35px;
      width: 35px;
      background-size: 15px;
      float: none;
    }
    .back-to-top {
      margin-top: 20px;
      margin-left: 8px;
      pointer-events: auto;
    }
    .small-scroll-y::-webkit-scrollbar-thumb {
      background: rgba(204, 204, 204, 0.4);
    }
    .small-scroll-y::-webkit-scrollbar-track {
      background: rgba(204, 204, 204, 0.4);
    }
  }
  .back-to-top {
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 3px;
    background: url(../../assets/images/icon-arrow.png) center no-repeat; 
    background-color: #e5e5e5;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
</style>