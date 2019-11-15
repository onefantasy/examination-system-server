// 本js文件是用于对上传的文件进行处理的

const fs = require('fs')

const files = {}

// 获取上传的文件的路径、文件保存时系统设定的名字，文件后缀名
files.fileInfo = (params) => {
  const file = params.files.file
  const path = file.path    // 文件保存路径
  const fname =  file.name  // 源文件名称
  const nowName = path.slice(path.lastIndexOf('\\')+1) // 文件保存时，系统赋予的名字
  // 得到扩展名
  const extArr = fname.split('.')
  const ext = extArr[extArr.length - 1]
  
  return {path, nowName, ext, file}
}

// 判断相应的文件夹是否存在，如果不存在，则创建，最终就是要指定文件存在
files.folderExist = (folderName) => {
  fs.existsSync(folderName) || fs.mkdirSync(folderName)
}

// 判断一条路径上的文件是否存在，如果不存在，则进行创建
files.pathExist = (path) => {
  let pathArr = path.split('\\')
  let pathCopy = pathArr[0]   // 临时路径
  // 去掉已经取出的 0 号元素，和去掉最后不需要的文件名
  pathArr = pathArr.slice(1,pathArr.length-1)
  pathArr.forEach(item => {
    pathCopy += `\\${item}`
    // 验证该路径是否存在 或者 创建
    files.folderExist(pathCopy)
  })
}

// 文件重命名，更改路径
files.changePath = (path,params,ext) => {
  // 分割文件路径，用于重新确定文件的保存路径
  let pathCopy = path.split('\\headIcon')[0]
  if (params.body.type === 'headIcon') {
    pathCopy += `\\headIcon\\${params.body.account}.${ext}`
  } else if (params.body.type === 'paper') {
    // pathCopy += `\\papaer\\${params.body.account}\\`
    pathCopy = null
  } else {
    pathCopy = null
  }
  // 返回新的路径
  return pathCopy
}

module.exports = files