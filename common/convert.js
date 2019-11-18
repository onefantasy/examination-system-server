// 该文件用于生成返回数据并进行类型的转换

const jwt = require('jsonwebtoken') 
const config = require('../config.js')

function responseData(data,ctx,description = 'SUCCESS'){

	// 如果是注册操作，不用进行token设置
	if(ctx.originalUrl === '/user/register') return {isContinue: true}

	// 登录成功返回时，设置token
    const token = ctx.originalUrl === '/user/register' ? '':jwt.sign({account:ctx.request.body.account},config.tokenSecret,{expiresIn:20})

	// 返回数据的处理
	const obj = {
		description,
		...data,
		token
	}
	return JSON.stringify(obj)
}

function stringToJson(){
	
}

module.exports = {
	responseData,
}