// 配置服务器端口号
const server_port = '8082'

// 数据库配置
const sql = {
    database: 'test', //数据库名称
    user: 'root', //mysql用户名
    password: 'password123', //mysql密码
    host: '127.0.0.1' //服务器ip
}

module.exports = {
	server_port,
	sql,
}