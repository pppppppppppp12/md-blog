import document from '../models/document.js'
import project from '../models/project.js'
import md5 from 'md5'

const docList = async function (ctx) {
  let params = ctx.request.body
  let host = ctx.request.host
  const proData = await project.projectDetail(params)
  let data = await document.docList({
    project_id: proData.project_id,
    stat: 0
  })
  data.forEach((val) => {
    let fileName = getFileName(val.document_id)
    val.file_url = `http://${host}/file/${fileName}.txt`
  })
  ctx.body = {
    code: 0,
    data: {
      project: {
        project_id: proData.project_id,
        name: proData.name
      },
      doc_list: data
    },
    msg: 'succ'
  }
}

const createDoc = async function (ctx) {
  let params = ctx.request.body
  const data = await document.createDoc(params)
  ctx.body = {
    code: 0,
    data: data,
    msg: 'succ'
  }
}

const createFile = async function (ctx) {
  let params = ctx.request.body
  let host = ctx.request.host
  let data = await document.createDoc(params)
  let fileName = getFileName(data.document_id)
  let file = `${fileName}.txt`
  await document.createFile({
    file: file,
    document_id: data.document_id,
    content: params.content
  })
  data.file_url = `http://${host}/file/${file}`
  ctx.body = {
    code: 0,
    data: data,
    msg: 'succ'
  }
}

const updateDoc = async function (ctx) {
  let params = ctx.request.body
  let updateData = {
    name: params.name,
    doc_id: params.doc_id
  }
  await document.updateDoc(updateData, params.document_id)
  ctx.body = {
    code: 0,
    data: [],
    msg: 'succ'
  }
}

const removeDoc = async function (ctx) {
  let params = ctx.request.body
  let updateData = {
    stat: 1
  }
  await document.updateDoc(updateData, params.document_id)
  ctx.body = {
    code: 0,
    data: [],
    msg: 'succ'
  }
}

function getFileName (str) {
  return md5(`${str}0123456789`)
}

export default {
  docList,
  createDoc,
  createFile,
  updateDoc,
  removeDoc
}
