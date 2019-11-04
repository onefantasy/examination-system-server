const router = require('koa-router')()
const db = require('../common/db.js')
const convert = require('../common/convert.js')

router.prefix('/user')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

// 注册验证
router.post('/register',async (ctx,next) => {
	console.log('接收到的参数：',ctx.request.body)
	const params = ctx.request.body
	const result = await db.query('select account from user where account=' + params.account)
	if(result.length !== 0) ctx.body = convert.responseData({isRegister:0},'该账号已经被注册了!')
	else {
		const res = await db.query(`insert into user(account,password) values(${params.account},${params.password})`)
		ctx.body = convert.responseData({isRegister:1})
	}
})

// 登录验证
router.post('/proving',async (ctx,next) =>{
  console.log('接收到的参数：',ctx.request.body)
  const params = ctx.request.body
  const result = await db.query('select password from user where account=' + params.account)
  if(result[0].password === params.password){
  	ctx.body = convert.responseData({'isLogin':true})	  	
  }else{
  	ctx.body = convert.responseData({'isLogin':true})
  }
})

module.exports = router
