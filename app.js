// koa 项目依赖
import Koa from 'koa'
import json from 'koa-json' // JSON pretty-printed response middleware
import logger from 'koa-logger' // koa 日志
import koaRouter from 'koa-router' // API配置路由
import koaBodyparser from 'koa-bodyparser' // A body parser for koa，this.body直接获取数据

import historyApiFallback from 'koa2-history-api-fallback'

import auth from './server/routes/auth.js'
import api from './server/routes/api.js'

const app = new Koa()
const router = koaRouter()

app.use(json())
app.use(logger())
app.use(koaBodyparser())

app.use(async function (ctx, next) {
	let start = new Date()
	await next()
	let ms = new Date() - start
	console.log('%s %s - %s', ctx.method, ctx.url, ms)
})

app.use(async function (ctx, next) {
	try {
		await next()
	} catch (err) {
		if(err.status === 401) {
			ctx.body = {
				success: false,
				token: null,
				info: 'Protected resource, use Authorization header to get access'
			}
		}else {
			throw err
		}
	}
})

router.use('/auth', auth.routes()) // /auth请求路径，挂在到koa-router上
router.use('/api', api.routes())

app.use(router.routes()) // 将路由规则挂载到koa
app.use(historyApiFallback())

app.on('error', function (err, ctx) {
	console.log('server error', err)
})

app.listen(8889, () => {
	console.log('koa is listening in 8889');
})

export default app