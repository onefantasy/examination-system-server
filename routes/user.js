const router = require('koa-router')()
const db = require('../common/db.js')
const convert = require('../common/convert.js')
const config = require('../config.js')
const jwt = require('jsonwebtoken') 

router.prefix('/user')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

// 注册验证
router.post('/register', async (ctx, next) => {
  const params = ctx.request.body
  const flag = await db.isExist(params, 'user', 'account')
  if (!flag) ctx.body = convert.responseData({ isRegister: 0 }, ctx,'该账号已经被注册了!')
  else {
    await db.query(`insert into user(account,password,status) values("${params.account}","${params.password}","${params.status}")`)
    ctx.body = convert.responseData({ isRegister: 1 },ctx)
  }
})

// 登录验证
router.post('/login', async (ctx, next) => {
  console.log('接收到的参数：', ctx.request.body)
  const params = ctx.request.body
  const result = await db.query(`select password,status from user where account="${params.account}"`)
  if (result.length === 0) {
    ctx.body = convert.responseData({ 'isLogin': false }, ctx, '该账号不存在',false)
  } else if (result[0].password === params.password) {
    ctx.body = convert.responseData({ 'isLogin': true, 'status': result[0].status },ctx)
  } else {
    ctx.body = convert.responseData({ 'isLogin': false }, ctx, '密码不正确',false)
  }
})

// 获取用户信息
router.post('/info', async (ctx, next) => {
  // console.log('获取token设置的用户信息：',ctx.account)
  console.log('接收到的参数：', ctx.request.body)
  const params = ctx.request.body
  const result = await db.query(`select * from  user where account="${ctx.account}"`)
  if (result.length === 0) {
    ctx.body = convert.responseData({ 'isGet': false }, ctx, '不存在该用户的信息')
  } else {
    // 删除掉密码信息
    result[0].password = undefined
    ctx.body = convert.responseData({ 'data': result[0], 'isGet': true },ctx)
  }
})

// 设置用户信息
router.post('/setInfo', async (ctx, next) => {
  const params = ctx.request.body
  const flag = await db.isExist(params, 'user', 'account')
  if (flag) {
    ctx.body = convert.responseData({ 'isSet': false }, ctx, '该账号不存在')
  } else {
    // 生成设置值的语句
    // 过滤掉值为空的项并且生成插入值的语句，然后拼接起来
    const sqlStr = ['school','class','name','number','sex','age'].map(item => {
      return !!params[item] ? `${item}="${params[item]}"` : `${item}=null`
    }).join(',')
    // 更新用户信息到数据库
    await db.query(`update user set ${sqlStr} where account="${params.account}"`)
    ctx.body = convert.responseData({ 'isSet': true },ctx)
  }
})

module.exports = router
