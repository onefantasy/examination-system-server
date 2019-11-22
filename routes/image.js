const router = require('koa-router')()
const fs = require('fs')

const db = require('../common/db.js')
const files = require('../common/files.js')
const convert = require('../common/convert.js')
const config = require('../config.js')

router.prefix('/image')

// 保存头像
router.post('/saveImg', async (ctx,next) => {
  const params = ctx.request
  const {path, ext, file} = files.fileInfo(params)
  // 更改文件的保存路径和名字
  const newPath = files.changePath(path, params, ext)
  if( file.size > 0 && newPath ){
    // 判断需要生成的路径是否存在，若不存在，则进行生成
    files.pathExist(newPath)
    // 重新命名图片 或者 更改文件保存路径(此处保存和更改路径操作)
    fs.renameSync(path, newPath)
    // 网络请求该图片的路径
    const imgUrl = `http://${config.server_baseUrl}:${config.server_port}/images${newPath.split('images')[1].replace(/\\/g,'/')}`
    // 存入数据库(目前仅有存入用户头像的数据库的操作)
    await db.query(`
      update user set 
        headIcon="${imgUrl}"
      where account="${params.body.account}"
    `)
    // 返回前段的文件的路径
    ctx.body = convert.responseData(ctx,{
      'fileUrl': imgUrl
    })
  } else {
    ctx.body = convert.responseData(ctx,{'fileUrl':null},2001,'图片保存失败') 
  }
})

module.exports = router