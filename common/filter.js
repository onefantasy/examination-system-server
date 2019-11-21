const convert = require('./convert.js')
const config = require('../config.js')
const jwt = require('jsonwebtoken')

const filter = {}

// 请求拦截器，进行token验证
filter.request = (ctx) => {
	// 如果是登录操作，则不进行验证
	if(ctx.originalUrl === '/user/proving') return true
	// 如果是注册操作，也不进行验证
	if(ctx.originalUrl === '/user/register') return true
	// 如果不存在token，则不处理请求
	if(!ctx.request.header.token) return false
	try{
		// 验证token，如果token解析出错，会报错，进入catch
		token = jwt.verify(ctx.request.header.token,config.tokenSecret)
		ctx.account = token.account
		console.log('token数据：',token)
	}catch(err){
		return false
	}

	return true
}

module.exports = filter