import user from '../controllers/user.js'
import koaRouter from 'koa-router'

const router = koaRouter()

router.post('/user/get_user_info', user.getUserInfo)
router.post('/user', user.getUserToken)

export default router
