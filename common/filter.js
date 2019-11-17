const convert = require('./convert.js')

const filter = {}

// 请求拦截器
filter.request = (ctx) => {
	// 进行验证
	// 如果是登录操作，则不进行验证
	if(ctx.originalUrl === '/user/proving') return true
	// 其他情况进行验证
	if(!ctx.session.username){
		ctx.body = JSON.stringify({'isReLogin':true})
	} else if (ctx.cookies.get('koa:sess')) {
		const cookieValue = ctx.cookies.get('koa:sess')
		const b = new Buffer(cookieValue,'base64')
		console.log('请求携带的cookie:',b.toString())
		console.log('对应的session的key：',ctx.session)
	}

	return ctx.session.username && ctx.cookies.get('koa:sess')
}

module.exports = filter