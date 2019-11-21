const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// koa-bodyparser 与 koa-body 不可同时使用，为了使用上传文件和图片，只能使用koa-body
// const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
// 用户接收上传的图片和文件
const koaBody = require('koa-body')
const path = require('path')

const index = require('./routes/index')
const user = require('./routes/user')
const image = require('./routes/image')

// 引入自定义的配置
const config = require('./config.js')
// 引入与请求拦截器
const filter = require('./common/filter.js')

// 决解跨域以及options请求
app.use(
    cors({
        origin: function(ctx) { //设置允许来自指定域名请求
            if (ctx.url === '/test') {
                return '*'; // 允许来自所有域名请求
            }
            return 'http://localhost:8081'; //只允许http://localhost:8081这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept','token'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','token'] //设置获取其他自定义字段
    })
);

// error handler
onerror(app)

// middlewares
// 与 koa-body冲突
/* app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
})) */
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
// koa-body 配置
app.use(koaBody({
  multipart: true,
  formidable: {
    // 设置上传的文件的大小限制
    maxFileSize: 1024 * 1024 * 2,    
    // 设置文件的默认保存目录，不设置则保存在系统的临时目录下
    uploadDir: path.resolve(__dirname,'./public/images/headIcon')
  }
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 在请求处理前，先进拦截验证，检查登录状态是否已经过期
app.use(async (ctx,next) => {
  const result = filter.request(ctx)
  if(result)
    await next()
  else
    ctx.body = JSON.stringify({'isReLogin': true})
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(image.routes(), image.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error:')
  console.error(err)
  console.log('ctx content ',ctx)
});

module.exports = app
