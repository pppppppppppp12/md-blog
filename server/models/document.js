import { blog } from '../config/db.js'
import idcenter from './idcenter.js'
import fs from 'fs'
import path from 'path'

const documentModel = '../schema/document.js'
const document = blog.import(documentModel)

const docList = async function (data) {
  let res = await document.findAll({
    where: data
  })
  return res
}

const createDoc = async function (data) {
  let params = {
    document_id: await idcenter.getMd5AutoId(idcenter.idKvs.AUTOID_DOCUMENT),
    name: data.name,
    project_id: data.pid,
    doc_id: data.doc_id,
    rt: ~~(new Date().getTime() / 1000),
    version: ~~(new Date().getTime() / 1000)
  }
  let res = await document.create(params)
  return res ? params : res
}

const createFile = function (data) {
  let filePath = path.join(__dirname, '../../file')
  // fs.mkdirSync(filePath) // 存放的文件夹
  fs.writeFile(`${filePath}/${data.file}`, data.content, {
    encoding: 'utf-8',
    mode: 0o775
  }, function (err) {
    if (err) throw err
  })
}

const updateDoc = async function (updateData, documentId) {
  console.log(updateData, {
    where: {
      document_id: documentId
    }
  })
  let res = await document.update(updateData, {
    where: {
      document_id: documentId
    }
  })
  return res
}

export default {
  docList,
  createDoc,
  createFile,
  updateDoc
}
