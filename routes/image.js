const router = require('koa-router')()
const fs = require('fs')

const db = require('../common/db.js')
const convert = require('../common/convert.js')
const config = require('../config.js')

router.prefix('/image')

// 保存头像
router.post('/saveImg', async (ctx,next) => {
  const params = ctx.request
  const file = params.files.file
  const path = file.path    // 文件保存路径
  const fname =  file.name  // 源文件名称
  const nowName = path.slice(path.lastIndexOf('\\')+1) // 文件保存时，系统赋予的名字
  if( file.size > 0 && path ){
    // 得到扩展名
    const extArr = fname.split('.')
    const ext = extArr[extArr.length - 1]
    const nextPath = path.replace(nowName, params.body.account) + '.' + ext
    // 重新命名图片
    fs.renameSync(path,nextPath)
    ctx.body = convert.responseData({
        'fileUrl': `http://${config.server_baseUrl}:${config.server_port}/images/headIcon/${nextPath.slice(nextPath.lastIndexOf('\\')+1)}`
    })
  }
})

module.exports = router