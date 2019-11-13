const formImage = (form) => {
    return new Promise((resolve,reject) => {
        form((opt,{fields,files}) => {
            console.log('接收到的文件：',files.files)
        })
    })  
}


module.exports = {
    formImage,
}