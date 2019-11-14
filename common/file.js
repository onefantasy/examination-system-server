// 本js文件是用于对上传的文件进行处理的

const fs = require('fs')

const file = {}

// 获取上传的文件的路径、文件保存时系统设定的名字，文件后缀名
file.fileInfo = (params) => {
  const file = params.files.file
  const path = file.path    // 文件保存路径
  const fname =  file.name  // 源文件名称
  const nowName = path.slice(path.lastIndexOf('\\')+1) // 文件保存时，系统赋予的名字
  // 得到扩展名
  const extArr = fname.split('.')
  const ext = extArr[extArr.length - 1]
  
  return {path, nowName, ext}
}

// 判断相应的文件夹是否存在，如果不存在，则创建，最终就是要指定文件存在
file.folderExist = (folderName) => {
  fs.existsSync(folderName) || fs.mkdirSync(folderName)
}

// 判断一条路径上的文件是否存在，如果不存在，则进行创建
file.pathExist = (path) => {
  console.log('文件路径:',path)
  const pathArr = path.split('\\')
  pathArr.pop()
  let pathCopy = pathArr[0]   // 临时路径
  pathArr.splice(0,1)
  console.log('文件路径（数组）:',pathArr)
  pathArr.forEach(item => {
    pathCopy += `\\${item}`
    // 验证该路径是否存在 或者 创建
    file.folderExist(pathCopy)
  })

  
}

// 文件重命名，更改路径
file.change = (path,params) => {

}

module.exports = file