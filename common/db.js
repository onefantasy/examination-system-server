const mysql = require('mysql')
const config = require('../config.js')

// 建立连接的方法
function _connection(){
	const connection = mysql.createConnection(config.sql)
	connection.connect()
	return connection
}

// 生成对数据库进行查询的操作语句
/* exports.select = function (target,table,condition,isAnd = true){
	if(typeof(condition) !== 'String'){
		let 
	}
	return `select ${target.join(',')} from ${table} where `
} */

// 对数据库进行操作
const query = (sql) => {
	// 1.获取数据库连接对象
	const connection = _connection()
	return new Promise(function(resolve,reject){
		// 2. 执行sql语句
		connection.query(sql,function(err,resulte,fields){
			if(err) reject(err)
			console.log('数据库操作结果 >> ',resulte)
			resolve(resulte)
		})
		// 3. 关闭链接
		connection.end()
	})
}

// 查询某个表中是否存在某条数据
const isExist = async (params,table,condition) => {
	console.log('接收到的参数：',params)
	const result = await query(`select ${condition} from ${table} where ${condition}="${params[condition]}"`)
	return result.length === 0
}

module.exports = {
	query,
	isExist
}