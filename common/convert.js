// 该文件用于生成返回数据并进行类型的转换

function responseData(data,ctx,description = 'SUCCESS'){
	// 设置生成session
	ctx.session.username = ctx.request.body.account
	// 返回数据的处理
	const obj = {
		description,
		...data,
	}
	return JSON.stringify(obj)
}

function stringToJson(){
	
}

module.exports = {
	responseData,
}