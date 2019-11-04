// 该文件用于生成返回数据并进行类型的转换

function responseData(data,description = 'SUCCESS'){
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