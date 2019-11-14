const router = require('koa-router')()
const fs = require('fs')

const db = require('../common/db.js')
const file = require('../common/file.js')
const convert = require('../common/convert.js')
const config = require('../config.js')

router.prefix('/image')

// 保存头像
router.post('/saveImg', async (ctx,next) => {
  const params = ctx.request
  const {path, nowName, ext} = file.fileInfo(params)
  file.pathExist(path)
  if( params.body.type === 'headIcon' ){
    // 重新命名图片(可以利用重命名指定图片的路径)
    const nextPath = path.replace(nowName, params.body.account) + '.' + ext
    fs.renameSync(path,nextPath)
    const headIcon = `http://${config.server_baseUrl}:${config.server_port}/images/headIcon/${nextPath.slice(nextPath.lastIndexOf('\\')+1)}`
    await db.query(`update user set 
                      headIcon="${headIcon}"
                    where account="${params.body.account}"
    `)
    ctx.body = convert.responseData({
        'fileUrl': headIcon
    })
  }
})

module.exports = router