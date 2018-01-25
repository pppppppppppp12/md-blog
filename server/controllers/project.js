import project from '../models/project.js'
import valid from './valid.js'

const projectList = async function (ctx) {
  let data = await project.projectList()
  ctx.body = {
    code: 0,
    data: data,
    msg: 'succ'
  }
}

const createProject = async function (ctx) {
  // 验证
  const res = await valid.commonValid(ctx)
  if (!res) return

  let params = ctx.request.body
  const data = await project.createProject(params)
  ctx.body = {
    code: 0,
    data: data,
    msg: 'succ'
  }
}

const updateProject = async function (ctx) {
  // 验证
  const res = await valid.commonValid(ctx)
  if (!res) return

  let params = ctx.request.body
  let updateData = {
    name: params.name,
    pid: params.pid
  }
  await project.updateProject(updateData, params.project_id)
  ctx.body = {
    code: 0,
    data: [],
    msg: 'succ'
  }
}

const removeProject = async function (ctx) {
  // 验证
  const res = await valid.commonValid(ctx)
  if (!res) return

  let params = ctx.request.body
  let updateData = {
    stat: 1
  }
  await project.updateProject(updateData, params.project_id)
  ctx.body = {
    code: 0,
    data: [],
    msg: 'succ'
  }
}

export default {
  projectList,
  createProject,
  updateProject,
  removeProject
}
