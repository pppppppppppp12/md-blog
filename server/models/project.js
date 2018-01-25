import { blog } from '../config/db.js'
import idcenter from './idcenter.js'

const projectModel = '../schema/project.js'
const project = blog.import(projectModel)

const projectList = async function () {
  let res = await project.findAll({
    where: {
      stat: 0
    }
  })
  return res
}

const projectDetail = async function (where) {
  let res = await project.find({
    where: where
  })
  return res
}

const createProject = async function (data) {
  let params = {
    project_id: await idcenter.getMd5AutoId(idcenter.idKvs.AUTOID_PROJECT),
    pid: data.pid,
    name: data.name,
    rt: ~~(new Date().getTime() / 1000)
  }
  let res = await project.create(params)
  return res ? params : res
}

const updateProject = async function (updateData, projectId) {
  let res = await project.update(updateData, {
    where: {
      project_id: projectId
    }
  })
  return res
}

export default {
  projectList,
  projectDetail,
  createProject,
  updateProject
}
