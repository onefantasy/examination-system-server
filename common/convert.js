// 该文件用于生成返回数据并进行类型的转换

const jwt = require('jsonwebtoken') 
const config = require('../config.js')

/* 
errcode:
0: 成功执行并且返回

// 1：有关用户个人信息的错误
1001: 账号已经存在
1002：密码错误

// 2: 图片错误
2001: 图片保存失败

// 4：查找不到的错误
4001: 账号不存在

//  5：token出错
5001：无效的token
5002: token已经过期 
*/


function responseData(ctx, data = {}, errcode = 0, message = 'SUCCESS'){
	// 登录成功返回时，设置token
    const token = ctx.originalUrl === '/user/register' ? '':jwt.sign({account:ctx.account},config.token.secret,{expiresIn:config.token.time})
	// 返回数据的处理
	const obj = {
		errcode,
		message,
		data,
		token
	}
	return JSON.stringify(obj)
}

function stringToJson(){
	
}

module.exports = {
	responseData,
}