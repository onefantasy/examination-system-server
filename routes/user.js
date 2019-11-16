const router = require('koa-router')()
const db = require('../common/db.js')
const convert = require('../common/convert.js')

router.prefix('/user')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

// 注册验证
router.post('/register', async (ctx, next) => {
  const params = ctx.request.body
  const flag = await db.isExist(params, 'user', 'account')
  if (!flag) ctx.body = convert.responseData({ isRegister: 0 }, '该账号已经被注册了!')
  else {
    const res = await db.query(`insert into user(account,password,status) values("${params.account}","${params.password}","${params.status}")`)
    ctx.body = convert.responseData({ isRegister: 1 })
  }
})

// 登录验证
router.post('/proving', async (ctx, next) => {
  console.log('接收到的参数：', ctx.request.body)
  const params = ctx.request.body
  const result = await db.query(`select password,status from user where account="${params.account}"`)
  if (result.length === 0) {
    ctx.body = convert.responseData({ 'isLogin': false }, '该账号不存在')
  } else if (result[0].password === params.password) {
    ctx.set('Access-Control-Expose-Headers','Set-Cookie')
    // ctx.append('Auth','Onefantasy')
    ctx.session.username = params.account
    ctx.body = convert.responseData({ 'isLogin': true, 'status': result[0].status })
  } else {
    ctx.body = convert.responseData({ 'isLogin': false }, '密码不正确')
  }
})

// 获取用户信息
router.post('/getInfo', async (ctx, next) => {
  console.log('接收到的参数：', ctx.request.body)
  const params = ctx.request.body
  const result = await db.query(`select * from  user where account="${params.account}"`)
  console.log('session查询结果:',ctx.session.username)
  if (result.length === 0 || !ctx.session.username) {
    ctx.body = convert.responseData({ 'isGet': false }, '不存在该用户的信息')
  } else {
    // 删除掉密码信息
    result[0].password = undefined
    ctx.body = convert.responseData({ 'data': result[0], 'isGet': true })
  }
})

// 设置用户信息
router.post('/setInfo', async (ctx, next) => {
  const params = ctx.request.body
  const flag = await db.isExist(params, 'user', 'account')
  if (flag) {
    ctx.body = convert.responseData({ 'isSet': false }, '该账号不存在')
  } else {
    // 生成设置值的语句
    // 过滤掉值为空的项并且生成插入值的语句，然后拼接起来
    console.log('session查询结果：',ctx.session.username)
    const sqlStr = ['school','class','name','number','sex','age'].map(item => {
      return !!params[item] ? `${item}="${params[item]}"` : `${item}=null`
    }).join(',')
    // 更新用户信息到数据库
    await db.query(`update user set ${sqlStr} where account="${params.account}"`)
    ctx.body = convert.responseData({ 'isSet': true })
  }
})

module.exports = router
