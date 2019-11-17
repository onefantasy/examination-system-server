// 配置服务器端口号
const server_port = '8082'

// 挡墙服务器所在的地址
const server_baseUrl = '127.0.0.1'

// 数据库配置
const sql = {
    database: 'test', //数据库名称
    user: 'root', //mysql用户名
    password: 'password123', //mysql密码
    host: '127.0.0.1' //服务器ip
}

// cookie配置
const cookie = {
    key: 'koa:sess',    // cookie key (默认是koa:session)
    maxAge: 20000,   // cookie的过期时间 (默认的时间是一天)
    overwrite: true,    // 是否可以overwrite
    httpOnly: true,     // cookie是否只有服务器端可以进行访问 (默认是true)
    signed: true,     // 签名（默认是true）
    rolling: true,     // 在每次请求是强行设置cookie，这将重置cookie过期时间（默认是cookie）
    renew: false,   // renew session when session is nearly expired 
}

module.exports = {
	server_port,
    sql,
    server_baseUrl,
    cookie
}