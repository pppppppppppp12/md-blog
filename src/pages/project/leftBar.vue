<template>
  <div class="left-wrapper">
    <h4>
      <span>
        <span @dblclick="showEditModal(selectProject,1)" :title="selectProject.name" 
          v-if="!($store.state.modal.editModal&&!newObj.doc_id&&newObj.type===1)">{{selectProject.name}}</span>
        <input v-else name="newInput" type="text" placeholder="目录名称" v-model="newObj.name" @keyup.enter="saveProject(selectProject)" @click.stop>
        <em v-if="$store.state.user.uid">
          <i class="fa fa-add" @click.stop="showEditModal(selectProject,0)">+</i><i 
            class="fa fa-pencil" @click.stop="showEditModal(selectProject,1)"></i><i 
            class="fa fa-trash-o" @click.stop="showRemoveCommit(selectProject)"></i>
        </em>
      </span>
    </h4>
    <div class="small-scroll-y">
      <ul class="item-list" v-if="$store.state.modal.editModal&&!newObj.doc_id&&newObj.type===0">
        <li class="item-title">
          <i class="fa fa-caret-down"></i>
          <input name="newInput" type="text" placeholder="目录名称" v-model="newObj.name" @keyup.enter="createObj" @click.stop>
        </li>
      </ul>
      <ul class="item-list" v-for="doc in orderList" :key="doc.document_id">
        <li class="item-title" @click="doc.showFlag=!doc.showFlag">
          <i class="fa fa-caret-down" :class="{'fa-caret-right':!doc.showFlag}"></i> 
          <span :title="doc.name" @dblclick="showEditModal(doc)" @click.stop
            v-if="!($store.state.modal.editModal&&newObj.doc_id===doc.document_id)">{{doc.name}}</span>
          <input name="newInput" v-else type="text" placeholder="目录名称" v-model="newObj.name" @keyup.enter="saveDocument(doc)" @click.stop>
          <em class="pull-right" v-if="$store.state.user.uid">
            <i class="fa fa-add">+</i><i 
              class="fa fa-pencil" @click.stop="showEditModal(doc)"></i><i 
              class="fa fa-trash-o" @click.stop="showRemoveCommit(doc)"></i>
          </em>
        </li>
        <li class="item" v-for="docChild in doc.child_list" :key="docChild.document_id"
          v-show="doc.showFlag"
          :class="{'active':$store.state.doc.selectDoc.document_id==docChild.document_id}"
          @click="switchDoc(docChild)">
          <span @dblclick="showEditModal(docChild)" :title="docChild.name" 
            v-if="!($store.state.modal.editModal&&newObj.doc_id===docChild.document_id)">{{docChild.name}}</span>
          <input name="newInput" v-else type="text" placeholder="目录名称" v-model="newObj.name"  @keyup.enter="saveDocument(docChild)" @click.stop>
          <em class="pull-right" v-if="$store.state.user.uid">
            <i class="fa fa-pencil"></i><i 
              class="fa fa-trash-o" @click.stop="showRemoveCommit(docChild)"></i>
          </em>
        </li> 
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        document: {
          list: [],
          obj: {}
        },
        newObj: {
          name: '',
          pid: undefined,
          doc_id: undefined,
          type: 0
        },
        libLevel: 2,
        selectProject: {
          name: '',
          doc_list: []
        }
      }
    },
    computed: {
      selectProjectName () {
        return this.$route.params.pro_name
      },
      orderList () {
        if (!this.document.list) return
        this.document.list.forEach((val) => {
          val.child_list.sort((x, y) => {
            return y['rt'] - x['rt']
          })
        })
        return this.document.list.sort((x, y) => {
          return y['rt'] - x['rt']
        })
      }
    },
    watch: {
      'selectProjectName': 'getDocList'
    },
    created () {
      this.getDocList()
    },
    methods: {
      // 获取文章列表
      getDocList () {
        this.$store.commit('closeModal')
        this.$http.post('/api/doc_list', {
          name: this.selectProjectName
        }).then((res) => {
          if (res.data.code === 0) {
            let data = res.data.data
            let docList = this.initData('document', data.doc_list)
            this.selectProject = {
              name: data.project.name,
              project_id: data.project.project_id,
              doc_list: docList
            }
            // 初始化选定文章详情
            this.getSelectDoc()
          } else {
            this.$warn(res.data.msg)
          }
        }).catch(() => {
          this.$warn('出现异常')
        })
      },
      // 重组数据
      initData (type, data) {
        this.document = {
          list: [],
          obj: {}
        }
        if (!data.length) return ''
        data.forEach((val) => {
          this.document.obj[val.document_id] = val
          if (!val.doc_id) { // 父级
            val.showFlag = true
            val.child_list = []
            this.document.list.push(this.document.obj[val.document_id])
          }
        })
        data.forEach((val) => { // 子级
          if (val.doc_id) {
            this.document.obj[val.doc_id].child_list.push(val)
          }
        })
        return this.document.list
      },
      // 初始化选定doc数据，获取文章
      getSelectDoc () {
        let selectDoc = null
        if (!this.$route.params.doc_id) { // 没有路由参数 doc_id
          let docArr = []
          for (let i = 0; i < this.orderList.length; i++) {
            docArr = docArr.concat(this.orderList[i].child_list)
          }
          selectDoc = docArr[0] ? this.document.obj[docArr[0].document_id] : null
        } else if (this.$route.params.doc_id && this.document.obj[this.$route.params.doc_id]) { // 有路由参数 doc_id
          selectDoc = this.document.obj[this.$route.params.doc_id]
        }
        if (selectDoc) this.$store.dispatch('getDocDetail', selectDoc)
      },
      createObj () {
        let pid = this.newObj.pid
        let docId = this.newObj.doc_id
        let urlType = this.libLevel === 1 ? 'project' : (docId ? 'file' : 'doc')
        let type = this.libLevel === 1 ? 'project' : 'document'
        this.$http.post(`/api/create_${urlType}`, {
          name: this.newObj.name,
          pid: pid,
          doc_id: docId,
          content: docId ? '# content' : undefined
        }).then((res) => {
          if (res.data.code === 0) {
            let data = res.data.data
            if ((this.libLevel === 1 && pid) || (this.libLevel === 2 && docId)) {
              this.document.obj[(this.libLevel === 1 ? pid : docId)].child_list.push(data)
            } else {
              data.child_list = []
              this.document.list.push(data)
            }
            this.$store.commit('closeModal')
            this.document.obj[data[`${type}_id`]] = data
            if (docId) this.switchDoc(this.document.obj[data[`${type}_id`]])
          } else {
            this.$warn(res.data.msg)
          }
        }).catch(() => {
          this.$warn('出现异常')
        })
      },
      showEditModal (obj, type) {
        if (!this.$store.state.user.uid) return
        this.$store.commit('switchProModal', true)
        if (!obj) return
        this.newObj = {
          name: (obj.document_id || type) ? obj.name : '',
          pid: obj.project_id,
          doc_id: obj.document_id,
          type: type // type === 0 为新建，1 为编辑
        }
        this.$nextTick(() => {
          let dom = document.querySelector('input[name="newInput"]')
          if (dom) dom.focus()
        })
      },
      switchDoc (docChild) {
        if (docChild) { // 切换，已有doc数据
          this.$router.push({
            path: '/doc/' + this.selectProjectName + '/' + docChild.document_id
          })
          this.$store.dispatch('getDocDetail', docChild)
        }
      },
      saveProject (project) {
        this.$http.post('/api/update_project', {
          project_id: project.project_id,
          name: this.newObj.name
        }).then(res => {
          if (res.data.code === 0) {
            project.name = this.newObj.name
            this.$store.commit('closeModal')
            this.$store.commit('setProject', project)
            let url = this.$route.params.doc_id ? ('/' + this.$route.params.doc_id) : ''
            this.$router.push({
              path: '/doc/' + project.name + url
            })
          } else {
            this.$warn(res.data.msg)
          }
        }).catch(() => {
          this.$warn('出现异常')
        })
      },
      removeProject (project) {
        this.$http.post('/api/remove_project', {
          project_id: project.project_id
        }).then(res => {
          if (res.data.code === 0) {
            project.stat = 1
            this.$store.commit('setProject', project)
            if (this.$route.params.pro_name === project.name) {
              this.$router.push({
                path: '/index'
              })
            }
          } else {
            this.$warn(res.data.msg)
          }
        }).catch(() => {
          this.$warn('出现异常')
        })
      },
      saveDocument (document) {
        this.$http.post('/api/update_doc', {
          document_id: document.document_id,
          name: this.newObj.name
        }).then(res => {
          if (res.data.code === 0) {
            document.name = this.newObj.name
            this.$store.commit('closeModal')
            this.$nextTick(() => {
              if (this.$store.state.doc.selectDoc.document_id === document.document_id) {
                this.$store.commit('setDocument', document)
              }
            })
          } else {
            this.$warn(res.data.msg)
          }
        }).catch(() => {
          this.$warn('出现异常')
        })
      },
      removeDocument (document) {
        this.$http.post('/api/remove_doc', {
          document_id: document.document_id
        }).then(res => {
          if (res.data.code === 0) {
            let parent = null
            this.document.list.forEach((val, index) => {
              if (document.document_id === val.document_id) {
                this.document.list.splice(index, 1)
              } else if (document.doc_id === val.document_id) {
                parent = val
              }
            })
            if (parent) {
              parent.child_list.forEach((val, index) => {
                if (document.document_id === val.document_id) {
                  parent.child_list.splice(index, 1)
                }
              })
            }
          } else {
            this.$warn(res.data.msg)
          }
        }).catch(() => {
          this.$warn('出现异常')
        })
      },
      showRemoveCommit (obj) {
        this.$alert({
          title: '删除目录',
          msg: '确定要删除 ' + obj.name + ' 目录？',
          ok: () => {
            if (!obj.document_id) {
              this.removeProject(obj)
            } else {
              this.removeDocument(obj)
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .left-wrapper {
    position: fixed;
    display: inline-block;
    top: 0;
    left: 0;
    z-index: 2;
    height: 100%;
    color: #666;
    width: 250px;
    padding: 0 0 40px 0;
    border-right: 1px solid #e8e4e4;
    box-shadow: 1px 1px 10px 0 #ddd;
    .small-scroll-y {
      height: 100%;
      vertical-align: top;
      border-top: 0;
      padding: 8px 0;
      pointer-events: auto; // 左侧栏滚动区域内，不可触发滚动文档内容
    }
    h4 {
      line-height: 45px;
      min-height: 45px;
      background-color: #f6f6f6;
      // border-bottom: 1px solid #e8e4e4;
      padding: 0 5px 0 15px;
      pointer-events: auto;
      .modal-item {
        left: 250px;
        top: 0;
        min-width: 120px;
      }
      span {
        display: inline-block;
        &:hover {
          color: #333;
        }
      }
    }
    em {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      color: #666;
      padding: 0 5px;
      text-align: center;
      .fa-add {
        font-size: 18px;
      }
      i:hover {
        color: #111;
      }
      i {
        width: 24px;
        display: inline-block;
        line-height: 45px;
        vertical-align: top;
      }
    }
    .item-list {
      padding: 0 0 2px 0;
      line-height: 35px;
      color: #666;
      em {
        background-color: #f9f9f9;
        display: none;
        i {
          line-height: 35px;
        }
      }
      .item-title {
        font-weight: bold;
        position: relative;
        padding-left: 10px;
        cursor: pointer;
        > i {
          color: #999;
          display: inline-block;
          width: 16px;
          text-align: center;
          &:hover {
            color: #333;
          }
        }
        span:hover {
          color: #333;
        }
      }
      li {
        padding: 0 5px 0 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding-left: 30px;
        position: relative;
        user-select: none;
        &:hover {
          background-color: #f9f9f9;
          em {
            display: inline;
          }
        }
      }
      .item {
        cursor: pointer;
        em {
          color: #6190e8;
          i:hover {
            color: #0755e6;
          }
        }
        &.active, &:hover {
          color: #6190e8;
        }
        span:hover {
          color: #0755e6;
        }
        &.active {
          background-color: #f6f9ff;
          em {
            display: inline;
            background-color: #f6f9ff;
          }
        }
      }
    }
    input {
      height: 28px;
      width: 130px;
      border-radius: 0;
      padding: 0 5px;
    }
  }
</style>