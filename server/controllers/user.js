import user from '../models/user.js'
import valid from './valid.js'
import jwt from 'jsonwebtoken' // JSON-WEB-TOKEN 登录验证 安装koa-jwt的时候会自动下载这个依赖
import bcrypt from 'bcryptjs'
const secret = 'blog' // 指定密钥，用来判断token合法性的标志

const getUserInfo = async function (ctx) {
  // 验证
  const res = await valid.commonValid(ctx)
  if (!res) return

  const res2 = await user.getUserById(res.id)
  if (res2) {
    ctx.body = {
      code: 0,
      data: {
        id: res2.id,
        user_name: res2.user_name
      },
      msg: 'succ'
    }
  } else {
    ctx.body = {
      code: 1,
      data: null,
      msg: '用户不存在'
    }
  }
}

const getUserToken = async function (ctx) {
  const params = ctx.request.body
  const userInfo = await user.getUserByName(params.name)

  if (userInfo) {
    if (!bcrypt.compareSync(params.password, userInfo.password)) {
      ctx.body = {
        success: false,
        info: '密码错误！'
      }
    } else {
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id
      }
      const token = jwt.sign(userToken, secret, {
        expiresIn: 60 * 60 * 24 // 过期
      }) // 签发token
      ctx.body = {
        code: 0,
        data: token,
        msg: 'succ'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      data: null,
      msg: '用户不存在'
    }
  }
}

const getUserInfoFromToken = async function (ctx) {
  return new Promise((resolve, reject) => {
    const authorization = ctx.headers.authorization
    const token = authorization ? authorization.substr(authorization.search(' ') + 1) : ''

    if (!token) {
      ctx.body = {
        code: 6,
        data: null,
        msg: '请先登录'
      }
      resolve()
    }

    jwt.verify(token, secret, (err, decode) => {
      if (err) { // token过期或伪造
        ctx.body = {
          code: 6,
          data: null,
          msg: '登录已过期或无效'
        }
        resolve()
      } else {
        console.log('decode', decode)
        resolve(decode)
      }
    })
  })
}

export default {
  getUserInfo,
  getUserToken,
  getUserInfoFromToken
}
