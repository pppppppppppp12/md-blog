// 验证层（权限与数据）
import user from './user.js'
import joi from 'joi'

const commonValid = async function (ctx, schema) {
  let userInfo = authValid(ctx)
  if (!userInfo) return false // 权限验证出错

  if (schema) {
    let dataValidFlag = dataValid(ctx, schema)
    if (!dataValidFlag) return false // 数据格式验证出错
  }

  return userInfo // 返回用户信息
}

const dataValid = async function (ctx, schema) { // 数据格式验证
  const params = ctx.request.body
  const res = joi.validate(params, schema)

  if (res.error) {
    ctx.body = {
      code: 5,
      data: null,
      msg: res.error.message
    }
    return false
  }
  return true
}

const authValid = async function (ctx) { // 权限验证
  const url = ctx.request.url
  const userInfo = await user.getUserInfoFromToken(ctx)
  if (!roleList[url]) return userInfo // 不需要权限就可以访问，跳过验证
  if (!userInfo || roleList[url] < userInfo.role) { // 未登录或不够权限
    ctx.body = {
      code: 9,
      data: null,
      msg: '没有权限访问改该接口'
    }
    return false
  }
  return userInfo
}

// 超级管理员: 1
// 普通成员: 1000
// 游客: 99999
const roleList = { // 需要权限才可以访问
  // 用户
  '/api/get_user_info': 1,
  // 目录文档
  '/api/project_list': 1,
  '/api/create_project': 1000,
  '/api/create_doc': 1000,
  '/api/doc_list': 1000,
  '/api/create_file': 1000
}

export default {
  commonValid,
  dataValid,
  authValid
}
